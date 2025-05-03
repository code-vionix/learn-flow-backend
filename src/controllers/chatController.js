 import { AppError } from "../middleware/errorHandler.js";
import { prisma } from "../models/index.js";

// @desc    Save a chat message
// @route   POST /api/v1/chat
// @access  Private
export const saveMsg = async (req, res, next) => {
  try {
    const { message, senderId, receiverId } = req.body;

    if (!message || !senderId || !receiverId) {
      return next(new AppError("Message, senderId, and receiverId are required", 400));
    }

    const newMsg = await prisma.chat.create({
      data: {
        message,
        sender: { connect: { id: senderId } },
        receiver: { connect: { id: receiverId } },
      },
    });

    return res.status(201).json(newMsg);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all messages related to a user
// @route   GET /api/v1/chat/:id
// @access  Private
export const getMsg = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) return next(new AppError("User ID is required", 400));

    const allMsg = await prisma.chat.findMany({
      where: {
        OR: [
          { senderId: id },
          { receiverId: id },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return res.status(200).json({
      msg: "Success",
      data: allMsg,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a single chat message
// @route   DELETE /api/v1/chat/:id
// @access  Private
export const deleteMsg = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) return next(new AppError("Chat message ID is required", 400));

    const deletedMessage = await prisma.chat.delete({
      where: { id },
    });

    return res.status(200).json({
      msg: "Success",
      data: deletedMessage,
    });
  } catch (error) {
    next(error);
  }
};
