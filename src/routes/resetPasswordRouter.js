import express from "express";
import { createOrUpdateOtpByEmail, passwordChange, verifyOtp } from "../controllers/resetPasswordController.js";

const resetrouter = express.Router();

resetrouter.post("/reset", createOrUpdateOtpByEmail);
resetrouter.post("/otpverify", verifyOtp);
resetrouter.post("/change", passwordChange);

export default resetrouter;
