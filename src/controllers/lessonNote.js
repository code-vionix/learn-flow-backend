import { AppError } from "../middleware/errorHandler.js";
import { prisma } from "../models/index.js";

// create notes
export const createNote = async (req, res, next) => {
  const { title, content, lessonId } = req.body;
  switch (title) {
    case undefined:
      return next(new AppError("Title is required", 400));
      break;

    case "":
      return next(new AppError("Title is required", 400));
      break;

    default:
      break;
  }
  switch (content) {
    case undefined:
      return next(new AppError("Content is required", 400));
      break;

    case "":
      return next(new AppError("Content is required", 400));
      break;

    default:
      break;
  }
  switch (lessonId) {
    case undefined:
      return next(new AppError("Lesson ID is required", 400));
      break;

    case "":
      return next(new AppError("Lesson ID is required", 400));
      break;

    default:
      break;
  }
  try {
    const note = await prisma.note.create({
      data: { title, content, lessonId, deletedAt: null },
    });
    res.status(201).json(note);
  } catch (error) {
    return next(new AppError("Failed to create note", 500));
  }
};

// get all note
export const getAllNote = async (req, res, next) => {
  try {
    const notes = await prisma.note.findMany({
      orderBy: { createdAt: "desc" },
      where: { deletedAt: null },
    });
    res.status(200).json(notes);
  } catch (error) {
    return next(new AppError("Failed to get notes", 500));
  }
};

// get note by id
export const getNoteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const note = await prisma.note.findUnique({
      where: { id },
    });
    res.status(200).json(note);
  } catch (error) {
    return next(new AppError("Failed to get note", 500));
  }
};

// update note
export const updateNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const note = await prisma.note.update({
      where: { id },
      data: req.body,
    });
    res.status(200).json(note);
  } catch (error) {
    return next(new AppError("Failed to update note", 500));
  }
};

// delete note
export const deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params;

    const note = await prisma.note.findUnique({ where: { id } });

    if (!note) return next(new AppError("Lesson note not found", 404));

    // Update only if deletedAt is null
    if (!note.deletedAt) {
      await prisma.note.update({
        where: { id },
        data: { deletedAt: new Date() }, // Soft delete
      });

      return res.status(200).json({ message: "Lesson note soft deleted" });
    }

    return next(new AppError("Lesson note is already deleted", 400));
  } catch (error) {
    return next(new AppError("Failed to delete note", 500));
  }
};
