import express from "express";
import { createQuiz, deleteQuiz, getAllQuizzes, getSingleQuiz, updateQuiz } from "../controllers/quizController.js";
 


const quizRouter = express.Router();

quizRouter.get("/", getAllQuizzes);
quizRouter.get("/:id", getSingleQuiz);

quizRouter.post("/", createQuiz);

quizRouter.patch("/:id", updateQuiz);

quizRouter.delete("/:id", deleteQuiz);

export default quizRouter;
