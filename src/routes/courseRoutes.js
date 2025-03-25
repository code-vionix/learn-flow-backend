import express from "express";
import {
  createCourse,
  DeleteCourse,
  getAllCourse,
  getCourseById,
  UpdateCourse,
} from "../controllers/courseController.js";

const router = express.Router();

// Public routes
router.post("/", createCourse);
router.get("/", getAllCourse);
router.get("/:id", getCourseById);
router.patch("/:id", UpdateCourse);
router.delete("/:id", DeleteCourse);

export default router;
