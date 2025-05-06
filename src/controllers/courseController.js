import { filterByRating } from "../filters/filterByRating.js";
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
    // Build base where clause from query parameters
    let whereClause = buildCourseFilter(req.query);

    // Handle rating filter logic separately
    const ratingFilter = filterByRating(req.query);
    if (Object.keys(ratingFilter).length > 0) {
      whereClause = { ...whereClause, ...ratingFilter }; // Combine with the existing where clause
    }

    // Query the database with filters
    const courses = await prisma.course.findMany({
      where: whereClause,
      include: {
        category: { include: { SubCategory: true } },
        subCategory: { select: { name: true } },
        reviews: {
          select: { rating: true, comment: true, userId: true, id: true },
        },
      },
    });

    // If no courses are found, return a 404 response
    if (!courses.length) {
      return res.status(404).json({ message: "No courses found." });
    }

    // Format the courses data for the response
    const formattedCourses = courses.map((course) => {
      const { categoryId, subCategoryId, ...rest } = course;
      return {
        ...rest,
        subCategory: course.subCategory?.name || null,
        category: course.category || null,
        reviews: course.reviews || [],
      };
    });

    // Return the formatted courses in the response
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
