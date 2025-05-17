import express from "express";
import { notFound } from "../middleware/errorHandler.js";
import assignmentRouter from "./assignmentRouter.js";
import attachmentRoutes from "./attachmentRoutes.js";
import categoryRouter from "./categoryRouter.js";
import commentRouter from "./commentRouter.js";
import courseRoutes from "./courseRoutes.js";
import instructorRoutes from "./instructorRoutes.js";
import lessonRoute from "./lessonRoute.js";
import moduleRouter from "./moduleRoute.js";
import noteRoutes from "./notesRoutes.js";
import notificationRoute from "./notificationRoute.js";
import cardRouter from "./paymentCardRoute.js";
import purchesRouter from "./purchesHistoryRouter.js";
import questionRouter from "./questionRouter.js";
import quizRouter from "./quizRouter.js";
import replyCommentRouter from "./replyCommentRouter.js";
import roomRouter from "./roomRouter.js";
import subCategoryRouter from "./subCategoryRoute.js";
import uploadRoutes from "./upload.route.js";
import userRoutes from "./userRoutes.js";

const router = express.Router();

// API routes
router.use("/users", userRoutes);

router.use("/category", categoryRouter);
router.use("/sub_category", subCategoryRouter);
router.use("/notification", notificationRoute);
router.use("/upload", uploadRoutes); // ✅ Cloudinary uploads, optional

router.use("/instructors", instructorRoutes);


router.use("/courses", courseRoutes); //api/v1/instructors
router.use("/module", moduleRouter);
router.use("/assignment", assignmentRouter);
router.use("/quiz", quizRouter);
router.use("/lesson", lessonRoute);
router.use("/question", questionRouter);
router.use("/comments", commentRouter);
router.use("/reply-comment", replyCommentRouter);
router.use("/attachments", attachmentRoutes);
router.use("/notes", noteRoutes); // Potentially /api/lessons/:lessonId/notes if notes are tightly coupled

router.use("/payment", cardRouter);
router.use("/purches", purchesRouter);

router.use("/room", roomRouter);

// Handle 404 for API routes
router.use(notFound);

export default router;
