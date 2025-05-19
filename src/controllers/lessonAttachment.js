import { AppError } from "../middleware/errorHandler.js";
import { prisma } from "../models/index.js";

// Create attachment
export const createAttachment = async (req, res, next) => {
  try {
    const { name, lessonId, attachment } = req.body;
    const userId = req.user?.id || "67debbfbd62e2129820291dc"; // fallback for testing

    if (!userId) return next(new AppError("Unauthorized request", 401));
    if (!name || !lessonId) {
      return next(new AppError("Name and lessonId are required", 400));
    }

    // Save to DB
    const newAttachment = await prisma.attachment.create({
      data: {
        name,
        url: attachment,
        lessonId,
        deletedAt: null,
      },
    });

    res.status(201).json(newAttachment);
  } catch (error) {
    next(error);
  }
};

// get all attachment
export const getAllAttachments = async (req, res, next) => {
  try {
    const attachments = await prisma.attachment.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(attachments);
  } catch (error) {
    return next(new AppError("Failed to get attachments", 500));
  }
};

// get attachment by id
export const getAttachmentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const attachment = await prisma.attachment.findUnique({ where: { id } });
    if (!attachment) return next(new AppError("Attachment not found", 404));
    res.status(200).json(attachment);
  } catch (error) {
    return next(new AppError("Failed to get attachment", 500));
  }
};

// update attachment
export const updateAttachment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, lessonId, attachment } = req.body;

    const existingAttachment = await prisma.attachment.findUnique({
      where: { id },
    });
    if (!existingAttachment)
      return next(new AppError("Attachment not found", 404));

    const updatedAttachment = await prisma.attachment.update({
      where: { id },
      data: {
        name: name || existingAttachment.name,
        lessonId: lessonId || existingAttachment.lessonId,
        url: attachment || existingAttachment.url,
      },
    });

    res.status(200).json(updatedAttachment);
  } catch (error) {
    next(error);
  }
};

// soft delete attachment
export const deleteAttachment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const attachment = await prisma.attachment.findUnique({ where: { id } });
    if (!attachment) return next(new AppError("Attachment not found", 404));

    // Update only if deletedAt is null
    if (!attachment.deletedAt) {
      await prisma.attachment.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      return res.status(200).json({ message: "Attachment soft deleted" });
    }

    return next(new AppError("Attachment is already deleted", 400));
  } catch (error) {
    return next(new AppError("Failed to delete attachment", 500));
  }
};
