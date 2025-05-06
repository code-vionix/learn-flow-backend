import { buildCourseFilter } from "../lib/courseFilters.js";
import { AppError } from "../middleware/errorHandler.js";
import { prisma } from "../models/index.js";

// create courese
export const createCourse = async (req, res, next) => {
  const {
    title,
    teacherId,
    subtitle,
    categoryId,
    subCategoryId,
    topic,
    language,
    subtitleLanguages,
    level,
    duration,
  } = req.body;

  try {
    // Validate required fields
    if (
      !title ||
      !teacherId ||
      !subtitle ||
      !categoryId ||
      !subCategoryId ||
      !topic ||
      !language ||
      !subtitleLanguages ||
      !level ||
      !duration
    ) {
      return next(new AppError("All fields are required", 400));
    }

    //  level is one of the allowed
    const validLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
    if (!validLevels.includes(level)) {
      return next(new AppError("Invalid level value", 400));
    }

    //  subtitleLanguages is an array
    if (!Array.isArray(subtitleLanguages)) {
      return next(new AppError("subtitleLanguages must be an array", 400));
    }

    // Create the course and include category and subcategory
    const course = await prisma.course.create({
      data: {
        teacherId,
        title,
        subtitle,
        categoryId,
        subCategoryId,
        topic,
        language,
        subtitleLanguages,
        level,
        duration,
        deletedAt: null,
      },
      include: {
        category: true, // Include category details
        subCategory: true, // Include subcategory details
      },
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    return next(new AppError(error.message || "Something went wrong", 500));
  }
};

//Get all course

export const getAllCourse = async (req, res, next) => {
  try {
    const whereClause = buildCourseFilter(req.query);

    // Parse ratings from query
    const ratingQuery = req.query.rating || req.query.Rating;
    const filterRatings = ratingQuery
      ? ratingQuery
          .split(",")
          .map((r) => parseFloat(r))
          .filter((r) => !isNaN(r))
      : [];

    // Fetch all courses matching filters
    const courses = await prisma.course.findMany({
      where: whereClause,
      include: {
        category: {
          include: {
            SubCategory: true, // Include all subcategories within the category
          },
        },
        subCategory: {
          select: { name: true },
        },
        reviews: {
          select: {
            rating: true,
            comment: true,
            userId: true,
            id: true,
          },
        },
      },
    });

    if (!courses.length) {
      return res.status(404).json({ message: "No courses found." });
    }

    // Filter by individual review ratings
    const filteredCourses =
      filterRatings.length === 0
        ? courses
        : courses.filter((course) =>
            course.reviews.some((review) =>
              filterRatings.includes(review.rating)
            )
          );

    // Format course output
    const formattedCourses = filteredCourses.map((course) => {
      const { categoryId, subCategoryId, ...rest } = course;
      return {
        ...rest,
        subCategory: course.subCategory?.name || null,
        category: course.category || null, // full category object including its subcategories
        reviews: course.reviews || [],
      };
    });

    return res.status(200).json(formattedCourses);
  } catch (error) {
    console.error(error);
    return next(new AppError("An error occurred while fetching courses.", 500));
  }
};

// get course by id
export const getCourseById = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!id) {
      return next(new AppError("Course id  requird", 400));
    }

    const course = await prisma.course.findUnique({
      where: { deletedAt: null, id },
    });

    if (!course) {
      return next(new AppError("Course not Found!", 404));
    }

    if (course) {
      res.status(200).json(course);
    }
  } catch (error) {
    return next(new AppError("something went wrong", 500));
  }
};

//course update
export const UpdateCourse = async (req, res, next) => {
  const { id } = req.params;
  const courseData = req.body;
  try {
    const course = await prisma.course.update({
      where: { deletedAt: null, id },
      data: courseData,
    });

    if (!course) {
      return next(new AppError("Course update failed", 404));
    }

    if (course) {
      res.status(200).json(course);
    }
  } catch (error) {
    return next(new AppError("something went wrong", 500));
  }
};

//Delete course
export const DeleteCourse = async (req, res, next) => {
  const { id } = req.params;
  try {
    await prisma.course.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return res.status(202).json({
      status: "success",
      message: "Delete successfully",
    });
  } catch (error) {
    return next(new AppError("something went wrong", 500));
  }
};
