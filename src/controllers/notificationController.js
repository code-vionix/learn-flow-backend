import { AppError } from "../middleware/errorHandler.js";
import { prisma } from "../models/index.js";

// @desc    Create a new notification
// @route   POST /api/v1/notifications
// @access  Private
export const createNotification = async (req, res, next) => {
  try {
    const { message } = req.body;
    const userId = req.user?.id || "67debbfbd62e2129820291dc"; // Fallback user ID for testing

    // Check if user is authenticated
    if (!userId) {
      return next(new AppError("Unauthorized request", 401));
    }

    // Validate that the message is provided
    if (!message) {
      return next(new AppError("Message is required", 400));
    }

    // Create a new notification in the database
    const newNotification = await prisma.notification.create({
      data: { userId, message },
    });

    res.status(201).json(newNotification); // Send response with the created notification
  } catch (error) {
    next(error); // Pass errors to the error handler middleware
  }
};

// @desc    Get notifications for a user
// @route   GET /api/v1/notifications
// @access  Private
export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user?.id || "67debbfbd62e2129820291dc"; // Fallback user ID for testing

    // Check if user is authenticated
    if (!userId) {
      return next(new AppError("Unauthorized request", 401));
    }

    // Fetch all notifications for the user, ordered by latest first
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    // Return a message if no notifications are found
    if (!notifications.length) {
      return res.status(200).json({ message: "No notifications found" });
    }

    res.status(200).json(notifications); // Send notifications to the client
  } catch (error) {
    next(error);
  }
};
// @desc    Get a single notification
// @route   GET /api/v1/notifications/:id
// @access  Private
export const getNotificationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification || notification.userId !== userId) {
      return next(new AppError("Notification not found", 404));
    }

    res.status(200).json(notification);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a notification
// @route   PUT /api/v1/notifications/:id
// @access  Private
export const updateNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const userId = req.user?.id;

    if (!message) return next(new AppError("Message is required", 400));

    const existingNotification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!existingNotification || existingNotification.userId !== userId) {
      return next(new AppError("Notification not found", 404));
    }

    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: { message },
    });

    res.status(200).json(updatedNotification);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a notification
// @route   DELETE /api/v1/notifications/:id
// @access  Private
export const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const existingNotification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!existingNotification || existingNotification.userId !== userId) {
      return next(new AppError("Notification not found", 404));
    }

    await prisma.notification.delete({ where: { id } });

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    next(error);
  }
};
