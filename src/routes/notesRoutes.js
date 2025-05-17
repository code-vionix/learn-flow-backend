// src/routes/noteRoutes.ts
import { Router } from "express";
import noteController from "../controllers/noteController";
// import mockAuth from '../middleware/authMiddleware';

const router = Router();

// router.use(mockAuth);

// Assuming this endpoint updates the instructor's note for a lesson
router.put("/lessons/:lessonId/note", noteController.updateLessonNote);

export default router;
