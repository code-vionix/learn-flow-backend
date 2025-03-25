import express from "express";
import {
  createInstructorRating,
  deleteInstructorRating,
  getInstructorRatings,
  updateInstructorRating,
} from "../controllers/instructorRatingController.js";

const router = express.Router();

router.post("/", createInstructorRating);
router.get("/:instructorId", getInstructorRatings);
router.put("/:ratingId", updateInstructorRating);
router.delete("/:ratingId", deleteInstructorRating);

export default router;
