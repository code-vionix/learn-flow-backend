import express from "express";
import userRoutes from "./userRoutes.js";
import { notFound } from "../middleware/errorHandler.js";
import categoryRouter from "./categoryRouter.js";

const router = express.Router();

// API routes
router.use("/users", userRoutes); //api/v1/users
router.use("/category", categoryRouter); //api/v1/category 

// Handle 404 for API routes
router.use(notFound);

export default router;
