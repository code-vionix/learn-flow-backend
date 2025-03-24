import express from "express";
import { createCourse, getAllCourse } from "../controllers/courseController.js";

const router = express.Router();

// Public routes
router.post("/", createCourse);
router.get("/", getAllCourse);
// router.patch("/", createCourse);
// router.put("/", createCourse);

export default router;
