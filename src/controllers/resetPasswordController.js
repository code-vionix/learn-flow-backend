import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { prisma } from "../models/index.js";
import { transporter } from "../utils/NodemailerTransport.js";

// Get the current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// export const createOrUpdateOtpByEmail = async (req, res) => {
//   try {
//     const { email } = req.body;

//     const user = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (!user) {
//       throw new Error("User with this email does not exist.");
//     }

//     // Find existing otp for this user
//     const exitingOtp = await prisma.otp.findFirst({
//       where: {
//         userId: user.id,
//         isActive: true,
//       },
//     });

//     const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
//     const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // expires in 5 minutes

//     // Encrypt otp
//     const salt = await bcrypt.genSalt(10);
//     const encryptedOtpCode = await bcrypt.hash(otpCode, salt);

//     if (exitingOtp) {
//       await prisma.otp.update({
//         where: { id: exitingOtp.id },
//         data: {
//           code: encryptedOtpCode,
//           expiresAt,
//           createdAt: new Date(),
//           verified: false,
//           failedAttempts: 0,
//         },
//       });
//     } else {
//       await prisma.otp.create({
//         data: {
//           code: encryptedOtpCode,
//           expiresAt,
//           user: {
//             connect: { id: user.id },
//           },
//         },
//       });
//     }

//     // Read the HTML template
//     const templatePath = path.join(
//       __dirname,
//       "../templates/passwordreset.html"
//     );
//     let htmlTemplate = fs.readFileSync(templatePath, "utf-8");

//     //  Replace placeholders with real data
//     htmlTemplate = htmlTemplate
//       .replace("{{firstName}}", user.firstName || "User")
//       .replace("{{lastName}}", user.lastName || "")
//       .replace("{{otpCode}}", otpCode);

//     //  Email options
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "Your OTP Code - LearnFlow",
//       html: htmlTemplate,
//     };

//     //  Send Email
//     await transporter.sendMail(mailOptions);

//     return res
//       .status(200)
//       .json({ message: "OTP sent to your email successfully." });
//   } catch (error) {
//     console.error(error.message);
//     return res.status(500).json({ message: "Internal server error." });
//   }
// };

export const createOrUpdateOtpByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    // 1. Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // If user doesn't exist, return a 404 error
    if (!user) {
      return res
        .status(404)
        .json({ message: "User with this email does not exist." });
    }

    // 2. Find the existing active OTP for this user
    const existingOtp = await prisma.otp.findFirst({
      where: {
        userId: user.id,
        isActive: true,
      },
    });

    // 3. Generate new OTP details (code, expiry, encrypted code)
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // expires in 5 minutes

    // Encrypt otp
    const salt = await bcrypt.genSalt(10);
    const encryptedOtpCode = await bcrypt.hash(otpCode, salt);

    // 4. Determine whether to update the existing OTP or create a new one
    if (existingOtp) {
      // Check if the existing OTP is expired
      if (existingOtp.expiresAt < new Date()) {
        // Existing OTP is expired -> Invalidate the old one and create a new one
        await prisma.otp.update({
          where: { id: existingOtp.id },
          data: {
            isActive: false,
            verified: false, // Mark as not verified
          },
        });

        // Create a new OTP record
        await prisma.otp.create({
          data: {
            code: encryptedOtpCode,
            expiresAt,
            userId: user.id, // Connect OTP to user using userId
            isActive: true, // New OTP is active by default
            verified: false,
            failedAttempts: 0, // Start with 0 failed attempts for new OTP
          },
        });
        console.log(
          `Expired OTP ${existingOtp.id} invalidated. New OTP created for user ${user.id}.`
        );
      } else {
        // Existing OTP is not expired -> Update the existing record with new details
        await prisma.otp.update({
          where: { id: existingOtp.id },
          data: {
            code: encryptedOtpCode,
            expiresAt,
            createdAt: new Date(), // Update creation time? Or keep original?
            // Keeping original might be better for tracking the life of the *record*.
            // Let's remove this line unless you specifically need to reset creation time.
            verified: false, // Reset verification status
            failedAttempts: 0, // Reset failed attempts
            isActive: true, // Ensure it remains active
          },
        });
        console.log(
          `Existing non-expired OTP ${existingOtp.id} updated for user ${user.id}.`
        );
      }
    } else {
      // No existing active OTP found -> Create a new one
      await prisma.otp.create({
        data: {
          code: encryptedOtpCode,
          expiresAt,
          userId: user.id, // Connect OTP to user using userId
          isActive: true, // New OTP is active by default
          verified: false,
          failedAttempts: 0, // Start with 0 failed attempts
        },
      });
      console.log(`New OTP created for user ${user.id}.`);
    }

    // 5. Read the HTML template
    // Note: __dirname might not be available in some environments (e.g., ES Modules).
    // You might need to use import.meta.url or adjust based on your setup.
    const templatePath = path.join(
      __dirname, // Adjust if __dirname is not available
      "../templates/passwordreset.html"
    );
    let htmlTemplate = fs.readFileSync(templatePath, "utf-8");

    // 6. Replace placeholders with real data
    htmlTemplate = htmlTemplate
      .replace("{{firstName}}", user.firstName || "User")
      .replace("{{lastName}}", user.lastName || "") // Or replace with a space if lastName is empty
      .replace("{{otpCode}}", otpCode); // Use the *unencrypted* otpCode for the email

    // 7. Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code - LearnFlow",
      html: htmlTemplate,
    };

    // 8. Send Email
    await transporter.sendMail(mailOptions);

    // 9. Send success response
    return res
      .status(200)
      .json({ message: "OTP sent to your email successfully." });
  } catch (error) {
    // Log the full error object for better debugging
    console.error("Error in createOrUpdateOtpByEmail:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp: userOtp } = req.body;

    if (!email || !userOtp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    // 1. Find the user first
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // 2. Find the active OTP record for this user
    // This assumes only one active OTP should exist per user at any time,
    // which is consistent with the createOrUpdateOtpByEmail logic.
    const otpRecord = await prisma.otp.findFirst({
      where: {
        userId: user.id,
        isActive: true, // Crucially, only check active OTPs
      },
    });

    // 3. Check if an active OTP was found
    if (!otpRecord) {
      // No active OTP found for this user
      return res.status(404).json({
        message: "No active OTP found for this user. Please request a new one.",
      });
    }

    // 4. Check if OTP already verified (shouldn't happen often with isActive, but good check)
    if (otpRecord.verified) {
      // Optionally, you might want to deactivate this OTP here if it somehow is active AND verified
      // await prisma.otp.update({ where: { id: otpRecord.id }, data: { isActive: false } });
      return res
        .status(400)
        .json({ message: "This OTP has already been verified." });
    }

    // 5. Check expiry
    const now = new Date();
    if (otpRecord.expiresAt < now) {
      // If expired, mark it as inactive and respond
      await prisma.otp.update({
        where: { id: otpRecord.id },
        data: {
          isActive: false,
          verified: false, // Ensure verified is false
        },
      });
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    // 6. Verify OTP using bcrypt.compare
    const isValidOtp = await bcrypt.compare(userOtp, otpRecord.code);

    if (isValidOtp) {
      // Successful verification
      // Update the OTP record to mark it as verified and inactive (as it's now used)
      await prisma.otp.update({
        where: { id: otpRecord.id },
        data: {
          verified: true,
          isActive: false, // Mark as inactive after successful verification
        },
      });
      return res.status(200).json({ message: "OTP verified successfully." });
    } else {
      // OTP mismatch - increment failed attempts
      const failedAttempts = (otpRecord.failedAttempts || 0) + 1;

      // 7. Check failed attempts threshold
      if (failedAttempts >= 3) {
        // Mark the OTP as inactive and not verified after too many failed attempts
        await prisma.otp.update({
          where: { id: otpRecord.id },
          data: {
            failedAttempts: failedAttempts, // Update count before deactivating
            isActive: false,
            verified: false,
          },
        });
        // Instead of deleting, we set isActive: false
        // await prisma.otp.delete({ where: { id: otpRecord.id } }); // Original delete logic

        return res.status(403).json({
          message:
            "OTP verification failed too many times. This OTP is now invalid. Please request a new one.",
        });
      } else {
        // Update failed attempts count on the active OTP
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
    // Log the full error object for better debugging
    console.error("OTP verification error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// export const passwordChange = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res
//         .status(400)
//         .json({ message: "Email and password are required." });
//     }

//     // Find user with their OTP
//     const user = await prisma.user.findUnique({
//       where: { email },
//       include: {
//         otp: {
//           select: {
//             verified: true,
//             createdAt: true,
//           },
//         },
//       },
//     });

//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     if (!user.otp.verified) {
//       return res.status(400).json({ message: "OTP not verified" });
//     }

//     // Check if the OTP was verified within 7 minutes (7 * 60 * 1000 ms)
//     const now = new Date();
//     const otpCreatedAt = new Date(user.otp.createdAt);
//     const diffInMinutes = Math.floor((now - otpCreatedAt) / (60 * 1000));

//     if (diffInMinutes > 7) {
//       return res
//         .status(400)
//         .json({ message: "Seasion expired. Please try again" });
//     }

//     // Hash the new password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Update the user's password
//     await prisma.user.update({
//       where: { email },
//       data: {
//         password: hashedPassword,
//         updatedAt: new Date(),
//       },
//     });

//     res.status(200).json({ message: "Password successfully changed." });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal server error." });
//   }
// };

export const passwordChange = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate inputs
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and new password are required." });
    }

    // Add basic password validation (e.g., minimum length)
    if (password.length < 8) {
      // Example: require at least 8 characters
      return res
        .status(400)
        .json({ message: "New password must be at least 8 characters long." });
    }

    // 2. Find the user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // 3. Find a valid, recently verified OTP for this user
    // We look for an OTP that:
    // - Belongs to this user (userId)
    // - Has been successfully verified (verified: true)
    // - Was marked inactive by the verification process (isActive: false)
    // - Hasn't passed a reasonable time window since verification (e.g., checked using createdAt or expiresAt)
    //   Let's use createdAt and assume the verification happened recently after OTP creation/update.
    const passwordResetOtp = await prisma.otp.findFirst({
      where: {
        userId: user.id,
        verified: true,
        isActive: false, // OTP was marked inactive upon verification
        // Add a time check: ensure the verification happened within the last ~10 minutes
        // Use createdAt as a proxy for the time the verified OTP record was created/updated
        createdAt: {
          gte: new Date(Date.now() - 10 * 60 * 1000), // OTP was verified within the last 10 minutes
        },
      },
      // Order by creation time to potentially get the most recent successful verification
      orderBy: {
        createdAt: "desc",
      },
    });

    // 4. Check if a valid, recently verified OTP was found
    if (!passwordResetOtp) {
      // No valid verification found or verification window expired
      return res
        .status(403)
        .json({
          message:
            "Password reset verification is invalid or expired. Please request a new password reset.",
        });
    }

    // 5. Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 6. Update the user's password and invalidate the OTP
    // Use a transaction to ensure both operations succeed or fail together
    await prisma.$transaction([
      // Update the user's password
      prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }, // Assuming 'password' is the field name
      }),
      // Invalidate or delete the OTP used for the reset
      // Deleting the OTP is a common approach after it's used for reset
      prisma.otp.delete({
        where: { id: passwordResetOtp.id },
      }),
      // Alternatively, if you want to keep a record, update a 'usedForReset' flag:
      // prisma.otp.update({
      //      where: { id: passwordResetOtp.id },
      //      data: { usedForPasswordChange: true } // Requires this field in the model
      // })
    ]);

    // 7. Success response
    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    // Log the full error object for better debugging
    console.error("Password change error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
