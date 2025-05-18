import express from "express";
import {
  createNotification,
  deleteNotification,
  getNotificationById,
  getNotifications,
  updateNotification,
} from "../controllers/notificationController.js";
import { protect } from "../middleware/auth.js";
const router = express.Router();
router.post("/", protect, createNotification);
router.get("/", protect, getNotifications);
router.get("/:id", protect, getNotificationById);
router.put("/:id", protect, updateNotification);
router.delete("/:id", protect, deleteNotification);

export default router;
