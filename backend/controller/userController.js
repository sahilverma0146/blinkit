const Product = require('../models/Product');
const Order = require('../models/Order');

exports.searchProduct = async (req, res) => {
  const { query } = req.query;
  const products = await Product.find({ productName: { $regex: query, $options: 'i' } });
  res.json(products);
};

exports.placeOrder = async (req, res) => {
  const { userId, productId, pinCode, paymentMode } = req.body;
  const product = await Product.findById(productId);
  if (!product || product.quantity <= 0) {
    return res.status(400).json({ message: 'Out of Stock' });
  }
  // Logic to check if pinCode is serviceable
  const newOrder = new Order({ userId, productId, pinCode, paymentMode, status: 'Pending' });
  await newOrder.save();
  res.json({ message: 'Order placed' });
};

exports.trackOrder = async (req, res) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId);
  res.json(order);
};
