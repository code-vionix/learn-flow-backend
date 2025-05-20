import { buildCourseFilter } from "../lib/courseFilters.js";
import { AppError } from "../middleware/errorHandler.js";
import { prisma } from "../models/index.js";
import { sortByType } from "../utils/sortByType.js";
import { uploadFile } from "../utils/cloudinaryUpload.js";

// create courese
export const createCourse = async (req, res, next) => {
  const {
    title,
    subtitle,
    categoryId,
    subCategoryId,
    topic,
    language,
    subtitleLanguages,
    level,
    duration,
    durationUnit,
    tools,
  } = req.body;

  console.log(req.user);
  const teacherId = req.user.id;
  try {
    // Validate required fields
    if (
      !title ||
      !subtitle ||
      !categoryId ||
      !subCategoryId ||
      !topic ||
      !language ||
      !subtitleLanguages ||
      !level ||
      !duration ||
      !durationUnit
    ) {
      return next(new AppError("All fields are required", 400));
    }

    // Validate level is one of the allowed
    const validLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
    if (!validLevels.includes(level)) {
      return next(new AppError("Invalid level value", 400));
    }

    // subtitleLanguages must be an array
    if (!Array.isArray(subtitleLanguages)) {
      return next(new AppError("subtitleLanguages must be an array", 400));
    }

    // tools can be optional, but if present, must be array
    if (tools && !Array.isArray(tools)) {
      return next(new AppError("tools must be an array if provided", 400));
    }

    // Create the course and include category and subcategory relations
    const course = await prisma.course.create({
      data: {
        teacherId,
        title,
        subtitle,
        categoryId,
        subCategoryId,
        topic,
        language,
        subtitleLanguages,
        level,
        duration,
        durationUnit,
        tools,
        deletedAt: null,
      },
      include: {
        category: true, // Include category details
        subCategory: true, // Include subcategory details
      },
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    return next(new AppError(error.message || "Something went wrong", 500));
  }
};
//Get all course

export const getAllCourse = async (req, res, next) => {
  try {
    const whereClause = buildCourseFilter(req.query);
    const orderBy = sortByType(req.query);

    const courses = await prisma.course.findMany({
      where: whereClause,
      orderBy,
      include: {
        category: { include: { SubCategory: true } },
        subCategory: { select: { name: true } },
        reviews: {
          select: { rating: true, comment: true, userId: true, id: true },
        },
        enrollments: true,
      },
    });

    if (!courses.length) {
      return res.status(404).json({ message: "No courses found." });
    }

    const newUpdateCourse = courses.map((course) => {
      const totalRating =
        course?.reviews?.reduce(
          (acc, review) => acc + (review?.rating || 0),
          0
        ) || 0;
      const ratingCount = course?.reviews?.length || 0;
      const averageRating = ratingCount > 0 ? totalRating / ratingCount : 0;

      return {
        ...course,
        rating: averageRating,
        students: course?.enrollments?.length || 0,
      };
    });

    return res.status(200).json(newUpdateCourse);
  } catch (error) {
    console.error(error);
    return next(new AppError("An error occurred while fetching courses.", 500));
  }
};

// get best selling
export const getBestSellingCourses = async (req, res) => {
  try {
    const bestSellingCourses = await prisma.course.findMany({
      where: {
        deletedAt: null, // exclude deleted courses
        status: "PUBLISHED", // only published courses
      },
      include: {
        _count: {
          select: { enrollments: true },
        },
        category: {
          select: { id: true, name: true },
        },
      },
      orderBy: {
        enrollments: {
          _count: "desc",
        },
      },
      take: 10, // return top 10 best selling
    });

    res.status(200).json({
      success: true,
      data: bestSellingCourses,
    });
  } catch (error) {
    console.error("Error fetching best selling courses:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

// get best selling
export const getFeaturedCourses = async (req, res) => {
  try {
    const bestSellingCourses = await prisma.course.findMany({
      where: {
        deletedAt: null,
        isFeatureCourse: true,
      },
      take: 4,
      include: {
        category: { include: { SubCategory: true } },
        subCategory: { select: { name: true } },
        reviews: {
          select: { rating: true, comment: true, userId: true, id: true },
        },
        enrollments: true,
      },
    });

    res.status(200).json({
      success: true,
      data: bestSellingCourses,
    });
  } catch (error) {
    console.error("Error fetching best selling courses:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

//get best selling courses by category id
export const getBestSellingCoursesByCategory = async (req, res) => {
  try {
    const bestSellingCourses = await prisma.course.findFirst({
      where: {
        deletedAt: null,
        status: "PUBLISHED",
      },
      orderBy: {
        enrollments: {
          _count: "desc",
        },
      },
      include: {
        category: true,
        subCategory: true,
        instructor: {
          include: {
            user: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      data: bestSellingCourses,
    });
  } catch (error) {
    console.error("Error fetching best selling courses:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

// get course by id
// export const getCourseById = async (req, res, next) => {
//   const { id } = req.params;

//   try {
//     if (!id) {
//       return next(new AppError("Course ID is required", 400));
//     }

//     // Fetch main course data
//     const course = await prisma.course.findUnique({
//       where: {
//         id,
//         deletedAt: null,
//       },
//       include: {
//         instructor:true,
//         category: true,
//         subCategory: true,
//         reviews: {
//           include: {
//             user: true,
//           },
//         },
//         teacher: true,
//         assignments: true,
//         quizzes: true,
//         learnings: true,
//         targetAudiences: true,
//         PreRequirement: true,
//         Revenue: true,
//         Cart: true,
//         Wishlist: true,
//         CourseProgress: true,
//         payment: true,
//       },
//     });

//     if (!course) {
//       return next(new AppError("Course not found!", 404));
//     }

//     // Fetch modules (sections) with lessons
//     const modules = await prisma.module.findMany({
//       where: {
//         courseId: id,
//       },
//       include: {
//         lessons: true,
//       },
//     });

//     // Add modules to course
//     course.modules = modules;

//     // Calculate derived values
//     const reviews = course.reviews || [];
//     const reviewCount = reviews.length;
//     const averageRating = reviewCount
//       ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1)
//       : null;

//     const isDiscounted = course.price > course.discountPrice;

//     // Attach derived fields
//     course.averageRating = averageRating;
//     course.reviewCount = reviewCount;
//     course.isDiscounted = isDiscounted;

//     res.status(200).json(course);
//   } catch (error) {
//     console.error("Error in getCourseById:", error);
//     return next(new AppError("Something went wrong", 500));
//   }
// };

export const getCourseById = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!id) {
      return next(new AppError("Course ID is required", 400));
    }

    const course = await prisma.course.findUnique({
      where: { id, deletedAt: null },
      select: {
        id: true,
        title: true,
        subtitle: true,
        category: { select: { name: true } },
        subCategory: { select: { name: true } },
        topic: true,
        description: true,
        language: true,
        subtitleLanguages: true,
        level: true,
        duration: true,
        thumbnail: true,
        trailer: true,
        price: true,
        discountPrice: true,
        discountPercentage: true,
        startDate: true,
        endDate: true,
        imageUrl: true,
        deletedAt: true,
        teacherId: true,
        status: true,
        visibility: true,
        instructorId: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
        tools: true,
        welcomeMessage: true,
        congratulationsMessage: true,
        certificateTemplateUrl: true,
        isFeatureCourse: true,
        modules: {
          where: { deletedAt: null },
          select: {
            id: true,
            title: true,
            lessons: {
              where: { deletedAt: null },
              select: {
                id: true,
                title: true,
                videoUrl: true,
                caption: true,
                note: true,
                attachment: true,
                content: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      return next(new AppError("Course not found!", 404));
    }

    // Aggregate reviews
    const reviewsAggregate = await prisma.reviews.aggregate({
      where: { courseId: id },
      _count: { id: true },
      _avg: { rating: true },
    });

    const reviewCount = reviewsAggregate._count.id || 0;
    const averageRating = reviewsAggregate._avg.rating
      ? reviewsAggregate._avg.rating.toFixed(1)
      : null;

    // Count enrollments
    const enrollmentCount = await prisma.enrollment.count({
      where: { courseId: id },
    });

    const isDiscounted =
      course.price !== null &&
      course.discountPrice !== null &&
      course.price > course.discountPrice;

    const response = {
      ...course,
      categoryName: course.category?.name || null,
      subCategoryName: course.subCategory?.name || null,
      reviewCount,
      averageRating,
      enrollmentCount,
      isDiscounted,
    };

    // Remove full category and subCategory if name exists
    if (response.categoryName) delete response.category;
    if (response.subCategoryName) delete response.subCategory;

    res.status(200).json(response);
  } catch (error) {
    console.error("Error in getCourseById:", error);
    return next(new AppError("Something went wrong", 500));
  }
};

//course update
export const UpdateCourse = async (req, res, next) => {
  const { id } = req.params;
  const teacherId = req.user.id;
  const {
    title,
    subtitle,
    categoryId,
    subCategoryId,
    topic,
    language,
    subtitleLanguages,
    level,
    duration,
    durationUnit,
    tools,
    description,
    whatYouWillLearn,
    targetAudience,
    courseRequirements,
    price,
    discountPrice,
    discountPercentage,
    startDate,
    endDate,
    status,
    visibility,
    deletedAt,
  } = req.body;

  try {
    // Upload files if provided
    const thumbnailFile = req?.files?.thumbnail?.[0];
    const thumbnailUrl = thumbnailFile
      ? await uploadFile(thumbnailFile, "courses-thumbnails")
      : "";

    const imageUrlFile = req?.files?.imageUrl?.[0];
    const imageUrl = imageUrlFile
      ? await uploadFile(imageUrlFile, "courses-images")
      : "";

    const trailerFile = req?.files?.trailer?.[0];
    const trailerUrl = trailerFile
      ? await uploadFile(trailerFile, "courses-trailers")
      : "";

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id, deletedAt: null },
    });

    if (!existingCourse) {
      return next(new AppError("Course not found", 404));
    }

    // Prepare update data
    const updateData = {
      title: title || existingCourse.title,
      teacherId: teacherId,
      subtitle: subtitle || existingCourse.subtitle,
      categoryId: categoryId || existingCourse.categoryId,
      subCategoryId: subCategoryId || existingCourse.subCategoryId,
      topic: topic || existingCourse.topic,
      language: language || existingCourse.language,
      subtitleLanguages: subtitleLanguages || existingCourse.subtitleLanguages,
      level: level || existingCourse.level,
      duration: duration || existingCourse.duration,
      durationUnit: durationUnit || existingCourse.durationUnit,
      tools: tools || existingCourse.tools,
      description: description || existingCourse.description,
      thumbnail: thumbnailUrl || existingCourse.thumbnail,
      trailer: trailerUrl || existingCourse.trailer,
      price: price || existingCourse.price,
      discountPrice: discountPrice || existingCourse.discountPrice,
      discountPercentage:
        discountPercentage || existingCourse.discountPercentage,
      startDate: startDate || existingCourse.startDate,
      endDate: endDate || existingCourse.endDate,
      imageUrl: imageUrl || existingCourse.imageUrl,
      status: status || existingCourse.status,
      visibility: visibility || existingCourse.visibility,
      deletedAt: deletedAt || existingCourse.deletedAt,
      updatedAt: new Date(),
    };

    // Conditionally update nested relations
    if (whatYouWillLearn) {
      updateData.learnings = {
        deleteMany: {},
        create: whatYouWillLearn.map((item) => ({
          description: item.description,
        })),
      };
    }

    if (targetAudience) {
      updateData.targetAudiences = {
        deleteMany: {},
        create: targetAudience.map((item) => ({
          description: item.description,
        })),
      };
    }

    if (courseRequirements) {
      updateData.PreRequirement = {
        deleteMany: {},
        create: courseRequirements.map((item) => ({
          description: item.description,
        })),
      };
    }

    // Final update
    const updatedCourse = await prisma.course.update({
      where: { id },
      data: updateData,
      include: {
        learnings: true,
        targetAudiences: true,
        PreRequirement: true,
      },
    });

    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error(error);
    return next(
      new AppError("Something went wrong while updating the course", 500)
    );
  }
};

//Delete course
export const DeleteCourse = async (req, res, next) => {
  const { id } = req.params;
  try {
    await prisma.course.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return res.status(202).json({
      status: "success",
      message: "Delete successfully",
    });
  } catch (error) {
    return next(new AppError("something went wrong", 500));
  }
};
//get instructor by course id
export const getInstructorByCourseId = async (req, res, next) => {
  console.log("params:", req.params);
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({ msg: "courseId is required" });
    }

    // Fetch course with instructor and specific user fields
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        instructor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                imageUrl: true,
                country: true,
                city: true,
              },
            },
            Course: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!course || !course.instructor) {
      return res
        .status(404)
        .json({ msg: "Instructor not found for this course" });
    }

    const instructor = course.instructor;
    const courseIds = instructor.Course.map((c) => c.id);
    const totalCourses = courseIds.length;

    const totalStudents = await prisma.enrollment.count({
      where: {
        courseId: {
          in: courseIds,
        },
      },
    });

    // Calculate average rating for all courses of this instructor
    const averageRatingResult = await prisma.reviews.aggregate({
      where: {
        courseId: {
          in: courseIds,
        },
      },
      _avg: {
        rating: true,
      },
    });

    const averageRating = averageRatingResult._avg.rating || 0;

    // Construct only the fields you need
    const user = instructor.user;
    const instructorResponse = {
      ...instructor,
      user: {
        fullName: `${user.firstName} ${user.lastName}`,
        imageUrl: user.imageUrl,
        country: user.country,
        city: user.city,
      },
      totalCourses,
      totalStudents,
      averageRating: parseFloat(averageRating.toFixed(1)), // Optional: format to 1 decimal place
    };

    return res.status(200).json({
      msg: "Instructor fetched successfully",
      data: instructorResponse,
    });
  } catch (error) {
    next(error);
  }
};

//get modules by course id
export const getModulesByCourseId = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return next(new AppError("Course ID is required", 400));
    }

    const modules = await prisma.module.findMany({
      where: { courseId },
      include: { lessons: true },
      orderBy: { order: "asc" },
    });

    if (!modules?.length) {
      return next(new AppError("No modules found for this course", 404));
    }

    // Flatten lessons and calculate stats in one loop
    let totalLessons = 0;
    let totalEstimatedMinutes = 0;

    modules.forEach((mod) => {
      totalLessons += mod.lessons.length;
      mod.lessons.forEach((lesson) => {
        totalEstimatedMinutes += lesson.estimatedTime || 0;
      });
    });

    const hours = Math.floor(totalEstimatedMinutes / 60);
    const minutes = totalEstimatedMinutes % 60;
    const totalEstimatedTime = hours ? `${hours}h ${minutes}m` : `${minutes}m`;

    res.status(200).json({
      status: "success",
      results: modules.length,
      totalModules: modules.length,
      totalLessons,
      totalEstimatedTime,
      data: modules,
    });
  } catch (error) {
    console.error("Error fetching modules:", error);
    next(new AppError("Server error while fetching modules", 500));
  }
};

//get learnings by course id
export const getLearningsByCourseId = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return next(new AppError("Course ID is required", 400));
    }

    const learnings = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        learnings: { select: { description: true } },
      },
    });

    if (!learnings) {
      return next(new AppError("No learnings found for this course", 404));
    }

    res.status(200).json({
      status: "success",
      results: learnings.learnings.length,
      data: learnings.learnings,
    });
  } catch (error) {
    console.error("Error fetching learnings by course ID:", error);
    next(new AppError("Server error while fetching learnings", 500));
  }
};

//get target audiences by course id
export const getTargetAudiencesByCourseId = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return next(new AppError("Course ID is required", 400));
    }

    const targetAudiences = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        targetAudiences: { select: { description: true } },
      },
    });

    if (!targetAudiences) {
      return next(
        new AppError("No target audiences found for this course", 404)
      );
    }

    res.status(200).json({
      status: "success",
      results: targetAudiences.targetAudiences.length,
      data: targetAudiences.targetAudiences,
    });
  } catch (error) {
    console.error("Error fetching target audiences by course ID:", error);
    next(new AppError("Server error while fetching target audiences", 500));
  }
};

//get course requirements by course id
export const getCourseRequirementsByCourseId = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return next(new AppError("Course ID is required", 400));
    }

    const courseRequirements = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        PreRequirement: { select: { description: true } },
      },
    });

    if (!courseRequirements) {
      return next(
        new AppError("No course requirements found for this course", 404)
      );
    }

    res.status(200).json({
      status: "success",
      results: courseRequirements.PreRequirement.length,
      data: courseRequirements.PreRequirement,
    });
  } catch (error) {
    console.error("Error fetching course requirements by course ID:", error);
    next(new AppError("Server error while fetching course requirements", 500));
  }
};

// get reviews by course id
export const getReviewsByCourseId = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return next(new AppError("Course ID is required", 400));
    }

    const courseWithReviews = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        reviews: {
          select: {
            id: true,
            userId: true,
            courseId: true,
            rating: true,
            comment: true,
            createdAt: true,
            updatedAt: true,
            anonymous: true,
            helpfulCount: true,
            unhelpfulCount: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    const reviews = courseWithReviews?.reviews || [];

    if (!reviews.length) {
      return next(new AppError("No reviews found for this course", 404));
    }

    // Calculate average rating and breakdown
    const totalReviews = reviews.length;
    let sumRatings = 0;
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    for (const review of reviews) {
      const rating = Math.round(review.rating);
      sumRatings += rating;
      if (breakdown[rating] !== undefined) breakdown[rating]++;
    }

    const averageRating = parseFloat((sumRatings / totalReviews).toFixed(1));

    const percentageBreakdown = {};
    for (let star = 1; star <= 5; star++) {
      percentageBreakdown[star] = parseFloat(
        ((breakdown[star] / totalReviews) * 100).toFixed(1)
      );
    }

    res.status(200).json({
      status: "success",
      totalReviews,
      averageRating,
      breakdown: percentageBreakdown,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews by course ID:", error);
    next(new AppError("Server error while fetching reviews", 500));
  }
};
// get enrolment by course id
export const getEnrolmentByCourseId = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return next(new AppError("Course ID is required", 400));
    }

    const enrolment = await prisma.enrollment.findMany({
      where: { courseId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            imageUrl: true,
          },
        },
      },
    });

    if (!enrolment.length) {
      return next(new AppError("No enrolment found for this course", 404));
    }

    res.status(200).json({
      status: "success",
      results: enrolment.length,
      data: enrolment,
    });
  } catch (error) {
    console.error("Error fetching enrolment by course ID:", error);
    next(new AppError("Server error while fetching enrolment", 500));
  }
};
