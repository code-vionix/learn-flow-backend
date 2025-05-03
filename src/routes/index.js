import express from "express";
import instructorRoutes from "./instructorRoutes.js";

import lessonRoute from "./lessonRoute.js";
import notificationRoute from "./notificationRoute.js";

import userRoutes from "./userRoutes.js";

import categoryRouter from "./categoryRouter.js";
import subCategoryRouter from "./subCategoryRoute.js";

import courseRoutes from "./courseRoutes.js";

import instructorRatings from "./instructorRating.js";

import assignmentRouter from "./assignmentRouter.js";
import { notFound } from "../middleware/errorHandler.js";
import quizRouter from "./quizRouter.js";
import questionRouter from "./questionRouter.js";
import lessonRouter from "./lessonRoute.js";
 

// import moduleRouter from "./moduleRoute.js";


import commentRouter from "./commentRouter.js"
import replyCommentRouter from "./replyCommentRouter.js"

import roomRouter from "./roomRouter.js";

import moduleRouter from "./moduleRoute.js";

import uploadRoutes from "./upload.route.js"; // ✅ Add this if you support uploads

import cardRouter from "./paymentCardRoute.js";
import enrollRoute from "./paymentEnrollRouter.js";

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

router.use("/quiz", quizRouter);

router.use("/lesson", lessonRouter);

router.use("/question", questionRouter);


router.use("/lesson", lessonRoute);


router.use("/upload", uploadRoutes); // ✅ Cloudinary uploads, optional

router.use("/comments", commentRouter)
router.use("/reply-comment", replyCommentRouter)
router.use("/room", roomRouter)

router.use("/payment", cardRouter);
router.use("/course", enrollRoute)


// Handle 404 for API routes
router.use(notFound);

export default router;
