import express from "express";
import {
  createInstructor,
  deleteInstructor,
  getAllInstructors,
  getInstructorsById,
  updateInstructor,
} from "../controllers/instructorController.js";

const router = express.Router();

// Public routes
router.post("/", createInstructor);
router.get("/", getAllInstructors);
router.get("/:id", getInstructorsById);
router.patch("/:id", updateInstructor);
router.delete("/:id", deleteInstructor);

export default router;
