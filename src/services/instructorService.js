 import { prisma } from "../models/index.js"
 
export const InstructorService = {
  createInstructor: async (data) => {
    return await prisma.instructor.create({
      data,
    });
  },

  getAllInstructors: async () => {
    return await prisma.instructor.findMany({
      where: { deletedAt: null },
      include: {
        user: true, // user সম্পর্কিত সব ডেটা
        ratings: true, // রেটিংস যদি দেখাতে চাও
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  getInstructorById: async (id) => {
    return await prisma.instructor.findUnique({
      where: { userId: id },
      include: {
        user: true,
        ratings: true,
      },
    });
  },

  updateInstructor: async (id, data) => {
    return await prisma.instructor.update({
      where: { id },
      data,
    });
  },

  deleteInstructor: async (id) => {
    return await prisma.instructor.update({
      where: { id },
      data: {
        deletedAt: new Date(), // Soft delete
      },
    });
  },
};
