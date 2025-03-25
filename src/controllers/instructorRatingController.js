import { AppError } from "../middleware/errorHandler.js";
import { prisma } from "../models/index.js";

// @desc    Create a new instructor rating
// @route   POST /api/v1/instructor-ratings
// @access  Private
export const createInstructorRating = async (req, res, next) => {
  try {
    // if (!req.user) {
    //   return next(new AppError("Unauthorized. Please log in.", 401));
    // }
    const { instructorId, rating, comment } = req.body;
    // const userId = req.user.id; // Assuming user info is in req.user from auth middleware
    const userId = "67debbfbd62e2129820291dc";
    if (!instructorId || !rating) {
      return next(new AppError("Instructor ID and rating are required", 400));
    }

    // Check if user already rated this instructor
    const existingRating = await prisma.instructorRating.findFirst({
      where: { userId, instructorId },
    });

    if (existingRating) {
      return next(new AppError("You have already rated this instructor", 400));
    }

    const newRating = await prisma.instructorRating.create({
      data: { userId, instructorId, rating, comment },
    });

    res.status(201).json(newRating);
  } catch (error) {
    next(error);
  }
};

// @desc    Get ratings for a specific instructor
// @route   GET /api/v1/instructor-ratings/:instructorId
// @access  Public
export const getInstructorRatings = async (req, res, next) => {
  try {
    const { instructorId } = req.params;
    // const instructorId = "65fb3b5c8c12345e1a6d7f89";

    const ratings = await prisma.instructorRating.findMany({
      where: { instructorId },
      include: {
        user: {
          select: { firstName: true, lastName: true, imageUrl: true },
        },
      },
    });

    res.status(200).json(ratings);
  } catch (error) {
    next(error);
  }
};

// @desc    Update an instructor rating
// @route   PUT /api/v1/instructor-ratings/:ratingId
// @access  Private
export const updateInstructorRating = async (req, res, next) => {
  try {
    const { ratingId } = req.params;
    const { rating, comment } = req.body;
    // const userId = req.user.id;
    const userId = "67debbfbd62e2129820291dc";

    const existingRating = await prisma.instructorRating.findUnique({
      where: { id: ratingId },
    });

    if (!existingRating) {
      return next(new AppError("Rating not found", 404));
    }

    if (existingRating.userId !== userId) {
      return next(new AppError("You can only update your own rating", 403));
    }

    const updatedRating = await prisma.instructorRating.update({
      where: { id: ratingId },
      data: { rating, comment },
    });

    res.status(200).json(updatedRating);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an instructor rating
// @route   DELETE /api/v1/instructor-ratings/:ratingId
// @access  Private
export const deleteInstructorRating = async (req, res, next) => {
  try {
    const { ratingId } = req.params;
    const userId = req.user.id;

    const existingRating = await prisma.instructorRating.findUnique({
      where: { id: ratingId },
    });

    if (!existingRating) {
      return next(new AppError("Rating not found", 404));
    }

    if (existingRating.userId !== userId) {
      return next(new AppError("You can only delete your own rating", 403));
    }

    await prisma.instructorRating.delete({ where: { id: ratingId } });

    res.status(200).json({ message: "Rating deleted successfully" });
  } catch (error) {
    next(error);
  }
};
