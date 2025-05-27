const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const deliveryAgentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      // unique: true,
      match: [/^[0-9]{10}$/, "Please provide a valid 10-digit phone number"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      // minlength: [6, 'Password must be at least 6 characters'],
      // select: false
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    assignedBranch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
    },

    status: {
      type: String,
      enum: ["available", "unavailable", "assigned"], // ✅ now it's valid
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

exports.DeliveryAgent = mongoose.model("DeliveryAgent", deliveryAgentSchema);
