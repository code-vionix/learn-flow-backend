import express from "express";
import {
  createInstructor,
  deleteInstructor,
  getAllInstructors,
  getInstructorById,
  updateInstructor,
} from "../controllers/instructorController.js";

import {
  createInstructorRating,
  deleteInstructorRating,
  getInstructorRatings,
  updateInstructorRating,
} from "../controllers/instructorRatingController.js";

const router = express.Router();

// Instructor Routes
router.post("/", createInstructor); // ✅ Create
router.get("/", getAllInstructors); // ✅ Get All
router.get("/:id", getInstructorById); // ✅ Get Single
router.put("/:id", updateInstructor); // ✅ Update
router.delete("/:id", deleteInstructor); // ✅ Delete

// Instructor Rating Routes
router.post("/ratings/", createInstructorRating);
router.get("/ratings/:instructorId", getInstructorRatings);
router.put("/ratings/:ratingId", updateInstructorRating);
router.delete("/ratings/:ratingId", deleteInstructorRating);

export default router;
