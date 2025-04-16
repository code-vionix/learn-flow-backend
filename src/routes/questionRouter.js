import express from "express";
import { createQuestion, deleteQuestion, getAllQuestions, getSingleQuestion, updateQuestion } from "../controllers/questionController.js";
 
 


const questionRouter = express.Router();

questionRouter.get("/", getAllQuestions);
questionRouter.get("/:id", getSingleQuestion);

questionRouter.post("/", createQuestion);

questionRouter.patch("/:id", updateQuestion);

questionRouter.delete("/:id", deleteQuestion);

export default questionRouter;
