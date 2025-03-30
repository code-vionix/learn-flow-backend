import express from "express";
import {
  createLesson,
  getLessonById,
  getLessons,
  updateLesson,
} from "../controllers/lessonController.js";
const router = express.Router();
router.post("/", createLesson);
router.get("/", getLessons);
router.get("/:id", getLessonById);
router.put("/:id", updateLesson);
export default router;
