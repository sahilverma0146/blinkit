const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  oldPrice: {
    type: Number,
  },
  weight: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true
});

// Static method to find products by pincode
productSchema.statics.findByPincode = async function(pincode) {
  try {
    // Find all branches that serve this pincode
    const branches = await mongoose.model('Branch').find({ 
      pincodes: pincode
    });
    
    if (!branches || branches.length === 0) {
      return [];
    }

    const branchIds = branches.map(branch => branch._id);
    
    // Find all products from these branches that are available
    return this.find({ 
      branch: { $in: branchIds }, 
      isAvailable: true,
      inStock: true
    });
  } catch (error) {
    console.error('Error in findByPincode:', error);
    throw error;
  }
};

// Static method to find products by branch
productSchema.statics.findByBranch = function(branchId) {
  return this.find({ 
    branch: branchId, 
    isAvailable: true 
  });
};

module.exports = mongoose.model('Product', productSchema);
