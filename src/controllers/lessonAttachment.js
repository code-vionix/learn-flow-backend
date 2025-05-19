import cloudinary from "../lib/uploadToCloudinary.js";
import { AppError } from "../middleware/errorHandler.js";
import { prisma } from "../models/index.js";

// Create attachment
export const createAttachment = async (req, res, next) => {
  try {
    const { name, lessonId } = req.body;
    const userId = req.user?.id || "67debbfbd62e2129820291dc"; // fallback for testing
    const file = req.file;

    if (!userId) return next(new AppError("Unauthorized request", 401));
    if (!name || !lessonId) {
      return next(new AppError("Name and lessonId are required", 400));
    }

    if (!file) {
      return next(new AppError("No file uploaded", 400));
    }

    // Determine Cloudinary resource type
    let resourceType = "auto"; // automatically detect type
    const supportedVideo = ["video/mp4", "video/quicktime", "video/x-matroska"];
    const supportedImage = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (supportedVideo.includes(file.mimetype)) {
      resourceType = "video";
    } else if (supportedImage.includes(file.mimetype)) {
      resourceType = "image";
    } else {
      resourceType = "raw"; // for PDFs, DOCX, ZIPs, etc.
    }

    // Upload to Cloudinary
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(file.path, {
        resource_type: resourceType,
        folder: "lesson_attachments",
        use_filename: true,
        unique_filename: true,
      });
    } catch (uploadErr) {
      console.error("Cloudinary Upload Error:", uploadErr);
      return next(new AppError("Failed to upload file", 500));
    }

    // Save to DB
    const newAttachment = await prisma.attachment.create({
      data: {
        name,
        url: uploadedFile.secure_url,
            lessonId,
        deletedAt: null
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
}

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
}

// update attachment
export const updateAttachment = async (req, res, next) => {
    try {
      const { id } = req.params;
      const file = req.file;
      const { name, lessonId } = req.body;
  
      const existingAttachment = await prisma.attachment.findUnique({ where: { id } });
      if (!existingAttachment) return next(new AppError("Attachment not found", 404));
  
      let updatedUrl = existingAttachment.url;
  
      if (file) {
        try {
          const uploadResponse = await cloudinary.uploader.upload(file.path, {
            resource_type: "auto", // যেকোনো ফাইল টাইপের জন্য
            folder: "course_lessons",
          });
          updatedUrl = uploadResponse.secure_url;
        } catch (uploadError) {
          console.error("Cloudinary upload error:", uploadError);
          return next(new AppError("Failed to upload file", 500));
        }
      }
  
      const updatedAttachment = await prisma.attachment.update({
        where: { id },
        data: {
          name: name || existingAttachment.name,
          lessonId: lessonId || existingAttachment.lessonId,
          url: updatedUrl,
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
}