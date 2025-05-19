import { prisma } from "../models/index.js";
import { AppError } from "../middleware/errorHandler.js";

// @desc    Create a new comment
// @route   POST /api/v1/comments
// @access  Private
export const createComment = async (req, res, next) => {
  try {
    const { text, lessonId, parentId } = req.body;

    // Hardcoded userId for now (replace with actual auth later)
    const userId = "67debbfbd62e2129820291dc";

    if (!userId) {
      return next(new AppError("Unauthorized", 401));
    }

    if (!text || !lessonId) {
      return next(new AppError("Text and lessonId are required", 400));
    }

    const comment = await prisma.comment.create({
      data: {
        text,
        lessonId,
        parentId: parentId || null,
        userId,
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all comments (optionally by lessonId)
// @route   GET /api/v1/comments
// @access  Private
export const getAllComments = async (req, res, next) => {
  try {
    const { lessonId } = req.query;

    const comments = await prisma.comment.findMany({
      where: {
        lessonId: "6826bc13b354b64db00ec91b",
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            imageUrl: true,
          },
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                imageUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single comment by ID
// @route   GET /api/v1/comments/:id
// @access  Private
export const getCommentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        author: true,
        replies: true,
      },
    });

    if (!comment) return next(new AppError("Comment not found", 404));
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a comment
// @route   PATCH /api/v1/comments/:id
// @access  Private
export const updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text) return next(new AppError("Text is required", 400));

    const existing = await prisma.comment.findUnique({ where: { id } });
    if (!existing) return next(new AppError("Comment not found", 404));

    const updated = await prisma.comment.update({
      where: { id },
      data: { text },
    });

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a comment
// @route   DELETE /api/v1/comments/:id
// @access  Private
export const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.comment.findUnique({ where: { id } });
    if (!existing) return next(new AppError("Comment not found", 404));

    await prisma.comment.delete({ where: { id } });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    next(error);
  }
};
