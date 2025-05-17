import { createContact } from "../controllers/contactController.js";
import { prisma } from "../models/index.js";


export const ContactService = {
  createContact: async (data) => {
    return await prisma.contact.create({ data });
  },

  getAllContacts: async () => {
    return await prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  getContactById: async (id) => {
    return await prisma.contact.findUnique({
      where: { id },
    });
  },

  deleteContact: async (id) => {
    return await prisma.contact.delete({
      where: { id },
    });
  },
};
