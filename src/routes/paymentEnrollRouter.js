import bodyParser from "body-parser";
import express from "express";

import {
  createCheckoutSession,
  getAllEnrollments,
  getAllPayments,
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

enrollRoute.get("/all-payments", getAllPayments);
enrollRoute.get("/all-enrollments", getAllEnrollments);
enrollRoute.get("/user-payment/:userId", protect, getUserPayments);
enrollRoute.get("/user-enroll/:userId", protect, getUserEnrollments);

export default enrollRoute;
