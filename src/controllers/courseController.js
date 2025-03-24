import { AppError } from "../middleware/errorHandler.js";
import { prisma } from "../models/index.js";

// create courese
export const createCourse = async (req, res, next) => {
  const { title, teacherId } = req.body;
  try {
    if (!title && !teacherId) {
      return next(new AppError("Titel and Teacher requird", 400));
    }
    // Create course
    const course = await prisma.course.create({
      data: {
        teacherId,
        title,
      },
    });

    if (!course) {
      return next(new AppError("Course create failed", 404));
    }

    if (course) {
      res.status(201).json(course);
    }
  } catch (error) {
    return next(new AppError("something went wrong", 500));
  }
};

//Get all course
export const getAllCourse = async (req, res, next) => {
  try {
    // Create course
    const courses = await prisma.course.findMany({
      where: { deletedAt: null },
    });

    // If no courses found, return a meaningful response
    if (courses.length === 0) {
      return next(new AppError("No courses found", 404));
    }

    if (courses) {
      res.status(200).json(courses);
    }
  } catch (error) {
    return next(new AppError("something went wrong", 500));
  }
};

// get course by id
export const getCourseById = async (req, res, next) => {
  const { title, teacherId } = req.body;
  try {
    if (!title && !teacherId) {
      return next(new AppError("Titel and Teacher requird", 400));
    }
    // Create course
    const course = await prisma.course.create({
      data: {
        teacherId,
        title,
      },
    });

    if (!course) {
      return next(new AppError("Course create failed", 404));
    }

    if (course) {
      res.status(201).json(course);
    }
  } catch (error) {
    return next(new AppError("something went wrong", 500));
  }
};

//course update
export const UpdateCourse = async (req, res, next) => {
  const { title, teacherId } = req.body;
  try {
    if (!title && !teacherId) {
      return next(new AppError("Titel and Teacher requird", 400));
    }
    // Create course
    const course = await prisma.course.create({
      data: {
        teacherId,
        title,
      },
    });

    if (!course) {
      return next(new AppError("Course create failed", 404));
    }

    if (course) {
      res.status(201).json(course);
    }
  } catch (error) {
    return next(new AppError("something went wrong", 500));
  }
};

//Delete course
export const DeleteCourse = async (req, res, next) => {
  const { title, teacherId } = req.body;
  try {
    if (!title && !teacherId) {
      return next(new AppError("Titel and Teacher requird", 400));
    }
    // Create course
    const course = await prisma.course.create({
      data: {
        teacherId,
        title,
      },
    });

    if (!course) {
      return next(new AppError("Course create failed", 404));
    }

    if (course) {
      res.status(201).json(course);
    }
  } catch (error) {
    return next(new AppError("something went wrong", 500));
  }
};
