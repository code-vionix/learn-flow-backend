import { prisma } from "../models/index.js";

export const TestimonialService = {
  // Create a new testimonial
  createTestimonial: async (data) => {
    return await prisma.testimonial.create({
      data,
    });
  },

  // Get all testimonials that are not deleted
  getAllTestimonials: async () => {
    return await prisma.testimonial.findMany({
      where: { deletedAt: null },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  // Get a testimonial by its ID
  getTestimonialById: async (id) => {
    return await prisma.testimonial.findUnique({
      where: { id },
    });
  },

  // Update a testimonial by its ID
  updateTestimonial: async (id, data) => {
    return await prisma.testimonial.update({
      where: { id },
      data,
    });
  },

  // Soft delete a testimonial by setting deletedAt
  deleteTestimonial: async (id) => {
    return await prisma.testimonial.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  },
};
