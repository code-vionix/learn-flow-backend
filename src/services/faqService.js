import { prisma } from "../models/index.js";


export const faqService = {
  createFaqGroup: async ({ role, category, faqs }) => {
    return await prisma.faqGroup.create({
      data: {
        role,
        category,
        faqs: {
          create: faqs.map((faq) => ({
            question: faq.question,
            answer: faq.answer,
          })),
        },
      },
      include: {
        faqs: true,
      },
    });
  },

  getAllFaqGroups: async () => {
    return await prisma.faqGroup.findMany({
      include: {
        faqs: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },
  
  // get all faq group by id
  getFaqsByCategoryId: async (id) => {
    return await prisma.faqGroup.findUnique({
      where: { id },
      select: {
        faqs: true,
      }
    });
  },

  getFaqByRoleService: async (role) => {
    return await prisma.faqGroup.findMany({
      where: { role },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  updateFaqGroup: async (id, { role, category }) => {
    return await prisma.faqGroup.update({
      where: { id },
      data: {
        role,
        category,
        updatedAt: new Date(),
      },
    });
  },

  deleteFaqGroup: async (id) => {
    return await prisma.faqGroup.delete({
      where: { id },
    });
  },
};
