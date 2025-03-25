import { prisma, handlePrismaError } from "../models/index.js";

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { userId, courseId, paymentMethod, amount, currency = "BDT", status = "PENDING" } = req.body;

    // Validate required fields
    if (!userId || !courseId || !paymentMethod || !amount) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields: userId, courseId, paymentMethod, amount",
      });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({
        status: "error",
        message: "Course not found",
      });
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        amount,
        currency,
        method: paymentMethod,
        status,
        user: { connect: { id: userId } },
        course: { connect: { id: courseId } },
        card: {
          create: {
            cardNumber: "XXXX-XXXX-XXXX-XXXX", // Placeholder
            expiryDate: "today",
            name: user.firstName + " " + (user.lastName || ""),
            user: { connect: { id: userId } },
            cvv: "123", // Placeholder
          }
        }
      },
    });

    // Create enrollment if payment is successful
    if (status === "SUCCESS") {
      await prisma.enrollment.create({
        data: {
          user: { connect: { id: userId } },
          course: { connect: { id: courseId } },
          enrollmentDate: new Date(),
          status: "ACTIVE",
          paymentId: payment.id,
        },
      });

      // Remove from cart if it exists
      await prisma.cart.deleteMany({
        where: {
          userId,
          courseId,
        },
      });
    }

    return res.status(201).json({
      status: "success",
      message: "Order created successfully",
      data: payment,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    const errorResponse = handlePrismaError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            price: true,
            discountPrice: true,
          },
        },
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Orders retrieved successfully",
      data: payments,
    });
  } catch (error) {
    console.error("Error retrieving orders:", error);
    const errorResponse = handlePrismaError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

// Get orders by user ID
export const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const payments = await prisma.payment.findMany({
      where: {
        userId,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            price: true,
            discountPrice: true,
            thumbnail: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      status: "success",
      message: "User orders retrieved successfully",
      data: payments,
    });
  } catch (error) {
    console.error("Error retrieving user orders:", error);
    const errorResponse = handlePrismaError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await prisma.payment.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            price: true,
            discountPrice: true,
            thumbnail: true,
          },
        },
      },
    });

    if (!payment) {
      return res.status(404).json({
        status: "error",
        message: "Order not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Order retrieved successfully",
      data: payment,
    });
  } catch (error) {
    console.error("Error retrieving order:", error);
    const errorResponse = handlePrismaError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        status: "error",
        message: "Status is required",
      });
    }

    const payment = await prisma.payment.findUnique({
      where: {
        id,
      },
    });

    if (!payment) {
      return res.status(404).json({
        status: "error",
        message: "Order not found",
      });
    }

    const updatedPayment = await prisma.payment.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    // If payment status is updated to SUCCESS, create enrollment
    if (status === "SUCCESS" && payment.status !== "SUCCESS") {
      await prisma.enrollment.create({
        data: {
          user: { connect: { id: payment.userId } },
          course: { connect: { id: payment.courseId } },
          enrollmentDate: new Date(),
          status: "ACTIVE",
          paymentId: payment.id,
        },
      });

      // Remove from cart if it exists
      if (payment.userId && payment.courseId) {
        await prisma.cart.deleteMany({
          where: {
            userId: payment.userId,
            courseId: payment.courseId,
          },
        });
      }
    }

    return res.status(200).json({
      status: "success",
      message: "Order status updated successfully",
      data: updatedPayment,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    const errorResponse = handlePrismaError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

// Delete order
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await prisma.payment.findUnique({
      where: {
        id,
      },
    });

    if (!payment) {
      return res.status(404).json({
        status: "error",
        message: "Order not found",
      });
    }

    // Delete the payment
    await prisma.payment.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    const errorResponse = handlePrismaError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};

// Process payment (placeholder for payment gateway integration)
export const processPayment = async (req, res) => {
  try {
    const { id, paymentDetails } = req.body;

    if (!id || !paymentDetails) {
      return res.status(400).json({
        status: "error",
        message: "Order ID and payment details are required",
      });
    }

    // In a real implementation, you would integrate with a payment gateway here
    // This is a placeholder for demonstration purposes

    // Update the payment status to SUCCESS
    const updatedPayment = await prisma.payment.update({
      where: {
        id,
      },
      data: {
        status: "SUCCESS",
        paymentIntentId: "pi_" + Math.random().toString(36).substring(2, 15),
      },
    });

    // Create enrollment
    if (updatedPayment.userId && updatedPayment.courseId) {
      await prisma.enrollment.create({
        data: {
          user: { connect: { id: updatedPayment.userId } },
          course: { connect: { id: updatedPayment.courseId } },
          enrollmentDate: new Date(),
          status: "ACTIVE",
          paymentId: updatedPayment.id,
        },
      });

      // Remove from cart if it exists
      await prisma.cart.deleteMany({
        where: {
          userId: updatedPayment.userId,
          courseId: updatedPayment.courseId,
        },
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Payment processed successfully",
      data: updatedPayment,
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    const errorResponse = handlePrismaError(error);
    return res.status(errorResponse.statusCode).json(errorResponse);
  }
};