// src/services/lessonService.ts
import prisma from "../prisma/client";
import { Prisma, LessonType } from "@prisma/client";
import fileStorageService from "./fileStorageService"; // Import file service

const lessonService = {
  async createLesson(moduleId, data) {
    // Find the max order for this module's lessons to set the new one
    const lastLesson = await prisma.lesson.findFirst({
      where: { moduleId: moduleId },
      orderBy: { order: "desc" },
      select: { order: true },
    });
    const nextOrder = (lastLesson?.order || 0) + 1;

    return prisma.lesson.create({
      data: {
        ...data,
        module: { connect: { id: moduleId } },
        order: nextOrder, // Set the order
      },
    });
  },

  async updateLesson(lessonId, data) {
    // TODO: Implement logic for reordering if 'order' is updated.
    // This might involve transactions to update other lessons' orders within the module.
    return prisma.lesson.update({
      where: { id: lessonId },
      data: data,
    });
  },

  async deleteLesson(lessonId) {
    // Fetch lesson to get file URLs before deleting the record
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        videoUrl: true,
        attachments: { select: { url: true } },
      },
    });

    if (!lesson) {
      throw new Error("Lesson not found");
    }

    // Delete associated files asynchronously (don't await, let it happen in background)
    if (lesson.videoUrl) {
      fileStorageService.deleteFile(lesson.videoUrl).catch(console.error); // Log error if deletion fails
    }
    for (const attachment of lesson.attachments) {
      fileStorageService.deleteFile(attachment.url).catch(console.error);
    }

    // Delete the lesson record and potentially cascade delete relations like Note, Comment etc.
    // Ensure cascade delete is configured in your schema for related models if desired,
    // otherwise delete them manually here before deleting the lesson.
    await prisma.note.deleteMany({ where: { lessonId: lessonId } });
    await prisma.comment.deleteMany({ where: { lessonId: lessonId } });
    await prisma.lessonProgress.deleteMany({ where: { lessonId: lessonId } });
    await prisma.quiz.deleteMany({ where: { lessonId: lessonId } });

    return prisma.lesson.delete({
      where: { id: lessonId },
    });
  },

  async updateLessonCaption(lessonId, caption) {
    return prisma.lesson.update({
      where: { id: lessonId },
      data: { caption: caption },
    });
  },

  async updateLessonContent(lessonId, content) {
    return prisma.lesson.update({
      where: { id: lessonId },
      data: { content: content },
    });
  },

  async updateLessonVideoUrl(lessonId, videoUrl) {
    // Before setting the new URL, find the old one to delete the old file
    const oldLesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { videoUrl: true },
    });

    const updatedLesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: { videoUrl: videoUrl },
    });

    // If there was an old video and a new one is provided (or old is being removed)
    // delete the old file asynchronously
    if (oldLesson?.videoUrl && oldLesson.videoUrl !== videoUrl) {
      fileStorageService.deleteFile(oldLesson.videoUrl).catch(console.error);
    }

    return updatedLesson;
  },

  // Note: Attachment handling is in attachmentService
  // Note handling (if it's an instructor note) is in noteService
};

export default lessonService;
