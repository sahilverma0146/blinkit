const model = require("../model/Order");
const orderModel = model.Order;

const modelB = require("../model/DeliveryHistory");
const DeliveredOrdersModel = modelB.orderAssignedByManager;

const DeliveryAgentModel = require("../model/DeliveryAgent");
const DeliveryAgentDetails = DeliveryAgentModel.DeliveryAgent;

exports.assignDeliveryAgent = async (req, res) => {
  try {
    const { orderId, deliveryAgentId, kilometers } = req.body;

    if (!orderId || !deliveryAgentId || !kilometers) {
      return res.status(400).json({
        success: false,
        message: "Order ID, Delivery Agent ID, and kilometers are required",
      });
    }

    if (isNaN(kilometers) || kilometers <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid kilometers value",
      });
    }

    // ✅ Populate branchId so order.branchId._id is defined
    const order = await orderModel
      .findById(orderId)
      .populate(["branchManagerId"]);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const deliveryAgent = await DeliveryAgentDetails.findById(deliveryAgentId);
    if (!deliveryAgent) {
      return res.status(404).json({
        success: false,
        message: "Delivery agent not found",
      });
    }

    if (!deliveryAgent.isActive) {
      return res.status(400).json({
        success: false,
        message: "Delivery agent is not available",
      });
    }

    const deliveredOrderRecord = new DeliveredOrdersModel({
      orderId: order._id,
      deliveryAgentId,
      kilometers,
      assignedAt: new Date(),
      customerName: order.name,
      customerEmail: order.email,
      deliveryAddress: order.address,
      pincode: order.pincode,
      items: order.items,
      total: order.total,
      branchId:order.branchManagerId
      // branchId: order.branchId._id, // ✅ No error now
    });

    await deliveredOrderRecord.save();

    // deliveryAgent.currentOrders.push({
    //   orderId: order._id,
    //   kilometers,
    //   assignedAt: new Date(),
    //   customerName: order.name,
    //   customerEmail: order.email,
    //   deliveryAddress: order.address,
    //   pincode: order.pincode,
    //   items: order.items,
    //   total: order.total,
    //   branchName: order.branchId.branchName,
    //   branchAddress: order.branchId.address,
    // });

    deliveryAgent.status = 'assigned';
    await deliveryAgent.save();

    res.json({
      success: true,
      message: "Delivery agent assigned successfully",
      order: await order.populate("deliveryAgentId", "name email phone"),
    });
  } catch (error) {
    console.error("Error in assignDeliveryAgent:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error assigning delivery agent",
    });
  }
};
