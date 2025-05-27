const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    branchPincode: {
      type: String,
    },
    name: {
      type: String,
    },
    id: {
      type: Number,
    },
    weight: {
      type: Number,
    },
    price: {
      type: Number,
    },
    oldprice: {
      type: Number,
    },
    inStock: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
    },

    quantity: Number, // You can uncomment if needed later
  },
  { timestamps: true }
);

module.exports.Inventory = mongoose.model("Inventory", inventorySchema);
