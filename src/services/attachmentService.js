// src/services/attachmentService.ts
import prisma from "../prisma/client";
import fileStorageService from "./fileStorageService"; // Import file service

const attachmentService = {
  async createAttachment(lessonId, name, url) {
    return prisma.attachment.create({
      data: {
        name,
        url,
        lesson: { connect: { id: lessonId } },
      },
    });
  },

  async deleteAttachment(attachmentId) {
    const attachment = await prisma.attachment.findUnique({
      where: { id: attachmentId },
      select: { url: true },
    });

    if (!attachment) {
        throw new Error("Attachment not found");
    }

    // Delete the file asynchronously
    fileStorageService.deleteFile(attachment.url).catch(console.error);

    // Delete the attachment record
    return prisma.attachment.delete({
      where: { id: attachmentId },
    });
  },
};

export default attachmentService;