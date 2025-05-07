import { AppError } from "../middleware/errorHandler.js";
import { prisma } from "../models/index.js";
import { uploadFile } from "../utils/cloudinaryUpload.js";


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
    durationUnit,
    tools,
  } = req.body;

  console.log(res.body);
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
      !duration ||
      !durationUnit
    ) {
      return next(new AppError("All fields are required", 400));
    }

    // Validate level is one of the allowed
    const validLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
    if (!validLevels.includes(level)) {
      return next(new AppError("Invalid level value", 400));
    }

    // subtitleLanguages must be an array
    if (!Array.isArray(subtitleLanguages)) {
      return next(new AppError("subtitleLanguages must be an array", 400));
    }

    // tools can be optional, but if present, must be array
    if (tools && !Array.isArray(tools)) {
      return next(new AppError("tools must be an array if provided", 400));
    }

    // Create the course and include category and subcategory relations
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
        durationUnit,
        tools,
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
export const getAllCourse = async (_req, res, next) => {
  try {
    // Create course
    const courses = await prisma.course.findMany({
      where: { deletedAt: null },
    });

    return res.status(200).json(courses);
  } catch (error) {
    return next(new AppError("something went wrong", 500));
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
    durationUnit,
    tools,
    description,
    whatYouWillLearn,
    targetAudience,
    courseRequirements,
    price,
    discountPrice,
    discountPercentage,
    startDate,
    endDate,
    status,
    visibility,
    deletedAt,

  } = req.body;

  try {
    // Upload files if provided
    const thumbnailFile = req?.files?.thumbnail?.[0];
    const thumbnailUrl = thumbnailFile ? await uploadFile(thumbnailFile, 'courses-thumbnails') : "";

    const imageUrlFile  = req?.files?.imageUrl?.[0];
    const imageUrl = imageUrlFile ? await uploadFile(imageUrlFile, 'courses-images') : "";

    const trailerFile = req?.files?.trailer?.[0];
    const trailerUrl = trailerFile ? await uploadFile(trailerFile, 'courses-trailers') : "";

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id, deletedAt: null },
    });

    if (!existingCourse) {
      return next(new AppError("Course not found", 404));
    }

    // Prepare update data
    const updateData = {
      title: title || existingCourse.title,
      teacherId: teacherId || existingCourse.teacherId,
      subtitle: subtitle || existingCourse.subtitle,
      categoryId: categoryId || existingCourse.categoryId,
      subCategoryId: subCategoryId || existingCourse.subCategoryId,
      topic: topic || existingCourse.topic,
      language: language || existingCourse.language,
      subtitleLanguages: subtitleLanguages || existingCourse.subtitleLanguages,
      level: level || existingCourse.level,
      duration: duration || existingCourse.duration,
      durationUnit: durationUnit || existingCourse.durationUnit,
      tools: tools || existingCourse.tools,
      description: description || existingCourse.description,
      thumbnail: thumbnailUrl || existingCourse.thumbnail,
      trailer: trailerUrl || existingCourse.trailer,
      price: price || existingCourse.price,
      discountPrice: discountPrice || existingCourse.discountPrice,
      discountPercentage: discountPercentage || existingCourse.discountPercentage,
      startDate: startDate || existingCourse.startDate,
      endDate: endDate || existingCourse.endDate,
      imageUrl: imageUrl || existingCourse.imageUrl,
      status: status || existingCourse.status,
      visibility: visibility || existingCourse.visibility,
      deletedAt: deletedAt || existingCourse.deletedAt,
      updatedAt: new Date(),
    };

    // Conditionally update nested relations
    if (whatYouWillLearn) {
      updateData.learnings = {
        deleteMany: {},
        create: whatYouWillLearn.map((item) => ({
          description: item.description,
        })),
      };
    }

    if (targetAudience) {
      updateData.targetAudiences = {
        deleteMany: {},
        create: targetAudience.map((item) => ({
          description: item.description,
        })),
      };
    }

    if (courseRequirements) {
      updateData.PreRequirement = {
        deleteMany: {},
        create: courseRequirements.map((item) => ({
          description: item.description,
        })),
      };
    }

    // Final update
    const updatedCourse = await prisma.course.update({
      where: { id },
      data: updateData,
      include: {
        learnings: true,
        targetAudiences: true,
        PreRequirement: true,
      },
    });

    res.status(200).json(updatedCourse);

  } catch (error) {
    console.error(error);
    return next(new AppError("Something went wrong while updating the course", 500));
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
