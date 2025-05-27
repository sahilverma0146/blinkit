const mongoose =require('mongoose')
const offlineSaleSchema = new mongoose.Schema({
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' },
  quantity: Number,
  date: Date,
  time: String,
  price:String
}, { timestamps: true });

module.exports = mongoose.model('OfflineSale', offlineSaleSchema);
