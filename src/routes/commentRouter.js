import express from "express";

import {
  createComment,
  deleteComment,
  getAllComments,
  getCommentById,
  updateComment,
} from "../controllers/commentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/",protect, createComment);
router.get("/", getAllComments);
router.get("/:id", protect, getCommentById);
router.patch("/:id", protect, updateComment);
router.delete("/:id", protect, deleteComment);

export default router;
