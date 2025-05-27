// const express = require('express');
// const router = express.Router();
// const { protect, authorize } = require('../middleware/auth');
// const DeliveryAgent = require('../models/DeliveryAgent');

// // Get all delivery agents
// // GET /api/getDeliveryAgents
// router.get('/getDeliveryAgents', protect, authorize('admin', 'manager'), async (req, res) => {
//   try {
//     const deliveryAgents = await DeliveryAgent.find()
//       .select('-password')
//       .populate('assignedBranch', 'branchName')
//       .sort('name');

//     res.status(200).json({
//       success: true,
//       count: deliveryAgents.length,
//       deliveryAgents
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server Error',
//       error: error.message
//     });
//   }
// });

// // Get single delivery agent
// // GET /api/deliveryAgents/:id
// router.get('/deliveryAgents/:id', protect, async (req, res) => {
//   try {
//     const agent = await DeliveryAgent.findById(req.params.id)
//       .select('-password')
//       .populate('assignedBranch', 'branchName')
//       .populate('activeOrders');

//     if (!agent) {
//       return res.status(404).json({
//         success: false,
//         message: 'Delivery agent not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       agent
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server Error',
//       error: error.message
//     });
//   }
// });

// // Create delivery agent
// // POST /api/deliveryAgents
// router.post('/deliveryAgents', protect, authorize('admin'), async (req, res) => {
//   try {
//     const agent = await DeliveryAgent.create(req.body);

//     res.status(201).json({
//       success: true,
//       agent: {
//         ...agent.toObject(),
//         password: undefined
//       }
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: 'Invalid data',
//       error: error.message
//     });
//   }
// });

// // Update delivery agent
// // PUT /api/deliveryAgents/:id
// router.put('/deliveryAgents/:id', protect, authorize('admin'), async (req, res) => {
//   try {
//     const agent = await DeliveryAgent.findById(req.params.id);

//     if (!agent) {
//       return res.status(404).json({
//         success: false,
//         message: 'Delivery agent not found'
//       });
//     }

//     // Remove password from update data if present
//     if (req.body.password) {
//       delete req.body.password;
//     }

//     const updatedAgent = await DeliveryAgent.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       {
//         new: true,
//         runValidators: true
//       }
//     ).select('-password');

//     res.status(200).json({
//       success: true,
//       agent: updatedAgent
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: 'Invalid data',
//       error: error.message
//     });
//   }
// });

// // Update delivery agent status
// // PUT /api/deliveryAgents/:id/status
// router.put('/deliveryAgents/:id/status', protect, async (req, res) => {
//   try {
//     const { status } = req.body;
    
//     // Validate status
//     const validStatuses = ['Available', 'Busy', 'Offline'];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid status'
//       });
//     }

//     const agent = await DeliveryAgent.findById(req.params.id);

//     if (!agent) {
//       return res.status(404).json({
//         success: false,
//         message: 'Delivery agent not found'
//       });
//     }

//     // Check if agent has active orders before going offline
//     if (status === 'Offline' && agent.activeOrders.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Cannot go offline with active orders'
//       });
//     }

//     agent.status = status;
//     await agent.save();

//     res.status(200).json({
//       success: true,
//       agent
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server Error',
//       error: error.message
//     });
//   }
// });

// // Update delivery agent location
// // PUT /api/deliveryAgents/:id/location
// router.put('/deliveryAgents/:id/location', protect, async (req, res) => {
//   try {
//     const { coordinates } = req.body;

//     if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide valid coordinates [longitude, latitude]'
//       });
//     }

//     const agent = await DeliveryAgent.findById(req.params.id);

//     if (!agent) {
//       return res.status(404).json({
//         success: false,
//         message: 'Delivery agent not found'
//       });
//     }

//     agent.currentLocation.coordinates = coordinates;
//     await agent.save();

//     res.status(200).json({
//       success: true,
//       agent
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server Error',
//       error: error.message
//     });
//   }
// });

// // Add rating to delivery agent
// // POST /api/deliveryAgents/:id/ratings
// router.post('/deliveryAgents/:id/ratings', protect, async (req, res) => {
//   try {
//     const { orderId, rating, comment } = req.body;

//     if (!orderId || !rating || rating < 1 || rating > 5) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide valid order ID and rating (1-5)'
//       });
//     }

//     const agent = await DeliveryAgent.findById(req.params.id);

//     if (!agent) {
//       return res.status(404).json({
//         success: false,
//         message: 'Delivery agent not found'
//       });
//     }

//     // Add new rating
//     agent.ratings.push({
//       orderId,
//       rating,
//       comment
//     });

//     // Calculate new average rating
//     agent.calculateAverageRating();
//     await agent.save();

//     res.status(200).json({
//       success: true,
//       agent
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server Error',
//       error: error.message
//     });
//   }
// });

// // Login delivery agent
// // POST /api/deliveryAgents/login
// router.post('/deliveryAgents/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Validate email & password
//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide email and password'
//       });
//     }

//     // Check for agent
//     const agent = await DeliveryAgent.findOne({ email }).select('+password');

//     if (!agent) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid credentials'
//       });
//     }

//     // Check if password matches
//     const isMatch = await agent.matchPassword(password);

//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: 'Invalid credentials'
//       });
//     }

//     // Create token
//     const token = agent.getSignedJwtToken();

//     res.status(200).json({
//       success: true,
//       token
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server Error',
//       error: error.message
//     });
//   }
// });

// module.exports = router; 