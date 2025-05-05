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
  
    const ratings = await prisma.instructorRating.findMany({
      where: {
        instructorId,
        deletedAt: null, // Fetch only active ratings
      },
      include: {
        user: true,
        instructor: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Return ratings
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
    const userId = "67debbfbd62e2129820291dc"; // Replace with `req.user?.id` in production

    // Validate input
    if (!ratingId) {
      return next(new AppError("Rating ID is required", 400));
    }
    if (!userId) {
      return next(new AppError("Unauthorized request", 401));
    }

    // Check if the rating exists
    const existingRating = await prisma.instructorRating.findUnique({
      where: { id: ratingId },
    });

    if (!existingRating) {
      return next(new AppError("Rating not found", 404));
    }

    // Check if `deletedAt` exists and is not null
    if (existingRating.deletedAt !== null) {
      return next(new AppError("Rating has already been deleted", 410));
    }

    // Ensure the user deleting the rating is the one who created it
    if (String(existingRating.userId) !== String(userId)) {
      return next(new AppError("You can only delete your own rating", 403));
    }

    // Soft delete the rating
    await prisma.instructorRating.update({
      where: { id: ratingId },
      data: { deletedAt: new Date() },
    });

    res.status(200).json({
      success: true,
      message: "Rating deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
