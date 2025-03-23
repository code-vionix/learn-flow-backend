import express from "express";
import { createCourse } from "../controllers/courseController.js";

const router = express.Router();

// Public routes
router.post("/", createCourse);
// router.get("/", createCourse);
// router.patch("/", createCourse);
// router.put("/", createCourse);

export default router;
