import { prisma } from "../models/index.js";

export const faqService = {
  createFaqGroup: async ({ role, category, faqs }) => {
    const data = {
      role,
      category,
      ...(faqs?.length > 0 && {
        faqs: {
          create: faqs.map((faq) => ({
            question: faq.question,
            answer: faq.answer,
          })),
        },
      }),
    };

    return await prisma.faqGroup.create({
      data,
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
      },
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

  getFaqById: async (id) => {
    return await prisma.faq.findUnique({
      where: { id },
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

  createFaq: async ({ question, answer, faqGroupId }) => {
    return await prisma.faq.create({
      data: {
        question,
        answer,
        faqGroupId,
      },
    });
  },

  updateFaq: async (id, { question, answer }) => {
    return await prisma.faq.update({
      where: { id },
      data: {
        question,
        answer,
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
