import express from "express";
import { notFound } from "../middleware/errorHandler.js";
import assignmentRouter from "./assignmentRouter.js";
import categoryRouter from "./categoryRouter.js";
import contactRoutes from "./contactRoutes.js";
import courseRoutes from "./courseRoutes.js";
import faqRoutes from "./faqRoutes.js";
import faqSubmissionRoute from "./faqSubmissionRoute.js";
import instructorRatings from "./instructorRating.js";
import instructorRoutes from "./instructorRoutes.js";
import {
  default as lessonRoute,
  default as lessonRouter,
} from "./lessonRoute.js";
import notificationRoute from "./notificationRoute.js";
import questionRouter from "./questionRouter.js";
import quizRouter from "./quizRouter.js";
import subCategoryRouter from "./subCategoryRoute.js";
import testimonialRoutes from "./testimonialRoutes.js";
import userRoutes from "./userRoutes.js";
// import moduleRouter from "./moduleRoute.js";
import commentRouter from "./commentRouter.js";
import coursePogressRouter from "./courseProgressRouter.js";
import moduleRouter from "./moduleRoute.js";
import cardRouter from "./paymentCardRoute.js";
import enrollRoute from "./paymentEnrollRouter.js";
import purchesRouter from "./purchesHistoryRouter.js";
import replyCommentRouter from "./replyCommentRouter.js";
import resetrouter from "./resetPasswordRouter.js";
import roomRouter from "./roomRouter.js";
import uploadRoutes from "./upload.route.js";
import wishlistrouter from "./wishlistRoutes.js";

const router = express.Router();

// API routes
router.use("/contact", contactRoutes);
router.use("/faq", faqRoutes);
router.use("/faq-submit", faqSubmissionRoute);

router.use("/category", categoryRouter);
router.use("/sub_category", subCategoryRouter);
router.use("/users", userRoutes);

router.use("/testimonials", testimonialRoutes);
router.use("/notification", notificationRoute);
router.use("/upload", uploadRoutes); // ✅ Cloudinary uploads, optional

router.use("/instructors", instructorRoutes);
router.use("/instructor-ratings", instructorRatings);

router.use("/courses", courseRoutes); //api/v1/instructors
router.use("/course", enrollRoute);
router.use("/course", coursePogressRouter);

router.use("/module", moduleRouter);
router.use("/assignment", assignmentRouter);
router.use("/quiz", quizRouter);
router.use("/question", questionRouter);
router.use("/lesson", lessonRouter);
router.use("/lesson", lessonRoute);

router.use("/comments", commentRouter);
router.use("/reply-comment", replyCommentRouter);

router.use("/payment", cardRouter);
router.use("/purches", purchesRouter);

router.use("/room", roomRouter);
router.use("", wishlistrouter);

router.use("/password", resetrouter);
// Handle 404 for API routes
router.use(notFound);

export default router;
