import express from "express";
import instructorRoutes from "./instructorRoutes.js";

import lessonRoute from "./lessonRoute.js";
import notificationRoute from "./notificationRoute.js";

import userRoutes from "./userRoutes.js";


import { notFound } from "../middleware/errorHandler.js";


import categoryRouter from "./categoryRouter.js";
import subCategoryRouter from "./subCategoryRoute.js";

import courseRoutes from "./courseRoutes.js";

import instructorRatings from "./instructorRating.js";

import assignmentRouter from "./assignmentRouter.js";

import moduleRouter from "./moduleRoute.js";


import commentRouter from "./commentRouter.js"
import replyCommentRouter from "./replyCommentRouter.js"


const router = express.Router();

// API routes
router.use("/users", userRoutes); //api/v1/users

router.use("/category", categoryRouter);
router.use("/sub_category", subCategoryRouter);

router.use("/instructors", instructorRoutes); //api/v1/instructors
router.use("/courses", courseRoutes); //api/v1/instructors

router.use("/instructor-ratings", instructorRatings);
router.use("/notification", notificationRoute);

router.use("/module", moduleRouter);

router.use("/assignment", assignmentRouter);


router.use("/lesson", lessonRoute);

router.use("/comments", commentRouter)
router.use("/reply-comment", replyCommentRouter)



// Handle 404 for API routes
router.use(notFound);

export default router;
