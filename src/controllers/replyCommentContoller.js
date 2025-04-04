import { prisma } from "../models/index.js";

// Create a reply
export const createReply = async (req, res) => {
  try {
    const { userId, commentId, reply } = req.body;

    // Validate the request data
    if (!userId || !commentId || !reply) {
      return res
        .status(400)
        .json({ error: "All fields are required: userId, commentId, reply" });
    }

    // Check if the user and comment exist in the database
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    const commentExists = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!commentExists) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Create the reply
    const newReply = await prisma.reply.create({
      data: {
        userId,
        commentId,
        reply,
      },
    });

    res.status(201).json(newReply);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all replies
export const getAllReplies = async (req, res) => {
  try {
    const replies = await prisma.reply.findMany({
      where: { deletedAt: null },
    });

    res.json(replies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific reply by ID
export const getReplyById = async (req, res) => {
  try {
    const { id } = req.params;

    const reply = await prisma.reply.findUnique({
      where: { id, deletedAt: null },
    });

    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }

    res.json(reply);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a reply
export const updateReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    // Ensure the reply field is provided
    if (!reply) {
      return res.status(400).json({ message: "Reply content is required" });
    }

    // Check if the reply exists and is not deleted
    const existingReply = await prisma.reply.findFirst({
      where: { id },
      select: { deletedAt: true },
    });

    if (!existingReply) {
      return res
        .status(404)
        .json({ message: "Reply not found or already deleted" });
    }

    // Update the reply
    const updatedReply = await prisma.reply.update({
      where: { id },
      data: { reply },
    });

    res.status(200).json(updatedReply);
  } catch (error) {
    console.error("Error updating reply:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Soft delete a reply
export const softDeleteReply = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the reply exists and is not already deleted
    const existingReply = await prisma.reply.findFirst({
      where: { id },
      select: { deletedAt: true },
    });

    if (!existingReply) {
      return res
        .status(404)
        .json({ message: "Reply not found or already deleted" });
    }

    // Soft delete the reply by setting deletedAt to the current time
    const deletedReply = await prisma.reply.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    res.status(200).json({ message: "Reply soft deleted", deletedReply });
  } catch (error) {
    console.error("Error soft deleting reply:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
