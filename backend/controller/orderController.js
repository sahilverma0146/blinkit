const model = require('../model/Order');
const orderModel = model.Order
const modelB = require('../model/Branch');
const branchModel = modelB.Branch;

exports.placeOrder = async (req, res) => {
  try {
    const { user, cartItems, total, userPincode } = req.body;

    if (!user || !cartItems || !total || !userPincode) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Find branch manager who handles this pincode
    const branchManager = await branchModel.findOne({
      pincodes: userPincode,
      role: "branchManager"
    });

    if (!branchManager) {
      return res.status(404).json({
        success: false,
        message: "No branch manager found for your area",
      });
    }

    // Create new order
    const newOrder = new orderModel({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
      userPincode,
      items: cartItems,
      total,
      branchManagerId: branchManager._id,
      status: "pending",
      orderDate: new Date(),
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({
      success: false,
      message: "Server error while placing order",
    });
  }
};

exports.getAllOrder = async (req, res) => {
  try {
    const orders = await orderModel.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email")
      .populate("branchId", "branchName pincode")
      .populate("deliveryAgentId", "name email")
      .populate("items.productId", "name category");

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


exports.getAssignedOrders = async (req, res) => {
  const agentId = req.user.id;
  const orders = await AssignedOrder.find({ assignedTo: agentId });
  res.json(orders);
};



exports.getOrders = async (req, res) => {
  try {
    const user = req.user; // This will be set by auth middleware

    let orders;
    if (user.role === 'branchManager') {
      // For branch managers, only show orders assigned to them
      orders = await orderModel.find({ branchManagerId: user._id })
        .sort({ orderDate: -1 }); // Most recent first
    } else if (user.role === 'admin') {
      // Admins can see all orders
      orders = await orderModel.find().sort({ orderDate: -1 });
    } else {
      // Regular users can only see their own orders
      orders = await orderModel.find({ userId: user._id })
        .sort({ orderDate: -1 });
    }

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders',
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    console.log("ghhgfg", orderId)
    const { status } = req.body;
    // const user = req.user;

    const order = await orderModel.findById(orderId);
    console.log(order,"skslkdsl")
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }


    order.status = status;
    await order.save();
    console.log(order)

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order,
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating order status',
    });
  }
};
