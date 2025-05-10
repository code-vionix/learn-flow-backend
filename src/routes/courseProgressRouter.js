import express from "express";
import { courseProgress } from "../controllers/coursePrgressController.js";

const coursePogressRouter = express.Router();

coursePogressRouter.post("/progress", courseProgress);

export default coursePogressRouter;
