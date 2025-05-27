require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5001', // Replace with your frontend URL
  credentials: true
}));

// Import routes
const authController = require("./controller/authController");
const branchController = require('./controller/branchManagerController');
const inventoryController = require('./controller/inventoryController')
const branchLocationController = require('./controller/branchController')
const orderController = require('./controller/orderController');
const homeController = require('./controller/homeProducts')
const authMiddleware = require('./middleware/auth');
const riderController = require('./controller/riderContoller')
const DeliveryContoller = require('./controller/deliveryAgentController.js')
// const riderRoutes = require('./routes/riderRoutes');

// Routes
const router = express.Router();
app.use("/api", router);
// app.use("/api/rider", riderRoutes);

// Auth routes
router.post("/register", authController.register);
router.post("/login", authController.login); 

// Branch routes
router.post('/branch', branchLocationController.branch)
router.post('/BranchManager', branchController.createBranchManager)

// Order routes
router.post('/placeorder', orderController.placeOrder);
router.get('/orders', authMiddleware, orderController.getOrders);
router.put('/orders/:orderId/status', orderController.updateOrderStatus);

// Product routes
router.post('/newProduct', inventoryController.createProduct);
router.post('/listProduct', inventoryController.listProducts);
router.get('/product/:productId', inventoryController.getProduct);
router.put('/product/:productId', inventoryController.updateProduct);
router.delete('/product/:productId', inventoryController.deleteProduct);
router.get('/homeProducts/:pincode', homeController.homeProducts);


router.get('/getDeliveryAgent/:branchId' , riderController.getDeliveryAgent)
router.post('/CreateDeliveryAgent' , riderController.CreateDeliveryAgent)
router.post('/assignDeliveryAgent' , DeliveryContoller.assignDeliveryAgent)
// 
router.post('/getAssignedOrders' , riderController.getAssignedOrders)
router.put('/inventory/update/:productId',inventoryController.updateProduct)




// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://blinkit:blinkit%40123@cluster0.urqoiee.mongodb.net/Blinkit";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connection successful"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Log environment variables (remove in production)
console.log('Environment variables loaded:', {
  JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set',
  PORT: process.env.PORT || 5000
});
