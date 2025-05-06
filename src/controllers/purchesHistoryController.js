import { prisma } from "../models/index.js";

export const purchesHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id:true,
            title: true,
            thumbnail: true,
            language: true,
            createdAt: true,
            teacher: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        payment: {
          select: {
            id: true,
            amount: true,
            method: true,
            status: true,
            createdAt: true,
            paymentIntentId: true,
            // card: {
            //   select: {
            //     last4: true,
            //     expMonth: true,
            //     expYear: true,
            //   },
            // },
          },
        },
      },
    });

    
    const enrichedEnrollments = await Promise.all(
      enrollments.map(async (enrollment) => {
        const courseId = enrollment.course.id;

        // Get average rating and total reviews
        const ratingData = await prisma.reviews.aggregate({
          where: { courseId },
          _avg: { rating: true },
          _count: { rating: true }, // counts the number of reviews
        });

        return {
          ...enrollment,
          course: [{
            ...enrollment.course,
            averageRating: parseFloat((ratingData._avg.rating || 0).toFixed(1)),
            totalReviews: ratingData._count.rating || 0,
          }]
        };
      })
    );
     // Remove courseId from the response
     const response = enrichedEnrollments.map((enrollment) => {
      const { courseId, ...rest } = enrollment;
      return rest;
    });

    res.status(200).json(response);
  } catch (err) {
    console.error("Error fetching user's enrollments:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
