import express from "express";
import {
  createNotification,
  deleteNotification,
  getNotificationById,
  getNotifications,
  updateNotification,
} from "../controllers/notificationController.js";
const router = express.Router();
router.post("/", createNotification);
router.get("/", getNotifications);
router.get("/:id", getNotificationById);
router.put("/:id", updateNotification);
router.delete("/:id", deleteNotification);

export default router;
