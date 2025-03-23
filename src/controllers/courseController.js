import { AppError } from "../middleware/errorHandler.js";
import { prisma } from "../models/index.js";

export const createCourse = async (req, res, next) => {
  const { title, teacherId } = req.body;
  try {
    // Create course
    const course = await prisma.course.create({
      data: {
        teacherId,
        title,
      },
    });

    if (!course) {
      return next(new AppError("Course create failed", 400));
    }

    if (course) {
      res.status(201).json(course);
    }
  } catch (error) {
    return next(new AppError("something went wrong", 500));
  }
};
