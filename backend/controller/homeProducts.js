// const { useState } = require('react');
const model = require('../model/Inventory');
const inventorymodel = model.Inventory;

const  modelB = require('../model/Branch');
const branchModel = modelB.Branch;

exports.homeProducts = async (req, res) => {
  try {
    const { pincode } = req.params;

    if (!pincode) {
      return res.status(400).json({
        success: false,
        message: "User pincode is required"
      });
    }

    // Use the static method to find products by pincode
    const products = await inventorymodel.find({ branchPincode: pincode });


    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products available in your area"
      });
    }

    // Populate branch information for the products
    const populatedProducts = await inventorymodel.populate(products, {
      path: 'branch',
      select: 'name location phone pincodes'
    });

    res.status(200).json({
      success: true,
      products: populatedProducts
    });
  } catch (error) {
    console.error("Error in homeProducts:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Get products by branch manager
// exports.getBranchProducts = async (req, res) => {
//   try {
//     const branchId = req.params.branchId;
    
//     const products = await Product.findByBranch(branchId)
//       .populate('branch', 'name location phone')
//       .exec();

//     res.status(200).json({
//       success: true,
//       products: products
//     });
//   } catch (error) {
//     console.error("Error in getBranchProducts:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message
//     });
//   }
// };
