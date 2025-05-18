import { prisma } from "../models/index.js";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const createCheckoutSession = async (req, res) => {
  try {
    const { courseId, amount, currency = "usd" } = req.body;

    const userId = req.user.id;

    // Validate input fields (simple check)
    if (!courseId || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Get course data to use for session
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) return res.status(400).json({ error: "Invalid courseId" });

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], //payment methods allowed
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: `${course.title} - e-tutor`,
              description: `Purchase for course ${course.title} on e-tutor platform`,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}&course_id=${courseId}`, // URL to redirect on success
      success_url: `http://localhost:3001/`, // URL to redirect on success
      cancel_url: `http://localhost:3000/cancel`, // URL to redirect on cancel
      metadata: {
        userId: userId,
        courseId: courseId,
        platform: "e Tutor",
      },
    });

    // Respond with session ID to the frontend
    return res.json({ sessionId: session.id });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed", err);
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const userId = session.metadata.userId;
    const courseId = session.metadata.courseId;
    const paymentIntentId = session.payment_intent;
    const amount = session.amount_total / 100;
    const currency = session.currency;

    try {
      await handlePaymentSuccess({
        userId,
        courseId,
        paymentIntentId,
        amount,
        currency,
        method: "card",
      });
    } catch (err) {
      console.error("Failed to handle payment success:", err.message);
      return res.status(500).send("Internal server error");
    }
  }
  res.status(200).send("Event received");
};

const handlePaymentSuccess = async ({
  userId,
  courseId,
  paymentIntentId,
  amount,
  currency,
  method,
}) => {
  const payment = await prisma.payment.create({
    data: {
      userId,
      courseId,
      amount,
      currency,
      method,
      status: "Success",
      paymentIntentId,
    },
  });

  const enrollment = await prisma.enrollment.create({
    data: {
      userId,
      courseId,
    },
  });

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      enrollmentId: enrollment.id,
    },
  });
};

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
      include: {
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
            language: true,
            description: true,
            subtitle: true,
            createdAt: true,
            teacher: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
            CourseProgress: {
              where: { userId },
              select: {
                progress: true,
              },
            },
          },
        },
      },
    });

    const formatted = enrollments.map((enrollment) => {
      const { CourseProgress, ...courseData } = enrollment.course;
      const progress = CourseProgress?.[0]?.progress || 0;

      return {
        id: enrollment.id,
        userId: enrollment.userId,
        courseId: enrollment.courseId,
        enrollmentDate: enrollment.enrollmentDate,
        course: {
          ...courseData,
          progress,
        },
      };
    });
    // const enrichedEnrollments = await Promise.all(
    //   enrollments.map(async (enrollment) => {
    //     const courseId = enrollment.course.id;

    res.status(200).json(formatted);
  } catch (err) {
    console.error("Error fetching user's enrollments:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
