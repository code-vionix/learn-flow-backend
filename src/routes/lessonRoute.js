import express from "express";
import { createLesson, deleteLesson, getLessonById, getLessons, updateLesson } from "../controllers/lessonController.js";
 
const lessonRouter = express.Router();
lessonRouter.post("/", createLesson);
lessonRouter.get("/", getLessons);
lessonRouter.get("/:id", getLessonById);
lessonRouter.put("/:id", updateLesson);
lessonRouter.delete("/:id", deleteLesson);
export default lessonRouter;
