// src/routes/lessonRoutes.ts
import { Router } from "express";
import lessonController, { upload } from "../controllers/lessonController";
// import mockAuth from '../middleware/authMiddleware';

const router = Router();

// router.use(mockAuth);

// Note: Lesson creation includes moduleId in the path
router.post("/modules/:moduleId/lessons", lessonController.createLesson);
router.put("/:lessonId", lessonController.updateLesson); // Update core lesson fields
router.delete("/:lessonId", lessonController.deleteLesson);

// Content updates (using PUT/PATCH for specific fields)
router.put("/:lessonId/caption", lessonController.updateLessonCaption);
router.put("/:lessonId/content", lessonController.updateLessonContent); // Description

// File Uploads (requires multer middleware)
// 'videoFile' is the name of the field in the multipart/form-data request
router.post(
  "/:lessonId/video",
  upload.single("videoFile"),
  lessonController.uploadLessonVideo
);
router.delete("/:lessonId/video", lessonController.deleteLessonVideo);

export default router;
