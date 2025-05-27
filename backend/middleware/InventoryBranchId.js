const jwt = require("jsonwebtoken");
const User = require("../models/User");

require('dotenv').config()
console.log(process.env) 

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).populate('branchId');
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user; // attach full user to request
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid token" });
  }
};


module.exports = authenticate;
