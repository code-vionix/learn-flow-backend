import express from "express";
import {
  createReply,
  getAllReplies,
  getReplyById,
  softDeleteReply,
  updateReply,
} from "../controllers/replyCommentContoller.js";

const router = express.Router();

router.post("/", createReply);
router.get("/", getAllReplies);
router.get("/:id", getReplyById);
router.patch("/:id", updateReply);
router.delete("/:id", softDeleteReply);

export default router;
