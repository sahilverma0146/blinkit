// const express = require('express');
// const router = express.Router();
// const { protect, authorize } = require('../middleware/auth');
// const Order = require('../models/Order');
// const DeliveryAgent = require('../models/DeliveryAgent');

// // Get all orders
// // GET /api/orders
// router.get('/orders', protect, async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate('branchId', 'branchName')
//       .populate('deliveryAgentId', 'name email phone')
//       .sort('-createdAt');

//     res.status(200).json({
//       success: true,
//       count: orders.length,
//       orders
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server Error',
//       error: error.message
//     });
//   }
// });

// // Get single order
// // GET /api/orders/:id
// router.get('/orders/:id', protect, async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id)
//       .populate('branchId', 'branchName')
//       .populate('deliveryAgentId', 'name email phone');

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       order
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server Error',
//       error: error.message
//     });
//   }
// });

// // Create new order
// // POST /api/orders
// router.post('/orders', protect, async (req, res) => {
//   try {
//     const order = await Order.create(req.body);

//     res.status(201).json({
//       success: true,
//       order
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: 'Invalid data',
//       error: error.message
//     });
//   }
// });

// // Update order status
// // PUT /api/orders/:orderId/status
// router.put('/orders/:orderId/status', protect, async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { status } = req.body;

//     const order = await Order.findById(orderId);
//     if (!order) {
//       return res.status(404).json({ success: false, message: 'Order not found' });
//     }

//     order.status = status;
//     await order.save();

//     res.json({ success: true, message: 'Order status updated successfully' });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// // Assign delivery agent to order
// router.put('/assignDeliveryAgent', protect, async (req, res) => {
//   try {
//     const { orderId, deliveryAgentId, kilometers, branchId } = req.body;

//     // Validate input
//     if (!orderId || !deliveryAgentId || !kilometers || !branchId) {
//       return res.status(400).json({
//         success: false,
//         message: 'Order ID, Delivery Agent ID, Branch ID, and kilometers are required'
//       });
//     }

//     // Check if kilometers is a valid number
//     if (isNaN(kilometers) || kilometers <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid kilometers value'
//       });
//     }

//     // Find the order
//     const order = await Order.findById(orderId);
//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     // Find the delivery agent
//     const deliveryAgent = await DeliveryAgent.findById(deliveryAgentId);
//     if (!deliveryAgent) {
//       return res.status(404).json({
//         success: false,
//         message: 'Delivery agent not found'
//       });
//     }

//     // Check if delivery agent belongs to the branch
//     if (deliveryAgent.branchId.toString() !== branchId) {
//       return res.status(400).json({
//         success: false,
//         message: 'Delivery agent does not belong to this branch'
//       });
//     }

//     // Check if delivery agent is available
//     if (!deliveryAgent.isActive || deliveryAgent.status !== 'available') {
//       return res.status(400).json({
//         success: false,
//         message: 'Delivery agent is not available'
//       });
//     }

//     // Update order with delivery agent and kilometers
//     order.deliveryAgentId = deliveryAgentId;
//     order.kilometers = kilometers;
//     order.status = 'assigned';
//     await order.save();

//     // Add order to delivery agent's current orders
//     deliveryAgent.currentOrders.push({
//       orderId: order._id,
//       kilometers: kilometers,
//       assignedAt: new Date(),
//       customerName: order.name,
//       customerEmail: order.email,
//       deliveryAddress: order.address,
//       pincode: order.pincode,
//       items: order.items,
//       total: order.total,
//       branchId: branchId
//     });

//     // Update delivery agent's status
//     deliveryAgent.status = 'assigned';
//     await deliveryAgent.save();

//     // Fetch complete order details with populated references
//     const populatedOrder = await Order.findById(orderId)
//       .populate('deliveryAgentId', 'name email phone')
//       .populate('branchId', 'branchName address');

//     res.json({
//       success: true,
//       message: 'Delivery agent assigned successfully',
//       order: populatedOrder
//     });

//   } catch (error) {
//     console.error('Error in assignDeliveryAgent:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message || 'Error assigning delivery agent'
//     });
//   }
// });

// // Get delivery agents for a branch
// router.get('/getDeliveryAgent/:branchId', async (req, res) => {
//   try {
//     const { branchId } = req.params;
//     const deliveryAgents = await DeliveryAgent.find({ 
//       branchId, 
//       isActive: true,
//       status: 'available'
//     }).select('name email phone status');

//     res.json({
//       success: true,
//       deliveryAgents
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message || 'Error fetching delivery agents'
//     });
//   }
// });

// module.exports = router; 