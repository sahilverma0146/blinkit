const mongoose = require('mongoose');

const orderDetailsDelivery = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  deliveryAgentId: { type: mongoose.Schema.Types.ObjectId, ref: 'DeliveryAgent'},
  branchId: { type:String},
  kilometers: { type: Number, required: true },
  assignedAt: { type: Date, default: Date.now },

  customerName: String,
  customerEmail: String,
  deliveryAddress: String,
  pincode: String,
  items: Array,
  total: Number,
  Status:String
});

exports.orderAssignedByManager = mongoose.model('orderAssignedByManager', orderDetailsDelivery);
