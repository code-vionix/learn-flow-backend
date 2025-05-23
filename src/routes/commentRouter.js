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

router.post("/", createComment);
router.get("/",protect, getAllComments);
router.get("/:id",protect, getCommentById);
router.patch("/:id", updateComment);
router.delete("/:id", deleteComment);

export default router;
