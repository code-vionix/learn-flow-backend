import { AppError } from "../middleware/errorHandler.js";
import { prisma } from "../models/index.js";

// @desc    Create a new lesson
// @route   POST /api/v1/lesson
// @access  Private
export const createLesson = async (req, res, next) => {
  try {
    const { title, content, videoUrl, moduleId } = req.body;
    const userId = req.user?.id || "67debbfbd62e2129820291dc"; // Fallback user ID for testing

    if (!userId) return next(new AppError("Unauthorized request", 401));
    if (!title || !moduleId)
      return next(new AppError("Title and moduleId are required", 400));

    const newLesson = await prisma.lesson.create({
      data: {
        title,
        content,
        videoUrl,
        moduleId,
        deletedAt: null, // Ensure deletedAt is explicitly set to null
      },
    });

    res.status(201).json(newLesson);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all lessons
// @route   GET /api/v1/lesson
// @access  Private

export const getLessons = async (req, res, next) => {
  try {
    const lessons = await prisma.lesson.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(lessons);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single lesson
// @route   GET /api/v1/lesson/:id
// @access  Private
export const getLessonById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lesson = await prisma.lesson.findUnique({ where: { id } });

    if (!lesson) return next(new AppError("Lesson not found", 404));
    res.status(200).json(lesson);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a lesson
// @route   PUT /api/v1/lesson/:id
// @access  Private
export const updateLesson = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, videoUrl } = req.body;

    const existingLesson = await prisma.lesson.findUnique({ where: { id } });
    if (!existingLesson) return next(new AppError("Lesson not found", 404));

    const updatedLesson = await prisma.lesson.update({
      where: { id },
      data: { title, content, videoUrl },
    });

    res.status(200).json(updatedLesson);
  } catch (error) {
    next(error);
  }
};
// @desc    Delete a lesson
// @route   PUT /api/v1/lesson/:id
// @access  Private
export const deleteLesson = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lesson = await prisma.lesson.findUnique({ where: { id } });

    if (!lesson) return next(new AppError("Lesson not found", 404));

    // Update only if deletedAt is null
    if (!lesson.deletedAt) {
      await prisma.lesson.update({
        where: { id },
        data: { deletedAt: new Date() }, // Soft delete
      });

      return res.status(200).json({ message: "Lesson soft deleted" });
    }

    return next(new AppError("Lesson is already deleted", 400));
  } catch (error) {
    next(error);
  }
};
