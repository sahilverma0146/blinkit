const model = require("../model/Inventory");
const inventorymodel = model.Inventory;

require('dotenv').config()
console.log(process.env) 

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      id,
      price,
      oldprice,
      inStock,
      category,
      branchPincode,
      weight,
      quantity
    } = req.body;

    if ( !name || !price  || !inStock) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const newProduct = new inventorymodel({
      name,
      id,
      price,
      inStock,
      oldprice,
      category,
      branchPincode,
      weight,
      quantity
    });

    await newProduct.save();

    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.listProducts = async (req, res) => {
  const { pincode } = req.body;

  if (!pincode) {
    return res.status(400).json({success:false , message: "pincode is required" });
  }

  try {
    const products = await inventorymodel.find({ branchPincode:pincode }); // Assumes each product has a `branchId` field
    res.status(200).json({ success: true, products });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
