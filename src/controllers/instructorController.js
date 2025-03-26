import { AppError } from "../middleware/errorHandler.js";
import { prisma } from "../models/index.js";

// create an insttructors
export const createInstructor = async (req, res, next) => {
  const { userId } = req.body;
  // Check if instructor already exists for this user
  const existingInstructor = await prisma.instructor.findUnique({
    where: { userId },
  });

  if (existingInstructor) {
    return next(
      new AppError("Instructor profile already exists for this user", 400)
    );
  }

  // Create instructor
  const instructor = await prisma.instructor.create({
    data: {
      userId,
    },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  if (instructor) {
    res.status(201).json(instructor);
  }
};

// get all instructor
export const getAllInstructors = async (_req, res) => {
  const instructors = await prisma.instructor.findMany({
    where: { deletedAt: null },
    orderBy: {
      createdAt: "desc",
    },
  });

  return res.status(200).json(instructors);
};

// get single instructors by id instructor
export const getInstructorsById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const instructor = await prisma.instructor.findUnique({
      where: { deletedAt: null, id },
    });
    if (!instructor) {
      return next(new AppError("Instructor not found", 404));
    }
    if (instructor) {
      res.status(200).json(instructor);
    }
  } catch (error) {
    next(new AppError("Something went wrong", 500)); // Handle unexpected errors
  }
};

// update instructor
export const updateInstructor = async (req, res, next) => {
  const { id } = req.params;
  const instructorData = req.body;
  try {
    const instructor = await prisma.instructor.findUnique({
      where: { id },
    });
    if (!instructor) {
      throw new AppError("Instructor not found", 404);
    }
    const updateInstructor = await prisma.instructor.update({
      where: { deletedAt: null, id },
      data: instructorData,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (updateInstructor) {
      return res.status(200).json(updateInstructor);
    }
  } catch (error) {
    next(new AppError("Something went wrong", 500));
  }
};

// Delete instructor
export const deleteInstructor = async (req, res, next) => {
  const { id } = req.params;
  try {
    const instructor = await prisma.instructor.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return res.status(202).json({
      instructor: instructor.bio || "",
      status: "success",
      message: "Instructor deleted successfully",
    });
  } catch (error) {
    next(new AppError("Something went wrong", 500));
  }
};
