// src/services/moduleService.ts
import prisma from '../prisma/client';
import { Prisma } from '@prisma/client';

const moduleService = {
  async createModule(courseId: string, data: Prisma.ModuleCreateInput) {
    // Find the max order for this course's modules to set the new one
    const lastModule = await prisma.module.findFirst({
        where: { courseId: courseId },
        orderBy: { order: 'desc' },
        select: { order: true }
    });
    const nextOrder = (lastModule?.order || 0) + 1;

    return prisma.module.create({
      data: {
        ...data,
        course: { connect: { id: courseId } },
        order: nextOrder // Set the order
      },
    });
  },

  async updateModule(moduleId, data) {
      // TODO: Implement logic for reordering if 'order' is updated.
      // This might involve transactions to update other modules' orders.
    return prisma.module.update({
      where: { id: moduleId },
      data: data,
    });
  },

  async deleteModule(moduleId) {
    // Prisma supports cascade deletes based on your schema relation settings
    // If onDelete is set to Cascade for lessons in the Module model,
    // deleting the module will delete its lessons.
    // You might still need to manually delete associated files (videos, attachments).

    // Example: Manually delete related files before deleting the module/lessons
    const lessonsInModule = await prisma.lesson.findMany({
        where: { moduleId: moduleId },
        select: {
            id: true,
            videoUrl: true,
            attachments: { select: { id: true, url: true } }
        }
    });

    for (const lesson of lessonsInModule) {
        if (lesson.videoUrl) {
            await fileStorageService.deleteFile(lesson.videoUrl);
        }
        for (const attachment of lesson.attachments) {
            await fileStorageService.deleteFile(attachment.url);
        }
         // Assuming Notes also need deletion if not cascaded
         await prisma.note.deleteMany({ where: { lessonId: lesson.id } });
         await prisma.comment.deleteMany({ where: { lessonId: lesson.id } });
         // Add other relations like Quiz, lessonProgress etc.
    }

    // Then delete the module (this should cascade delete lessons if schema is set up)
    return prisma.module.delete({
      where: { id: moduleId },
    });
  },
};

export default moduleService;