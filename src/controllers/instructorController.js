import { AppError } from "../middleware/errorHandler.js";
import { prisma } from "../models/index.js";
export const createInstructor = async (req, res, next) => {
  try {
    const {
      bio,
      about,
      website,
      facebook,
      instagram,
      linkedin,
      twitter,
      whatsapp,
      youtube,
    } = req.body;

    const userId = await req.user?.id;

    if (!userId) {
      return next(new AppError("userId is required", 400));
    }

    const newInstructor = await prisma.instructor.create({
      data: {
        userId,
        bio,
        about,
        website,
        facebook,
        instagram,
        linkedin,
        twitter,
        whatsapp,
        youtube,
      },
    });

    // update user role
    await prisma.user.update({
      where: { id: userId },
      data: { role: "TEACHER" },
    });

    return res.status(201).json({
      msg: "Instructor created successfully",
      data: newInstructor,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllInstructors = async (req, res, next) => {
  try {
    const instructors = await prisma.instructor.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            imageUrl: true,
            country: true,
            city: true,
            createdCourses: true,
          },
        },
        ratings: true,
        CourseInstructor: true,
      },
    });

    return res.status(200).json({
      msg: "All instructors fetched successfully",
      data: instructors,
    });
  } catch (error) {
    next(error);
  }
};

export const getInstructorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const instructor = await prisma.instructor.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            imageUrl: true,
            country: true,
            city: true,
            createdCourses: {
              include: {
                enrollments: true,
                reviews: true,
                category: true,
                subCategory: true,
              },
            },
          },
        },
        ratings: {
          include: {
            user: true, // 👉 includes user data for each rating
          },
        },
        CourseInstructor: true,
      },
    });

    if (!instructor) {
      return next(new AppError("Instructor not found", 404));
    }

    const totalInstructedCourses = instructor.CourseInstructor.reduce(
      (acc, course) => acc + course.enrollments.length,
      0
    );

    const totalReviews = instructor.CourseInstructor.reduce(
      (acc, course) => acc + course.reviews.length,
      0
    );
    const totalCourses = instructor.user.createdCourses.length;
    const totalStudents = await prisma.enrollment.count({
      where: {
        courseId: {
          in: instructor.user.createdCourses.map((c) => c.id),
        },
      },
    });
    return res.status(200).json({
      msg: "Instructor found",
      data: {
        totalInstructedCourses,
        totalReviews,
        totalCourses,
        totalStudents,
        info: {
          id: instructor.id,
          bio: instructor.bio,
          about: instructor.about,
          website: instructor.website,
          facebook: instructor.facebook,
          instagram: instructor.instagram,
          linkedin: instructor.linkedin,
          twitter: instructor.twitter,
          whatsapp: instructor.whatsapp,
          youtube: instructor.youtube,
          firstName: instructor.user.firstName,
          lastName: instructor.user.lastName,
          imageUrl: instructor.user.imageUrl,
          country: instructor.user.country,
          city: instructor.user.city,
        },
        myCourses: instructor.user.createdCourses,
        instructedCourses: instructor.CourseInstructor,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllInstructorListForAddingInCourse = async (req, res, next) => {
  try {
    const instructors = await prisma.instructor.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            imageUrl: true,
            country: true,
            city: true,
          },
        },
      },
    });
    const instructorList = instructors.map((instructor) => {
      return {
        id: instructor.id,
        name: instructor.user.firstName + " " + instructor.user.lastName,
        imageUrl: instructor.user.imageUrl,
        country: instructor.user.country,
        city: instructor.user.city,
        userId: instructor.user.id,
      };
    });
    return res.status(200).json({
      msg: "Instructor list fetched successfully",
      data: instructorList,
    });
  } catch (error) {
    next(error);
  }
};

export const getInstructorByUserId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const instructor = await prisma.instructor.findUnique({
      where: { userId: id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            imageUrl: true,
            country: true,
            city: true,
            createdCourses: {
              include: {
                enrollments: true,
                reviews: true,
                category: true,
                subCategory: true,
              },
            },
          },
        },
        ratings: {
          include: {
            user: true, // 👉 includes user data for each rating
          },
        },
        CourseInstructor: true,
      },
    });

    if (!instructor) {
      return next(new AppError("Instructor not found", 404));
    }

 

    const totalReviews = instructor.CourseInstructor.reduce(
      (acc, course) => acc + (course?.reviews?.length || 0),
      0
    );
    const totalCourses = instructor.user.createdCourses.length;
    const totalStudents = await prisma.enrollment.count({
      where: {
        courseId: {
          in: instructor.user.createdCourses.map((c) => c.id),
        },
      },
    });
    return res.status(200).json({
      msg: "Instructor found",
      data: {
        totalInstructedCourses: instructor?.CourseInstructor?.length || 0,
        totalReviews,
        totalCourses,
        totalStudents,
        info: {
          id: instructor.id,
          bio: instructor.bio,
          about: instructor.about,
          website: instructor.website,
          facebook: instructor.facebook,
          instagram: instructor.instagram,
          linkedin: instructor.linkedin,
          twitter: instructor.twitter,
          whatsapp: instructor.whatsapp,
          youtube: instructor.youtube,
          firstName: instructor.user.firstName,
          lastName: instructor.user.lastName,
          imageUrl: instructor.user.imageUrl,
          country: instructor.user.country,
          city: instructor.user.city,
        },
        myCourses: instructor.user.createdCourses,
        instructedCourses: instructor.CourseInstructor,
      },
    });
  } catch (error) {
    next(error);
  }
};

// export const getTopInstructorOfMonth = async (req, res, next) => {
//   try {
//     const startOfMonth = new Date(
//       new Date().getFullYear(),
//       new Date().getMonth(),
//       1
//     );
//     const endOfMonth = new Date(
//       new Date().getFullYear(),
//       new Date().getMonth() + 1,
//       0
//     );

//     const topInstructors = await prisma.instructor.findMany({
//       where: {
//         ratings: {
//           some: {
//             createdAt: {
//               gte: startOfMonth,
//               lte: endOfMonth,
//             },
//           },
//         },
//       },
//       include: {
//         user: true,
//         ratings: true,
//       },
//     });

//     // Rating average 
//     const sortedInstructors = topInstructors
//       .map((instructor) => {
//         const ratings = instructor.ratings;
//         const avgRating =
//           ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length || 0;

//         return {
//           ...instructor,
//           averageRating: avgRating,
//         };
//       })
//       .sort((a, b) => b.averageRating - a.averageRating)
//       .slice(0, 5); // Top 5

//     res.status(200).json(sortedInstructors);
//   } catch (error) {
//     next(error);
//   }
// };

// get instructor popular by averageRating

export const getTopInstructorOfMonth = async (req, res, next) => {
  try {
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const endOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0
    );

    const topInstructors = await prisma.instructor.findMany({
      where: {
        ratings: {
          some: {
            createdAt: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
        },
      },
      include: {
        user: true,
        ratings: true,
        Course: {
          select: {
            title: true,
            enrollments: true,
            reviews: true,
            category: true,
            subCategory: true,
            id: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    const sortedInstructors = topInstructors
      .map((instructor) => {
        const ratings = instructor.ratings;
        const avgRating =
          ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length || 0;

        const totalEnrollments = instructor.Course.reduce(
          (total, course) => total + course.enrollments.length,
          0
        );

        return {
          ...instructor,
          averageRating: avgRating,
          totalEnrollments,
        };
      })
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 5); // Top 5

    res.status(200).json(sortedInstructors);
  } catch (error) {
    next(error);
  }
};

export const getTopInstructor = async (req, res, next) => {
  try {
    const instructors = await prisma.instructor.findMany({
      include: {
        user: true,
        ratings: true,
        Course: {
          select: {
            title: true,
            enrollments: true,
            reviews: true,
            category: true,
            subCategory: true,
            id: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    const sortedInstructors = instructors
      .map((instructor) => {
        const ratings = instructor?.ratings;
        const avgRating =
          ratings?.reduce((sum, r) => sum + r.rating, 0) / ratings.length || 0;
        
          const totalEnrollments = instructor?.Course.reduce(
            (total, course) => total + course?.enrollments.length,
            0
          );

        return {
          ...instructor,
          averageRating: avgRating,
          totalEnrollments,
        };
      })
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 5); // Top 5

    res.status(200).json(sortedInstructors);
  } catch (error) {
    next(error);
  }
};

export const updateInstructor = async (req, res, next) => {
  try {
    const { id } = req.params; // id is the User ID

    const {
      firstName,
      lastName,
      username, // assuming this will be added to your user model
      phoneNumber,
      imageUrl,
      title, // assuming this exists in instructor model
      biography, // assuming this maps to 'bio' in instructor model
      about,
      website,
      facebook,
      instagram,
      linkedin,
      twitter,
      whatsapp,
      youtube,
    } = req.body;

    // Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return next(new AppError("User not found", 404));
    }

    // Update User
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        imageUrl,
        // Include username if it's part of your schema
      },
    });

    // Update Instructor
    const updatedInstructor = await prisma.instructor.update({
      where: { userId: id },
      data: {
        bio: biography,
        title,
        phone: phoneNumber,
        about,
        website,
        facebook,
        instagram,
        linkedin,
        twitter,
        whatsapp,
        youtube,
      },
    });

    return res.status(200).json({
      msg: "Instructor updated successfully",
      data: {
        user: updatedUser,
        instructor: updatedInstructor,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteInstructor = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedInstructor = await prisma.instructor.delete({
      where: { id },
    });

    return res.status(200).json({
      msg: "Instructor deleted successfully",
      data: deletedInstructor,
    });
  } catch (error) {
    next(error);
  }
};
