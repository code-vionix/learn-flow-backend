import express from "express";
import {
  createLesson,
  deleteLesson,
  getLessonById,
  getLessons,
  updateLesson,
} from "../controllers/lessonController.js";
import { createNote, deleteNote, getAllNote, getNoteById, updateNote } from "../controllers/lessonNote.js";
import { createAttachment, deleteAttachment, getAllAttachments, getAttachmentById, updateAttachment } from "../controllers/lessonAttachment.js";
import multer from "multer";

const storage = multer.diskStorage({});
const upload = multer({ storage });
const router = express.Router();

router.post("/", createLesson);
router.post("/note", createNote);
router.post(
  "/attachment",
  upload.single("file"),
  createAttachment
);
router.get("/", getLessons);
router.get("/note", getAllNote);
router.get("/attachment", getAllAttachments);
router.get("/:id", getLessonById);
router.get("/note/:id", getNoteById);
router.get("/attachment/:id", getAttachmentById);

router.patch("/:id", updateLesson);
router.patch("/note/:id", updateNote);
router.patch("/attachment/:id", upload.single("file"), updateAttachment);

router.delete("/:id", deleteLesson);
router.delete("/note/:id", deleteNote);
router.delete("/note/:id", deleteNote);
router.delete("/attachment/:id", deleteAttachment);

export default router;