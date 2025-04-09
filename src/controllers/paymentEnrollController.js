import { prisma } from "../models/index.js";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentEnroll = async (req, res) => {
  try {
    const {
      amount,
      currency,
      method,
      cardId,
      userId,
      courseId,
      paymentMethodId,
    } = req.body;

    // Check for missing required fields
    if (
      !amount ||
      !currency ||
      !method ||
      !cardId ||
      !userId ||
      !courseId ||
      !paymentMethodId
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate course
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) return res.status(400).json({ error: "Invalid courseId" });

    // Validate user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) return res.status(400).json({ error: "Invalid userId" });

    // Validate card
    const card = await prisma.paymentCard.findUnique({
      where: { id: cardId },
    });
    if (!card) return res.status(400).json({ error: "Invalid cardId" });

    // Check for existing enrollment
    // const existingEnrollment = await prisma.enrollment.findFirst({
    //   where: { userId, courseId },
    // });
    // if (existingEnrollment) {
    //   return res
    //     .status(400)
    //     .json({ error: "User already enrolled in this course" });
    // }

    // Create a Stripe payment intent using the payment method ID
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe expects the amount in cents
      currency: currency,
      payment_method: paymentMethodId, // Payment method ID from the frontend
      confirm: true, // Confirm the payment immediately
    });

    // If payment is successful, proceed to create the payment and enrollment
    if (paymentIntent.status === "succeeded") {
      // Create payment record in the database
      const payment = await prisma.payment.create({
        data: {
          amount,
          currency,
          method,
          cardId,
          userId,
          courseId,
          status: "Success",
          paymentIntentId: paymentIntent.id, // Store the Stripe payment intent ID
        },
      });

      // Create enrollment
      const enrollment = await prisma.enrollment.create({
        data: {
          userId,
          courseId,
          payment: {
            connect: { id: payment.id },
          },
        },
      });

      // Update payment with enrollmentId
      await prisma.payment.update({
        where: { id: payment.id },
        data: { enrollmentId: enrollment.id },
      });

      return res.status(201).json({ payment, enrollment });
    } else {
      return res.status(402).json({ error: "Payment failed" });
    }
  } catch (err) {
    console.error("Payment Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// export const createPaymentEnroll = async (req, res) => {
//   try {
//     const { amount, currency, method, cardId, userId, courseId } = req.body;

//     // Check for missing required fields
//     if (!amount || !currency || !method || !cardId || !userId || !courseId) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     // Validate course
//     const course = await prisma.course.findUnique({
//       where: { id: courseId },
//     });
//     if (!course) return res.status(400).json({ error: "Invalid courseId" });

//     // Validate user
//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//     });
//     if (!user) return res.status(400).json({ error: "Invalid userId" });

//     // Validate card
//     const card = await prisma.paymentCard.findUnique({
//       where: { id: cardId },
//     });
//     if (!card) return res.status(400).json({ error: "Invalid cardId" });

//     // Simulate payment success (replace with real Stripe logic)
//     const paymentStatus = "Success";

//     // Create payment
//     const payment = await prisma.payment.create({
//       data: {
//         amount,
//         currency,
//         method,
//         cardId,
//         userId,
//         courseId,

//         status: paymentStatus,
//       },
//     });

//     // If payment is successful, create enrollment and update payment
//     if (payment.status === "Success") {
//       const enrollment = await prisma.enrollment.create({
//         data: {
//           userId,
//           courseId,
//           payment: {
//             connect: { id: payment.id }, // Link the payment to the enrollment
//           },
//         },
//       });

//       // Update payment with enrollmentId
//       await prisma.payment.update({
//         where: { id: payment.id },
//         data: { enrollmentId: enrollment.id },
//       });

//       return res.status(201).json({ payment, enrollment });
//     } else {
//       return res.status(402).json({ error: "Payment failed" });
//     }
//   } catch (err) {
//     console.error("Payment Error:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

export const getAllPayments = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany();

    res.status(200).json(payments);
  } catch (err) {
    console.error("Error fetching payments:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany();

    res.status(200).json(enrollments);
  } catch (err) {
    console.error("Error fetching enrollments:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserPayments = async (req, res) => {
  const { userId } = req.params;

  try {
    const payments = await prisma.payment.findMany({
      where: { userId },
    });

    res.status(200).json(payments);
  } catch (err) {
    console.error("Error fetching user's payments:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserEnrollments = async (req, res) => {
  const { userId } = req.params;

  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
    });

    res.status(200).json(enrollments);
  } catch (err) {
    console.error("Error fetching user's enrollments:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
