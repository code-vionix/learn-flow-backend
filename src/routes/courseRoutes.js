import express from "express";
import multer from "multer";
import {
  createCourse,
  DeleteCourse,
  getAllCourse,
  getCourseById,
  UpdateCourse,
} from "../controllers/courseController.js";
import { protect } from "../middleware/auth.js";
import { courseProgress } from "../controllers/coursePrgressController.js";
import bodyParser from "body-parser";

import {
  createCheckoutSession,
  getAllEnrollments,
  getAllPayments,
  getUserEnrollments,
  getUserPayments,
  stripeWebhook,
} from "../controllers/paymentEnrollController.js";

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({}),
  // limits: {fileSize : 5000000},
});

// course routes
router.post("/", protect, createCourse);
router.get("/", getAllCourse);
router.get("/:id", getCourseById);
router.put(
  "/:id",
  protect,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "trailer", maxCount: 1 },
  ]),
  UpdateCourse
);

router.delete("/:id", protect, DeleteCourse);
router.post("/progress", courseProgress);

// Payment routes
router.post("/checkoutSession", createCheckoutSession);
router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook
);
router.get("/all-payments", getAllPayments);
router.get("/all-enrollments", getAllEnrollments);
router.get("/user-payment/:userId", getUserPayments);
router.get("/user-enroll/:userId", getUserEnrollments);
router.get("/history/:userId", purchesHistory);



// router.get('/:courseId/curriculum', courseController.getCourseCurriculum);
export default router;
