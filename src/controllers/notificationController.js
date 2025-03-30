import { AppError } from "../middleware/errorHandler.js";
import { prisma } from "../models/index.js";

// @desc    Create a new notification
// @route   POST /api/v1/notification
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

    // Create a new notification in the database with deletedAt set to null explicitly
    const newNotification = await prisma.notification.create({
      data: {
        userId,
        message,
        deletedAt: null, // Ensure deletedAt is explicitly set to null
      },
    });

    res.status(201).json(newNotification); // Send response with the created notification
  } catch (error) {
    next(error); // Pass errors to the error handler middleware
  }
};

// @desc    Get notifications for a user
// @route   GET /api/v1/notification
// @access  Private
export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user?.id || "67debbfbd62e2129820291dc"; // Fallback user ID for testing

    // Check if user is authenticated
    if (!userId) {
      return next(new AppError("Unauthorized request", 401));
    }

    // Fetch all notifications where `deletedAt` is `null`, ordered by latest first
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
        deletedAt: null, // Ensure we only return non-deleted notifications
      },
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
// @route   GET /api/v1/notification/:id
// @access  Private
export const getNotificationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || "67debbfbd62e2129820291dc"; // Fallback user ID for testing

    // Find notification where `deletedAt` is `null`
    const notification = await prisma.notification.findFirst({
      where: {
        id,
        userId,
        deletedAt: null, // Ensure we only return non-deleted notifications
      },
    });

    if (!notification) {
      return next(new AppError("Notification not found", 404));
    }

    res.status(200).json(notification);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a notification
// @route   PUT /api/v1/notification/:id
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
// @route   DELETE /api/v1/notification/:id
// @access  Private
export const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || "67debbfbd62e2129820291dc"; // Fallback user ID for testing

    // Validate input
    if (!id) {
      return next(new AppError("Notification ID is required", 400));
    }
    if (!userId) {
      return next(new AppError("Unauthorized request", 401));
    }

    // Check if the notification exists
    const existingNotification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!existingNotification) {
      return next(new AppError("Notification not found", 404));
    }

    // Ensure the user deleting the notification is the one who created it
    if (String(existingNotification.userId) !== String(userId)) {
      return next(
        new AppError("You can only delete your own notification", 403)
      );
    }

    // Check if `deletedAt` exists and is not null (Already deleted)
    if (existingNotification.deletedAt !== null) {
      return next(new AppError("Notification has already been deleted", 410));
    }

    // Soft delete the notification
    await prisma.notification.update({
      where: { id },
      data: { deletedAt: new Date() }, // Mark as deleted
    });

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
