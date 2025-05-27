const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const model = require("../model/DeliveryAgent");
const drivingAgentModel = model.DeliveryAgent;

const modelB = require("../model/Order");
const orderModel = modelB.Order;

const modelC = require("../model/DeliveryHistory");
const orderAssignedByManagerModel = modelC.orderAssignedByManager;

exports.getDeliveryAgent = async (req, res) => {
  try {
    const { branchId } = req.params;
    const deliveryAgents = await drivingAgentModel
      .find({ assignedBranch: branchId })
      .select("-password")
      .populate("assignedBranch", "branchName")
      .sort("name");

    res.status(200).json({
      success: true,
      count: deliveryAgents.length,
      deliveryAgents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.CreateDeliveryAgent = async (req, res) => {
  try {
    const { name, email, phone, password, assignedBranch, status  , isActive} = req.body;

    const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds
    const newAgent = new drivingAgentModel({
      name,
      email,
      phone,
      password : hashedPassword,
      assignedBranch,
      isActive,
      status: status || "Available",
    });

    await newAgent.save();

    const agentData = newAgent.toObject();
    delete agentData.password; // hide password in response

    res.status(201).json({
      success: true,
      message: "Delivery agent created successfully",
      data: agentData,
    });
  } catch (error) {
    console.error("Error creating delivery agent:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// const mongoose = require('mongoose');

exports.getAssignedOrders = async (req, res) => {
  try {
    const { riderId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(riderId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Rider ID',
      });
    }

    const assignedOrders = await orderAssignedByManagerModel
      .find({ deliveryAgentId: new mongoose.Types.ObjectId(riderId) })
      .populate({
        path: "orderId",
        select:
          "userName userEmail userPhone userPincode items total status orderDate",
      })
      .sort({ assignedAt: -1 });

    const transformedOrders = assignedOrders.map((assignment) => ({
      _id: assignment._id,
      customerName: assignment.orderId?.userName,
      deliveryAddress: assignment.deliveryAddress ,
      items: assignment.items,
      total: assignment.total,
      kilometers: assignment.kilometers,
      status: assignment.orderId?.status,
      userId:assignment.orderId?._id,

      createdAt: assignment.assignedAt,
      branchId: assignment.branchId,
    }));

    res.status(200).json({
      success: true,
      orders: transformedOrders,
    });
  } catch (error) {
    console.error("Error fetching assigned orders:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching assigned orders",
    });
  }
};
