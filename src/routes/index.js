import express from "express";
import userRoutes from "./userRoutes.js";
import instructorRoutes from "./instructorRoutes.js";
import { notFound } from "../middleware/errorHandler.js";
import courseRoutes from "./courseRoutes.js";

const router = express.Router();

// API routes
router.use("/users", userRoutes); //api/v1/users
router.use("/instructors", instructorRoutes); //api/v1/instructors
router.use("/courses", courseRoutes); //api/v1/instructors

// Handle 404 for API routes
router.use(notFound);

export default router;
