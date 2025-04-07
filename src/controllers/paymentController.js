import { prisma } from "../models/index.js";

// Create Payment Handler
export const createPayment = async (req, res) => {
  try {
    const {
      amount,
      currency,
      method,
      cardId,
      userId,
      courseId,
      taxAmount,
      taxRate,
      currencyConversionRate,
      paymentIntentId,
    } = req.body;

    // Validate required fields
    if (
      !amount ||
      !currency ||
      !method ||
      !cardId ||
      !userId ||
      !courseId ||
      !paymentIntentId
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate courseId
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      return res.status(400).json({ error: "Invalid courseId" });
    }

    // Validate userId
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    // Validate cardId
    const card = await prisma.paymentCard.findUnique({
      where: { id: cardId },
    });
    if (!card) {
      return res.status(400).json({ error: "Invalid cardId" });
    }

    // Simulate payment status (Replace this with actual payment processing logic)
    const paymentStatus = "Success"; // In actual implementation, replace with real gateway response

    // Create the payment record in the database
    const payment = await prisma.payment.create({
      data: {
        amount,
        currency,
        method,
        cardId,
        userId,
        courseId,
        taxAmount,
        taxRate,
        currencyConversionRate,
        paymentIntentId,
        status: paymentStatus, // Payment status
      },
    });

    res.status(201).json(payment);
  } catch (err) {
    console.error(err); // Log the error
    res.status(500).json({ error: "Internal server error" });
  }
};
