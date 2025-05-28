import { prisma } from "../models/index.js";
export const getEnrolledTeacher = async (req, res) => {
  try {
    const userId = req.user?.id;

    // Step 1 & 2: Get all courses user enrolled in, with all instructors & their users
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      select: {
        course: {
          select: {
            enrollments: { select: { userId: true } }, // all students in this course
            CourseInstructor: {
              select: {
                instructor: {
                  select: {
                    id: true,
                    user: {
                      select: {
                        id: true,
                        title: true,
                        firstName: true,
                        lastName: true,
                        imageUrl: true,
                        Instructor: {
                          select: {
                            ratings: {
                              select: {
                                rating: true,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const instructorMap = new Map();

    enrollments.forEach(({ course }) => {
      // all students enrolled in this course
      const enrolledUserIds = course.enrollments.map((e) => e.userId);

      // multiple instructors for this course
      course.CourseInstructor.forEach(({ instructor }) => {
        const instructorUser = instructor.user;
        const instructorUserId = instructorUser.id;

        // If we already have this instructor, add new students
        if (instructorMap.has(instructorUserId)) {
          const existing = instructorMap.get(instructorUserId);
          enrolledUserIds.forEach((id) => existing.studentsSet.add(id));
        } else {
          // Calculate average rating
          const ratings = instructorUser.Instructor[0]?.ratings || [];
          const averageRating =
            ratings.length > 0
              ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
              : null;

          // Create new record with unique students set
          instructorMap.set(instructorUserId, {
            title: instructorUser.title,
            name: `${instructorUser.firstName} ${instructorUser.lastName || ""}`.trim(),
            image: instructorUser.imageUrl,
            rating: averageRating,
            studentsSet: new Set(enrolledUserIds),
          });
        }
      });
    });

    // Format final output: convert studentsSet to count
    const result = Array.from(instructorMap.values()).map((inst) => ({
      title: inst.title,
      name: inst.name,
      image: inst.image,
      rating: inst.rating,
      students: inst.studentsSet.size,
    }));

    return res.json(result);
  } catch (error) {
    console.error("Error fetching enrolled instructors:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
