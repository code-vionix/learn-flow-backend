import express from "express";import {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUserId,
  updateOrderStatus,
  deleteOrder,
  processPayment
} from "../controllers/order.controller.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

// Protected routes
router.use(protect);

/// Public routes
router.post("/create", createOrder);
router.post("/process-payment", processPayment);
router.get("/user/:userId", getOrdersByUserId);
router.get("/:id", getOrderById);


// Admin only routes
router.use(restrictTo("admin"));


router.get("/", getAllOrders);
router.patch("/:id/status", updateOrderStatus);
router.delete("/:id", deleteOrder);

export default router;
