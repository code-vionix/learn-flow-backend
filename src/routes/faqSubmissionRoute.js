import express from "express";
import { approveAndAnswerQuestion, deleteSubmission, getAllSubmissions, submitQuestion } from "../controllers/faqSubmissionController.js";
 
 
const router = express.Router();

// ✅ Put all static routes before dynamic ones
router.post("/", submitQuestion);
router.get("/", getAllSubmissions);
router.patch("/:id/approve", approveAndAnswerQuestion);
router.delete("/:id", deleteSubmission); 

export default router;
