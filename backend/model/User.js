const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  Location: String,
  pincodes: [String],
  phone: Number,
  role: { 
    type: String, 
    enum: ['admin', 'branchManager', 'delivery_agent', 'user'], 
    default: 'user' 
  },
  // branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' }, // Optional for role-based linkage
  token: {type: String}
}, { timestamps: true });

exports.User = mongoose.model('User', userSchema);