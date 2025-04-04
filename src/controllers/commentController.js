import { prisma } from "../models/index.js";

// Create a new comment
export const createComment = async (req, res) => {
  try {
    const { userId, lessonId, comment } = req.body;

    if (!userId || !lessonId || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newComment = await prisma.comment.create({
      data: { userId, lessonId, comment },
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all comments
export const getAllComments = async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      where: { deletedAt: null },
    });
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a specific comment by ID
export const getCommentById = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { id, deletedAt: null },
    });
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json(comment);
  } catch (error) {
    console.error("Error fetching comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a comment
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const existingComment = await prisma.comment.findUnique({
      where: { id, deletedAt: null },
    });

    if (!existingComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { comment },
    });

    res.status(200).json(updatedComment);
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Soft delete a comment (mark as deleted)
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the comment exists
    const existingComment = await prisma.comment.findUnique({
      where: { id, deletedAt: null },
    });

    if (!existingComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Perform soft delete
    await prisma.comment.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    res.status(200).json({ message: "Comment soft deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
