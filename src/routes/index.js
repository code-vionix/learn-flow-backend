import express from "express";
import userRoutes from "./userRoutes.js";
import { notFound } from "../middleware/errorHandler.js";
import categoryRouter from "./categoryRouter.js";
import subCategoryRouter from "./subCategoryRoute.js";

const router = express.Router();

// API routes
router.use("/users", userRoutes); //api/v1/users
router.use("/category", categoryRouter);  
router.use("/sub_category", subCategoryRouter);

// Handle 404 for API routes
router.use(notFound);

export default router;
