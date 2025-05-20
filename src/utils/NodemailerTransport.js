import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Loaded from .env
    pass: process.env.EMAIL_PASS, // Loaded from .env
  },
});
