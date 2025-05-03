import { prisma } from "../models/index.js";

export const saveMessage = async ({ chatId, senderId, message, fileUrl }) => {
  return await prisma.message.create({
    data: {
      chatId,
      senderId,
      message,
      fileUrl,
    },
  });
};

export const getMessagesByChat = async (chatId) => {
  return await prisma.message.findMany({
    where: { chatId },
    include: { sender: true },
    orderBy: { createdAt: 'asc' },
  });
};
