import cloudinary from "../lib/uploadToCloudinary.js";
import { AppError } from "../middleware/errorHandler.js";
import { prisma } from "../models/index.js";

export const createLesson = async (req, res, next) => {
  try {
    const { title, content, moduleId } = req.body;
    const userId = req.user?.id || "67debbfbd62e2129820291dc"; // Fallback user ID for testing
    const videoFile = req.file;

    if (!userId) return next(new AppError("Unauthorized request", 401));
    if (!title || !moduleId)
      return next(new AppError("Title and moduleId are required", 400));

    let videourl = null;
    if (videoFile) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(
          videoFile.path,
          {
            resource_type: "video",
            folder: "course_lessons",
            upload_preset: "lesson_videos",
          }
        );
        videourl = uploadResponse.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return next(new AppError("Failed to upload video", 500));
      }
    }
    const newLesson = await prisma.lesson.create({
      data: {
        title,
        content,
        videoUrl: videourl || null,
        moduleId,
        deletedAt: null, // Ensure deletedAt is explicitly set to null
      },
    });

    res.status(201).json(newLesson);
  } catch (error) {
    next(error);
  }
};

export const getLessons = async (req, res, next) => {
  try {
    const lessons = await prisma.lesson.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(lessons);
  } catch (error) {
    next(error);
  }
};


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

export const updateLesson = async (req, res, next) => {
  try {
    const { id } = req.params;
    // const { title, content, videoUrl } = req.body;
    const videoFile = req.file;
    const existingLesson = await prisma.lesson.findUnique({ where: { id } });
    if (!existingLesson) return next(new AppError("Lesson not found", 404));

    let videourl = null;
    if (videoFile) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(
          videoFile.path,
          {
            resource_type: "video",
            folder: "course_lessons",
            upload_preset: "lesson_videos",
          }
        );
        videourl = uploadResponse.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return next(new AppError("Failed to upload video", 500));
      }
    }

    const updatedLesson = await prisma.lesson.update({
      where: { id },
      data: {
        ...req.body,
        videoUrl: videourl || existingLesson?.videoUrl ,
      },
    });

    res.status(200).json(updatedLesson);
  } catch (error) {
    next(error);
  }
};
 
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
