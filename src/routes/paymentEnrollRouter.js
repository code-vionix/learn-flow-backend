import bodyParser from "body-parser";
import express from "express";

import { getEnrolledTeacher } from "../controllers/enrolledTeacherController.js";
import {
  createCheckoutSession,
  getUserEnrollments,
  getUserPayments,
  stripeWebhook,
} from "../controllers/paymentEnrollController.js";
import { protect } from "../middleware/auth.js";

const enrollRoute = express.Router();

enrollRoute.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }), // <-- This ensures raw data is passed to the controller
  stripeWebhook
);

enrollRoute.post("/checkoutSession", protect, createCheckoutSession);

enrollRoute.get("/user-payment", protect, getUserPayments);
enrollRoute.get("/user-enroll", protect, getUserEnrollments);
enrollRoute.get("/enrolled-teacher", protect, getEnrolledTeacher);

export default enrollRoute;
