import express from "express";
import { createTestimonial, deleteTestimonial, getAllTestimonial, getTestimonialById, updateTestimonial } from "../controllers/testimonialController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Instructor Routes
router.post("/", createTestimonial);       // ✅ Create
router.get("/", getAllTestimonial);        // ✅ Get All
router.get("/:id", getTestimonialById);    // ✅ Get Single
router.put("/:id", updateTestimonial);     // ✅ Update
router.delete("/:id", deleteTestimonial);  // ✅ Delete

export default router;