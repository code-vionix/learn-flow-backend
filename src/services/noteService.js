// src/services/noteService.ts
import prisma from "../prisma/client";

const noteService = {
  // This service assumes we're managing a single 'instructor note' per lesson
  // You might need a userId passed in here to distinguish between instructor notes and student notes
  async upsertLessonNote(lessonId, userId, content) {
    // Find an existing note by lesson and user (assuming instructor user ID)
    const existingNote = await prisma.note.findFirst({
      where: {
        lessonId,
        userId, // Filter by user ID (e.g., the course instructor)
      },
    });

    if (content === null || content.trim() === "") {
      // If content is null/empty, delete the note if it exists
      if (existingNote) {
        return prisma.note.delete({ where: { id: existingNote.id } });
      }
      return null; // Nothing to delete
    } else {
      // If content exists, create or update the note
      if (existingNote) {
        return prisma.note.update({
          where: { id: existingNote.id },
          data: { content: content },
        });
      } else {
        // Create a new note
        return prisma.note.create({
          data: {
            title: `Note for Lesson ${lessonId}`, // Or generate a title
            content: content,
            lesson: { connect: { id: lessonId } },
            User: { connect: { id: userId } }, // Link to the instructor user
          },
        });
      }
    }
  },
  // Add other note specific operations if needed (e.g., getting all notes for a lesson)
};

export default noteService;
