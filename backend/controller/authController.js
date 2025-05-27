const model = require("../model/User");
const UserModel = model.User;

const modelB = require("../model/Branch");
const BranchModel = modelB.Branch;

const modelC = require("../model/DeliveryAgent");
const DeliveryModel = modelC.DeliveryAgent;

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

// Use the same JWT secret as middleware
const JWT_SECRET = process.env.JWT_SECRET || "blinkit_jwt_secret_key_2024";

// ✅ Register
exports.register = async (req, res) => {
  const { name, email, password, phone, Location, pincodes } = req.body;

  if (!name || !email || !password || !phone || !Location || !pincodes) {
    return res.status(400).json({
      message: "All fields are required",
      success: false,
    });
  }

  try {
    // Check if user already exists
    const existingUser = await UserModel.findOne({
      email: email.toLowerCase(),
    });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
        success: false,
      });
    }

    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create JWT token for the new user
    const token = jwt.sign(
      {
        email: email.toLowerCase(),
        role: "user",
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Create new user
    const user = new UserModel({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      role: "user",
      Location,
      pincodes,
      token,
    });

    await user.save();

    return res.status(201).json({
      message: "User registered successfully",
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        Location: user.Location,
        Pincode: user.pincodes,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  try {
    // Try to find user in User model
    let user = await UserModel.findOne({ email: email.trim().toLowerCase() });
    let role = "user";
    let pincodes = [];

    // If not found, try BranchManager model
    if (!user) {
      user = await BranchModel.findOne({ email: email.trim().toLowerCase() });
      if (user) {
        role = "branchManager";
        pincodes = user.pincodes || [];
      }
    } else {
      pincodes = user.pincodes || [];
    }

    if (!user) {
      user = await DeliveryModel.findOne({ email });
      if (user) {
        role = "delivery_agent";
        pincodes = user.pincodes || [];
      }
    }

    // If still not found, return error
    if (!user) return res.status(401).json({ message: "User not found" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // Generate token with consistent role
    const token = jwt.sign(
      {
        id: user._id,
        role,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Store token in user document
    user.token = token;
    await user.save();

    return res.status(200).json({
      message: "Login successful",
      success: true,
      token,
      role,
      pincodes,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || user.phoneNumber,
        location: user.location || user.Location,
        pincodes,
        role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
