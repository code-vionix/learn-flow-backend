import { AppError } from "../middleware/errorHandler.js";
import { prisma } from "../models/index.js";

import { InstructorService } from "../services/instructorService.js";

// // create an insttructors
// export const createInstructor = async (req, res, next) => {
//   const { userId } = req.body;
//   // Check if instructor already exists for this user
//   const existingInstructor = await prisma.instructor.findUnique({
//     where: { userId },
//   });

//   if (existingInstructor) {
//     return next(
//       new AppError("Instructor profile already exists for this user", 400)
//     );
//   }

//   // Create instructor
//   const instructor = await prisma.instructor.create({
//     data: {
//       userId,
//     },
//     include: {
//       user: {
//         select: {
//           firstName: true,
//           lastName: true,
//           email: true,
//         },
//       },
//     },
//   });

//   if (instructor) {
//     res.status(201).json(instructor);
//   }
// };

// // get all instructor
// // export const getAllInstructors = async (_req, res) => {
// //   const instructors = await prisma.instructor.findMany({
// //     where: { deletedAt: null },
// //     orderBy: {
// //       createdAt: "desc",
// //     },
// //   });

// //   return res.status(200).json(instructors);
// // };

// export const getAllInstructors = async (_req, res) => {
//   try {
//     const instructors = await prisma.instructor.findMany({
//       where: { deletedAt: null },
//       orderBy: {
//         createdAt: "desc",
//       },
//       include: {
//         user: true,         // Include full user object
//         Course: true,       // Include courses taught by instructor
//         ratings: true,      // Include ratings for the instructor
//       },
//     });

//     return res.status(200).json(instructors);
//   } catch (error) {
//     console.error("Error fetching instructors:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };


// // get single instructors by id instructor
// export const getInstructorsById = async (req, res, next) => {
//   const { id } = req.params;
//   try {
//     const instructor = await prisma.instructor.findUnique({
//       where: { deletedAt: null, id },
//     });
//     if (!instructor) {
//       return next(new AppError("Instructor not found", 404));
//     }
//     if (instructor) {
//       res.status(200).json(instructor);
//     }
//   } catch (error) {
//     next(new AppError("Something went wrong", 500)); // Handle unexpected errors
//   }
// };

// // update instructor
// export const updateInstructor = async (req, res, next) => {
//   const { id } = req.params;
//   const instructorData = req.body;
//   try {
//     const instructor = await prisma.instructor.findUnique({
//       where: { id },
//     });
//     if (!instructor) {
//       throw new AppError("Instructor not found", 404);
//     }
//     const updateInstructor = await prisma.instructor.update({
//       where: { deletedAt: null, id },
//       data: instructorData,
//       include: {
//         user: {
//           select: {
//             firstName: true,
//             lastName: true,
//             email: true,
//           },
//         },
//       },
//     });

//     if (updateInstructor) {
//       return res.status(200).json(updateInstructor);
//     }
//   } catch (error) {
//     next(new AppError("Something went wrong", 500));
//   }
// };

// // Delete instructor
// export const deleteInstructor = async (req, res, next) => {
//   const { id } = req.params;
//   try {
//     const instructor = await prisma.instructor.update({
//       where: { id },
//       data: { deletedAt: new Date() },
//     });

//     return res.status(202).json({
//       instructor: instructor.bio || "",
//       status: "success",
//       message: "Instructor deleted successfully",
//     });
//   } catch (error) {
//     next(new AppError("Something went wrong", 500));
//   }
// };





export const createInstructor = async (req, res, next) => {
  try {
    const { userId, bio, about, website, facebook, instagram, linkedin, twitter, whatsapp, youtube } = req.body;

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
        user: true,
        ratings: true,
        Course: true,
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
    console.log("instructor id", id);

    const instructor = await prisma.instructor.findUnique({
      where: { userId: id },
      include: {
        user: true,
        ratings: {
          include: {
            user: true, // 👉 includes user data for each rating
          },
        },
        Course: {
          include: {
            enrollments: true,
            reviews: true,
            category: true,
            subCategory: true,
          },
        },
      },
    });

    if (!instructor) {
      return next(new AppError("Instructor not found", 404));
    }

    const totalEnrollments = instructor.Course.reduce(
      (acc, course) => acc + course.enrollments.length,
      0
    );

    const totalReviews = instructor.Course.reduce(
      (acc, course) => acc + course.reviews.length,
      0
    );

    return res.status(200).json({
      msg: "Instructor found",
      data: {
        instructor,
        totalEnrollments,
        totalReviews,
      },
    });
  } catch (error) {
    next(error);
  }
};



// @desc    Update Instructor
// @route   PUT /api/v1/instructors/:id
// @access  Private
// export const updateInstructor = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;

//     const updatedInstructor = await prisma.instructor.update({
//       where: { id },
//       data: updateData,
//     });

//     return res.status(200).json({
//       msg: "Instructor updated successfully",
//       data: updatedInstructor,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const updateInstructor = async (req, res, next) => {
  try {
    const { id } = req.params; // id is the User ID

    const {
      firstName,
      lastName,
      username,      // assuming this will be added to your user model
      phoneNumber,
      imageUrl,
      title,         // assuming this exists in instructor model
      biography,     // assuming this maps to 'bio' in instructor model
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
        imageUrl
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


// export const updateInstructor = async (req, res, next) => {
//   try {
//     const { id } = req.params; // এখানে id হলো Instructor এর userId (User এর id)

//     const {
//       firstName,
//       lastName,
//       username,
//       phoneNumber,
//       title,
//       biography, // bio
//     } = req.body;

//     // Check user exists
//     const existingUser = await prisma.user.findUnique({
//       where: { id },
//     });

//     if (!existingUser) {
//       return next(new AppError("User not found", 404));
//     }

//     // Update User table
//     const updatedUser = await prisma.user.update({
//       where: { id },
//       data: {
//         firstName,
//         lastName,
//         phoneNumber,
//         // আপনি চাইলে username আলাদা ফিল্ড হিসেবে যোগ করতে পারেন user মডেলে
//       },
//     });

//     // Update Instructor table
//     const updatedInstructor = await prisma.instructor.update({
//       where: { userId: id },
//       data: {
//         bio: biography,
//         // title ফিল্ড Instructor মডেলে না থাকলে যোগ করতে হবে schema-তে
//       },
//     });

//     return res.status(200).json({
//       msg: "Instructor updated successfully",
//       data: {
//         user: updatedUser,
//         instructor: updatedInstructor,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };


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
