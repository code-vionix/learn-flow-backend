import { deleteModule } from "../controllers/moduleController.js";
import { prisma } from "../models/index.js";

export const moduleService = {
  getAllModules: async () => {
    return await prisma.module.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        order: true,
        courseId: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        lessons: {
          select: {
            id: true,
            title: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        Assignments: {
          select: {
            id: true,
            title: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  },

  getSingleModuleWithCourse: async (moduleId) => {
    return await prisma.module.findUnique({
      where: { id: moduleId, deletedAt: null },
      select: {
        id: true,
        title: true,
        order: true,
        courseId: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        lessons: {
          select: {
            id: true,
            title: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        Assignments: {
          select: {
            id: true,
            title: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  },


  // createModule: async (moduleData) => {
  //   const { title, courseId, order } = moduleData;

  //   return await prisma.module.create({
  //     data: {
  //       title,
  //       courseId
  //     },
  //     select: {
  //       id: true,
  //         title: true,
  //         order: true,
  //         courseId: true,
  //         createdAt: true,
  //         updatedAt: true,
  //         deletedAt: true,

  //     },
  //   });
  // },

  createModule: async (moduleData) => {
    const { title, courseId, order } = moduleData;

    return await prisma.module.create({
      data: {
        title,
        courseId,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        // lessons: [],
        // course: [],
        // Assignments: [],
        order,
      },
      select: {
        id: true,
        title: true,
        order: true,
        courseId: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        createdAt: true,
        updatedAt: true,
        lessons: true,
        // course: true,
        // Assignments: true,
      },
    });
  },

  updateModule: async (moduleId, moduleData) => {
    const { title, courseId, order } = moduleData;

    return await prisma.module.update({
      where: { id: moduleId },
      data: {
        title,
        courseId,
        order,
      },
      select: {
        id: true,
        title: true,
        order: true,
        courseId: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        lessons: {
          select: {
            id: true,
            title: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        Assignments: {
          select: {
            id: true,
            title: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  },

  deleteModule: async (moduleId) => {
    await prisma.module.update({
      where: { id: moduleId },
      data: {
        deletedAt: new Date(),
      },
      select: {
        id: true,
        title: true,
        order: true,
        courseId: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        lessons: {
          select: {
            id: true,
            title: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        Assignments: {
          select: {
            id: true,
            title: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return {
      status: 200,
      message: `Module with id ${moduleId} deleted successfully`,
    };
  },
};
