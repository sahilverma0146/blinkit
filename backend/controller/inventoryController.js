const model = require("../model/Inventory");
const inventoryModel = model.Inventory;
const modelB = require("../model/Branch");
const BranchModel = modelB.Branch;

// Create new product in inventory
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      id,
      price,
      oldPrice,
      inStock,
      category,
      branchPincode,
      weight,
      quantity
    } = req.body;

    if (!name || !price || !branchPincode || !category) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    // Check if branch manager exists for this pincode
    const branchManager = await BranchModel.findOne({
      pincodes: branchPincode,
      role: "branchManager"
    });

    if (!branchManager) {
      return res.status(404).json({
        success: false,
        message: "No branch manager found for this pincode",
      });
    }

    const newProduct = new inventoryModel({
      name,
      id,
      price,
      oldPrice,
      inStock: inStock || true,
      category,
      branchPincode,
      weight,
      quantity: quantity || 0
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: newProduct
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// List products by pincode
exports.listProducts = async (req, res) => {
  try {
    const { pincode } = req.body; //123456

    if (!pincode) {
      return res.status(400).json({
        success: false,
        message: "Pincode is required"
      });
    }

    const products = await inventoryModel.find({ branchPincode: pincode });

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const updateData = req.body;

    const updatedProduct = await inventoryModel.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const deletedProduct = await inventoryModel.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await inventoryModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
}; 