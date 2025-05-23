import { prisma } from "../models/index.js";

export const createWishlist = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    // Check if the wishlist already exists
    const existingWishlist = await prisma.wishlist.findFirst({
      where: {
        userId,
        courseId,
      },
    });
    if (existingWishlist) {
      return res.status(400).json({ message: "Course already in wishlist" });
    }

    // Create Wishlist
    const wishlist = await prisma.wishlist.create({
      data: {
        userId,
        courseId,
      },
    });

    return res
      .status(201)
      .json({ message: "Wishlist created successfully", wishlist });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await prisma.wishlist.findMany({
      where: {
        userId,
      },
      include: {
        course: {
          select: {
            title: true,
            price: true,
            discountPrice: true,
            imageUrl: true,
            reviews: {
              select: {
                rating: true,
              },
            },
            instructor: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Transform the data to include total reviews, average rating, and image URL
    const formattedWishlist = wishlist.map((item) => {
      const totalReviews = item.course.reviews.length;
      const averageRating =
        totalReviews > 0
          ? item.course.reviews.reduce(
              (acc, review) => acc + review.rating,
              0
            ) / totalReviews
          : 0;

      // Safely map instructors
      const instructors = Array.isArray(item.course.teacher)
        ? item.course.teacher.map(
            (inst) => `${inst.user.firstName} ${inst.user.lastName}`
          )
        : [];

      return {
        title: item.course.title,
        image: item.course.imageUrl ?? null,
        instructors, // If there are no instructors, it will be an empty array
        reviews: totalReviews,
        originalPrice: item.course.price,
        discountedPrice: item.course.discountPrice,
        rating: averageRating.toFixed(1),
      };
    });

    return res.status(200).json({ wishlist: formattedWishlist });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
