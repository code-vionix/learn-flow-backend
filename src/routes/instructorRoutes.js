import express from "express";
import {
  createInstructor,
  deleteInstructor,
  getAllInstructors,
  getInstructorById,
  getTopInstructor,
  getTopInstructorOfMonth,
  updateInstructor,
} from "../controllers/instructorController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Instructor Routes
router.post("/", protect, createInstructor); // ✅ Create
router.get("/", getAllInstructors); // ✅ Get All
router.get("/top-instructor-of-month", getTopInstructorOfMonth); // ✅ Get All
router.get("/popular-instructor", getTopInstructor); // ✅ Get All
router.get("/:id", getInstructorById); // ✅ Get Single
router.put("/:id", updateInstructor); // ✅ Update
router.delete("/:id", deleteInstructor); // ✅ Delete

export default router;
