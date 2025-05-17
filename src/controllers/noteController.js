// src/controllers/noteController.ts
import { Request, Response } from "express";
import noteService from "../services/noteService";
// import mockAuth from '../middleware/authMiddleware'; // Assuming auth middleware provides user

const noteController = {
  // Assuming this updates the primary instructor note for a lesson
  async updateLessonNote(req, res) {
    try {
      const lessonId = req.params.lessonId;
      const { content } = req.body; // Note content can be string or null

      // In a real app, get the user ID from auth middleware
      // const userId = (req as any).user.id;
      const userId = "dummy_instructor_user_id"; // Mock instructor ID

      if (content === undefined) {
        // Explicitly check for undefined to allow null
        return res
          .status(400)
          .json({ message: "Note content field is required" });
      }

      const updatedNote = await noteService.upsertLessonNote(
        lessonId,
        userId,
        content
      );

      // upsertLessonNote might return the note, or null if deleted
      res.json(updatedNote || { content: null }); // Return the note or confirmation of removal
    } catch (error) {
      console.error("Error updating lesson note:", error);
      res
        .status(500)
        .json({
          message: "Failed to update lesson note",
          error: error.message,
        });
    }
  },
};

export default noteController;
