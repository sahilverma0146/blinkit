// const Product = require("../models/Product");
// const DeliveryAgent = require("../models/DeliveryAgent");
const model = require("../model/OfflineSale");
const offlineSale = model.OfflineSale;

const modelB = require("../model/Branch");
const BranchManager = modelB.Branch;

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.createBranchManager = async (req, res) => {
  try {
    const { name, location, phone, pincodes, email, password } = req.body;

    // Basic validation
    if (!name || !location || !phone || !pincodes || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all fields" });
    }

    // Check if email already exists
    const existingManager = await BranchManager.findOne({ email: email.toLowerCase() });
    if (existingManager) {
      return res.status(400).json({ 
        success: false, 
        message: "Email already registered" 
      });
    }

    // pincodes should be an array - if client sends string, convert to array
    let pincodesArray = pincodes;
    if (typeof pincodes === "string") {
      pincodesArray = pincodes.split(",").map((pin) => pin.trim());
    }

    // Validate pincodes format
    if (!pincodesArray.every(pin => /^\d{6}$/.test(pin))) {
      return res.status(400).json({
        success: false,
        message: "All pincodes must be 6 digits"
      });
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const newBranchManager = new BranchManager({
      name,
      location,
      phone,
      pincodes: pincodesArray,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "branchManager"
    });

    await newBranchManager.save();

    // Create JWT token
    const token = jwt.sign(
      { id: newBranchManager._id, role: "branchManager" },
      process.env.JWT_SECRET || "your_secret_key",
      { expiresIn: "7d" }
    );

    res.status(201).json({ 
      success: true, 
      message: "Branch manager created successfully",
      data: {
        id: newBranchManager._id,
        name: newBranchManager.name,
        email: newBranchManager.email,
        phone: newBranchManager.phone,
        location: newBranchManager.location,
        pincodes: newBranchManager.pincodes,
        role: newBranchManager.role,
        token
      }
    });
  } catch (error) {
    console.error("Error creating branch manager:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.addOfflineSale = async (req, res) => {
  const { productId, quantity, date, time, price } = req.body;
  const sale = new offlineSale({ productId, quantity, date, time });
  await sale.save();
  // await Product.findByIdAndUpdate(productId, { $inc: { quantity: -quantity } });
  res.json({ message: "Offline sale added" });
};
