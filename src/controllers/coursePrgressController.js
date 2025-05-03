import { prisma } from "../models/index.js";

export const courseProgress = async (req, res) => {
  try {
    const { userId, courseId, moduleId } = req.body;

    //  Find or create courseProgress entry for this module
    let moduleProgress = await prisma.courseProgress.findFirst({
      where: {
        userId,
        courseId,
        moduleId,
      },
    });

    // If moduleProgress doesn't exist, create it with completed = true
    if (!moduleProgress) {
      await prisma.courseProgress.create({
        data: {
          userId,
          courseId,
          moduleId,
          completed: true,
        },
      });
    } else if (!moduleProgress.completed) {
      // If it exists but wasn't completed, mark it as completed
      await prisma.courseProgress.update({
        where: { id: moduleProgress.id },
        data: { completed: true },
      });
    }

    //  Get total modules in the course
    const totalModules = await prisma.module.count({
      where: { courseId },
    });

    // Step 3: Get completed modules by user in the course
    const completedModules = await prisma.courseProgress.count({
      where: {
        userId,
        courseId,
        completed: true,
      },
    });

    //  Calculate progress percentage
    let progressPercentage = Math.floor(
      (completedModules / totalModules) * 100
    );
    if (completedModules === totalModules) {
      progressPercentage = 100;
    }

    //  Update progress for all courseProgress entries in this course
    await prisma.courseProgress.updateMany({
      where: {
        userId,
        courseId,
      },
      data: {
        progress: progressPercentage,
      },
    });

    return res.status(200).json({ progress: progressPercentage });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
