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
    const query = req.query;
    const whereClause = {
      deletedAt: null,
    };

    // Price range (only apply if not using free/paid filters)
    if (query.free !== "true" && query.paid !== "true") {
      if (query.minPrice && query.maxPrice) {
        whereClause.price = {
          gte: parseFloat(query.minPrice),
          lte: parseFloat(query.maxPrice),
        };
      } else if (query.minPrice) {
        whereClause.price = { gte: parseFloat(query.minPrice) };
      } else if (query.maxPrice) {
        whereClause.price = { lte: parseFloat(query.maxPrice) };
      }
    }

    // Free/Paid logic (overrides min/maxPrice if present)
    if (query.free === "true" && query.paid !== "true") {
      whereClause.price = 0;
    } else if (query.paid === "true" && query.free !== "true") {
      whereClause.price = { gt: 0 };
    }

    // Category filter
    if (query.category) {
      const categories = query.category.split(",");
      whereClause.category = { in: categories };
    }

    // SubCategory filter
    if (query.subCategory) {
      const subCategories = query.subCategory.split(",");
      whereClause.subCategory = { in: subCategories };
    }

    // Tools filter
    if (query.tools || query.Tools) {
      const tools = (query.tools || query.Tools).split(",");
      whereClause.tools = { hasSome: tools };
    }

    // Rating filter
    if (query.rating || query.Rating) {
      whereClause.rating = { gte: parseFloat(query.rating || query.Rating) };
    }

    // Course level
    if (query.level || query.CourseLevel) {
      whereClause.level = query.level || query.CourseLevel;
    }

    // Language filter
    if (query.language) {
      whereClause.language = query.language;
    }

    // Tags filter
    if (query.tags) {
      const tags = query.tags.split(",");
      whereClause.tags = { hasSome: tags };
    }

    // Duration range
    if (query.Duration && query.Duration.includes("-")) {
      const [min, max] = query.Duration.split("-").map(Number);
      whereClause.duration = { gte: min, lte: max };
    }

    // Instructor filter
    if (query.instructorId) {
      whereClause.instructorId = query.instructorId;
    }

    // Status filter
    if (query.status) {
      whereClause.status = query.status;
    }

    // Visibility filter
    if (query.visibility) {
      whereClause.visibility = query.visibility;
    }

    const courses = await prisma.course.findMany({
      where: whereClause,
    });

    if (courses.length === 0) {
      return res.status(404).json({ message: "No courses found." });
    }

    return res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    return next(new AppError("Something went wrong", 500));
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
