const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      // required: [true, "Location is required"],
      trim: true
    },
    phone: {
      type: String,
      // required: [true, "Phone number is required"],
      // validate: {
      //   validator: function(v) {
      //     return /^\d{10}$/.test(v.toString());
      //   },
      //   message: props => `${props.value} is not a valid phone number! Please enter a 10-digit number.`
      // }
    },
    pincodes:[String],
     
    
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['admin', 'branchManager', 'delivery_agent', 'user'], 
    default: 'branchManager'
    },
  },
  { timestamps: true }
);

// Add index for faster pincode queries
branchSchema.index({ pincodes: 1 });

// Add a method to check if branch serves a specific pincode
branchSchema.methods.servesPincode = function(pincode) {
  return this.pincodes.includes(pincode);
};

// Static method to find branches by pincode
branchSchema.statics.findByPincode = function(pincode) {
  return this.find({ pincodes: pincode });
};

exports.Branch = mongoose.model("Branch", branchSchema);
