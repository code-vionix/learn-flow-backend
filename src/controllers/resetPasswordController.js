import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { prisma } from "../models/index.js";
import { transporter } from "../utils/NodemailerTransport.js";

// Get the current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createOrUpdateOtpByEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("User with this email does not exist.");
    }

    // Find existing otp for this user
    const exitingOtp = await prisma.otp.findFirst({
      where: {
        user: {
          id: user.id,
        },
      },
    });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // expires in 5 minutes

    // Encrypt otp
    const salt = await bcrypt.genSalt(10);
    const encryptedOtpCode = await bcrypt.hash(otpCode, salt);

    if (exitingOtp) {
      await prisma.otp.update({
        where: { id: exitingOtp.id },
        data: {
          code: encryptedOtpCode,
          expiresAt,
          createdAt: new Date(),
          verified: false,
          failedAttempts: 0,
        },
      });
    } else {
      await prisma.otp.create({
        data: {
          code: encryptedOtpCode,
          expiresAt,
          user: {
            connect: { id: user.id }, 
          },
        },
      });
    }

    // Read the HTML template
    const templatePath = path.join(
      __dirname,
      "../templates/passwordreset.html"
    );
    let htmlTemplate = fs.readFileSync(templatePath, "utf-8");

    //  Replace placeholders with real data
    htmlTemplate = htmlTemplate
      .replace("{{firstName}}", user.firstName || "User")
      .replace("{{lastName}}", user.lastName || "")
      .replace("{{otpCode}}", otpCode);

    //  Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code - LearnFlow",
      html: htmlTemplate,
    };

    //  Send Email
    await transporter.sendMail(mailOptions);

    return res
      .status(200)
      .json({ message: "OTP sent to your email successfully." });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp: userOtp } = req.body;

    if (!email || !userOtp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    // Find user with their OTP
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        otp: true,
      },
    });

    if (!user || !user.otp) {
      return res.status(404).json({ message: "User or OTP not found." });
    }

    const otpRecord = user.otp;

    // Check if OTP already verified
    if (otpRecord.verified) {
      return res.status(400).json({ message: "OTP already verified." });
    }

    // Check expiry
    const now = new Date();
    if (otpRecord.expiresAt < now) {
      return res.status(400).json({ message: "OTP has expired." });
    }

    // Verify OTP using bcrypt.compare
    const isValidOtp = await bcrypt.compare(userOtp, otpRecord.code);

    if (isValidOtp) {
      // succesful verification
      await prisma.otp.update({
        where: { id: otpRecord.id },
        data: { verified: true },
      });
      return res.status(200).json({ message: "OTP verified successfully." });
    } else {
      // OTP mismatch - increment failed attempts
      const failedAttempts = (otpRecord.failedAttempts || 0) + 1;

      if (failedAttempts >= 3) {
        await prisma.otp.delete({
          where: { id: otpRecord.id },
        });
        return res.status(403).json({
          message:
            "OTP verification failed 3 times.Please try again from start",
        });
      } else {
        // Update failed attempts count
        await prisma.otp.update({
          where: { id: otpRecord.id },
          data: { failedAttempts },
        });

        return res.status(400).json({
          message: `Invalid OTP. You have ${3 - failedAttempts} attempts left.`,
        });
      }
    }
  } catch (error) {
    console.error("OTP verification error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const passwordChange = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Find user with their OTP
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        otp: {
          select: {
            verified: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if ( !user.otp.verified) {
      return res.status(400).json({ message: "OTP not verified" });
    }

    // Check if the OTP was verified within 7 minutes (7 * 60 * 1000 ms)
    const now = new Date();
    const otpCreatedAt = new Date(user.otp.createdAt);
    const diffInMinutes = Math.floor((now - otpCreatedAt) / (60 * 1000));

    if (diffInMinutes > 7) {
      return res
        .status(400)
        .json({ message: "Seasion expired. Please try again" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    });

    res.status(200).json({ message: "Password successfully changed." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
};
