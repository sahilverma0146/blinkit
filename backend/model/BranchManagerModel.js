const mongoose = require("mongoose");

const branchManagerSchema = new mongoose.Schema(
  {
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
    name: String,
    Location: String,
    PhoneNumber: Number,
    pincodes: [String],
    email: { type: String, unique: true },
    password: String,
    role: {
      type: String,
      enum: ["admin", "branchManager", "delivery_agent", "user"],
      default: "branchManager",
    },
  },
  { timestamps: true }
);

exports.BranchManager = mongoose.model("BranchManager", branchManagerSchema);
