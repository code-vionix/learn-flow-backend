import express from "express";
import bodyParser from "body-parser";

import {
  createCheckoutSession,
  getAllEnrollments,
  getAllPayments,
  getUserEnrollments,
  getUserPayments,
  stripeWebhook,
} from "../controllers/paymentEnrollController.js";

const enrollRoute = express.Router();

enrollRoute.post("/checkoutSession", createCheckoutSession);
enrollRoute.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook
);
enrollRoute.get("/all-payments", getAllPayments);
enrollRoute.get("/all-enrollments", getAllEnrollments);
enrollRoute.get("/user-payment/:userId", getUserPayments);
enrollRoute.get("/user-enroll/:userId", getUserEnrollments);

export default enrollRoute;
