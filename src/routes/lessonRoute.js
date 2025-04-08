import express from "express";
import {
  createLesson,
  deleteLesson,
  getLessonById,
  getLessons,
  updateLesson,
} from "../controllers/lessonController.js";
const router = express.Router();
router.post("/", createLesson); //"/api/vi"
router.get("/", getLessons);
router.get("/:id", getLessonById);
router.put("/:id", updateLesson);
router.delete("/:id", deleteLesson);
export default router;
