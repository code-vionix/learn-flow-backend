// import cloudinary from "../lib/uploadToCloudinary.js";
// import { AppError } from "../middleware/errorHandler.js";
// import { prisma } from "../models/index.js";

// // @desc    Create a new lesson
// // @route   POST /api/v1/lesson
// // @access  Private
// export const createLesson = async (req, res, next) => {
//   try {
//     const { title, content, moduleId } = req.body;
//     const userId = req.user?.id || "67debbfbd62e2129820291dc"; // Fallback user ID for testing
//     const videoFile = req.file;

//     if (!userId) return next(new AppError("Unauthorized request", 401));
//     if (!title || !moduleId)
//       return next(new AppError("Title and moduleId are required", 400));

//     let videourl = null;
//     if (videoFile) {
//       try {
//         const uploadResponse = await cloudinary.uploader.upload(
//           videoFile.path,
//           {
//             resource_type: "video",
//             folder: "course_lessons",
//             upload_preset: "lesson_videos",
//           }
//         );
//         videourl = uploadResponse.secure_url;
//       } catch (uploadError) {
//         console.error("Cloudinary upload error:", uploadError);
//         return next(new AppError("Failed to upload video", 500));
//       }
//     }
//     const newLesson = await prisma.lesson.create({
//       data: {
//         title,
//         content,
//         videoUrl: videourl || null,
//         moduleId,
//         deletedAt: null, // Ensure deletedAt is explicitly set to null
//       },
//     });

//     res.status(201).json(newLesson);
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get all lessons
// // @route   GET /api/v1/lesson
// // @access  Private

// export const getLessons = async (req, res, next) => {
//   try {
//     const lessons = await prisma.lesson.findMany({
//       orderBy: { createdAt: "desc" },
//     });
//     res.status(200).json(lessons);
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get a single lesson
// // @route   GET /api/v1/lesson/:id
// // @access  Private
// export const getLessonById = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const lesson = await prisma.lesson.findUnique({ where: { id } });

//     if (!lesson) return next(new AppError("Lesson not found", 404));
//     res.status(200).json(lesson);
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Update a lesson
// // @route   PUT /api/v1/lesson/:id
// // @access  Private
// export const updateLesson = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { title, content, videoUrl } = req.body;

//     const existingLesson = await prisma.lesson.findUnique({ where: { id } });
//     if (!existingLesson) return next(new AppError("Lesson not found", 404));

//     const updatedLesson = await prisma.lesson.update({
//       where: { id },
//       data: { title, content, videoUrl },
//     });

//     res.status(200).json(updatedLesson);
//   } catch (error) {
//     next(error);
//   }
// };
// // @desc    Delete a lesson
// // @route   PUT /api/v1/lesson/:id
// // @access  Private
// export const deleteLesson = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     const lesson = await prisma.lesson.findUnique({ where: { id } });

//     if (!lesson) return next(new AppError("Lesson not found", 404));

//     // Update only if deletedAt is null
//     if (!lesson.deletedAt) {
//       await prisma.lesson.update({
//         where: { id },
//         data: { deletedAt: new Date() }, // Soft delete
//       });

//       return res.status(200).json({ message: "Lesson soft deleted" });
//     }

//     return next(new AppError("Lesson is already deleted", 400));
//   } catch (error) {
//     next(error);
//   }
// };

// src/controllers/lessonController.ts
import { Request, Response } from 'express';
import lessonService from '../services/lessonService';
import fileStorageService from '../services/fileStorageService'; // For file operations
import { Prisma, LessonType } from '@prisma/client';
import multer from 'multer'; // Import multer

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Store file in memory as a Buffer
  limits: {
    fileSize: 1024 * 1024 * 100, // Limit file size (e.g., 100MB)
  },
});


const lessonController = {
  async createLesson(req, res) {
    try {
      const moduleId = req.params.moduleId;
      const { title, lessonType, estimatedTime, freePreview } = req.body;

      if (!title) {
        return res.status(400).json({ message: 'Lesson title is required' });
      }

      // Data for creation
      const lessonData = {
          title: title,
          lessonType: lessonType,
          estimatedTime: estimatedTime ? parseInt(estimatedTime, 10) : undefined,
          freePreview: freePreview !== undefined ? Boolean(freePreview) : undefined,
          // order is handled by service
      };

      const newLesson = await lessonService.createLesson(moduleId, lessonData);
      res.status(201).json(newLesson);
    } catch (error) {
      console.error("Error creating lesson:", error);
      res.status(500).json({ message: 'Failed to create lesson', error: (error as Error).message });
    }
  },

  async updateLesson(req, res) {
    try {
      const lessonId = req.params.lessonId;
      // Allow updating title, order, lessonType, estimatedTime, freePreview
      const { title, order, lessonType, estimatedTime, freePreview } = req.body;

      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (order !== undefined) updateData.order = parseInt(order, 10); // Ensure order is number
      if (lessonType !== undefined) updateData.lessonType = lessonType;
      if (estimatedTime !== undefined) updateData.estimatedTime = parseInt(estimatedTime, 10);
      if (freePreview !== undefined) updateData.freePreview = Boolean(freePreview);


      if (Object.keys(updateData).length === 0) {
         return res.status(400).json({ message: 'No update data provided for lesson' });
      }

      const updatedLesson = await lessonService.updateLesson(lessonId, updateData);

      if (!updatedLesson) {
         return res.status(404).json({ message: 'Lesson not found' });
      }

      // Return the updated lesson object
      res.json(updatedLesson);
    } catch (error) {
      console.error("Error updating lesson:", error);
      res.status(500).json({ message: 'Failed to update lesson', error: (error as Error).message });
    }
  },

  async deleteLesson(req, res) {
    try {
      const lessonId = req.params.lessonId;
      await lessonService.deleteLesson(lessonId);
      res.sendStatus(204);
    } catch (error) {
      console.error("Error deleting lesson:", error);
      res.status(500).json({ message: 'Failed to delete lesson', error: (error as Error).message });
    }
  },

   // Content specific updates
  async updateLessonCaption(req, res) {
    try {
      const lessonId = req.params.lessonId;
      const { caption } = req.body; // caption can be string or null

      const updatedLesson = await lessonService.updateLessonCaption(lessonId, caption);

       if (!updatedLesson) {
         return res.status(404).json({ message: 'Lesson not found' });
      }

      res.json({ caption: updatedLesson.caption }); // Return just the updated field
    } catch (error) {
      console.error("Error updating lesson caption:", error);
      res.status(500).json({ message: 'Failed to update lesson caption', error: (error as Error).message });
    }
  },

  async updateLessonContent(req, res) {
    try {
      const lessonId = req.params.lessonId;
      const { content } = req.body; // content (description) can be string or null

      const updatedLesson = await lessonService.updateLessonContent(lessonId, content);

       if (!updatedLesson) {
         return res.status(404).json({ message: 'Lesson not found' });
      }

      res.json({ content: updatedLesson.content }); // Return just the updated field
    } catch (error) {
      console.error("Error updating lesson content:", error);
      res.status(500).json({ message: 'Failed to update lesson content', error: (error as Error).message });
    }
  },

  // File Uploads require multer middleware
  async uploadLessonVideo(req, res) {
    try {
      const lessonId = req.params.lessonId;
      const file = req.file; // File is available here thanks to multer

      if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Use the file storage service to save the file
      const videoUrl = await fileStorageService.uploadFile(file);

      // Update the lesson record with the new video URL
      const updatedLesson = await lessonService.updateLessonVideoUrl(lessonId, videoUrl);

       if (!updatedLesson) {
         // This case is tricky - file uploaded, but lesson update failed.
         // You might want to delete the uploaded file here.
         fileStorageService.deleteFile(videoUrl).catch(console.error);
         return res.status(404).json({ message: 'Lesson not found after video upload' });
      }


      res.json({ videoUrl: updatedLesson.videoUrl }); // Return the URL
    } catch (error) {
      console.error("Error uploading lesson video:", error);
       // Implement cleanup if file was partially uploaded but db update failed
      res.status(500).json({ message: 'Failed to upload lesson video', error: (error as Error).message });
    }
  },

  async deleteLessonVideo(req, res) {
    try {
      const lessonId = req.params.lessonId;

      // Update the lesson to remove the video URL (service handles file deletion)
      const updatedLesson = await lessonService.updateLessonVideoUrl(lessonId, null);

       if (!updatedLesson) {
         return res.status(404).json({ message: 'Lesson not found' });
      }

      res.json({ videoUrl: null }); // Confirm removal
    } catch (error) {
      console.error("Error deleting lesson video:", error);
      res.status(500).json({ message: 'Failed to delete lesson video', error: (error as Error).message });
    }
  },

};

export default lessonController;
export { upload }; // Export upload middleware for routes