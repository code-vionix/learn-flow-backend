import express from "express";

import {
  createPaymentEnroll,
  getAllEnrollments,
  getAllPayments,
  getUserEnrollments,
  getUserPayments,
} from "../controllers/paymentEnrollController.js";

const enrollRoute = express.Router();

enrollRoute.post("/enrollment", createPaymentEnroll);
enrollRoute.get("/all-payments", getAllPayments);
enrollRoute.get("/all-enrollments", getAllEnrollments);
enrollRoute.get("/user-payment/:userId", getUserPayments);
enrollRoute.get("/user-enroll/:userId", getUserEnrollments);

export default enrollRoute;
