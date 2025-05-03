import express from "express";

import {
  createComment,
  deleteComment,
  getAllComments,
  getCommentById,
  updateComment,
} from "../controllers/commentController.js";

const router = express.Router();

router.post("/", createComment);
router.get("/", getAllComments);
router.get("/:id", getCommentById);
router.patch("/:id", updateComment);
router.delete("/:id", deleteComment);

export default router;
