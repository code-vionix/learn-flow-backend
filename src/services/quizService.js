import { prisma } from "../models/index.js";

export const quizService = {

  getAllQuizzes: async () => {
    return await prisma.quiz.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        timeLimit: true,
        passingScore: true,
        shuffleOptions: true,
        createdAt: true,
        updatedAt: true,
        // course: {
        //   select: {
        //     id: true,
        //     title: true,
        //     category: true,
        //     description: true,
        //     createdAt: true,
        //     updatedAt: true,
        //   },
        // },
        lesson: {
          select: {
            id: true,
            title: true,
          },
        },
        questions: true,
        grades: true,
      },
    });
  },

  getSingleQuiz: async (id) => {
    return await prisma.quiz.findUnique({
      where: { id },
      include: {
        // course: {
        //   select: {
        //     id: true,
        //     title: true,
        //     category: true,
        //     description: true,
        //     createdAt: true,
        //     updatedAt: true,
        //   },
        // },
        lesson: {
          select: {
            id: true,
            title: true,
          },
        },
        questions: true,
        grades: true,
      },
    });
  },

  createQuiz: async (quizData) => {
    const {
      title,
      description,
      courseId,
      lessionId,
      shuffleOptions,
      timeLimit,
      passingScore,
    } = quizData;

    return await prisma.quiz.create({
      data: {
        title,
        description,
        courseId,
        lessionId,
        shuffleOptions,
        timeLimit,
        passingScore,
      },
      select: {
        id: true,
        title: true,
        description: true,
        courseId: true,
        lessionId: true,
        shuffleOptions: true,
        timeLimit: true,
        passingScore: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  updateQuiz: async (id, quizData) => {
    const {
      title,
      description,
      courseId,
      lessionId,
      shuffleOptions,
      timeLimit,
      passingScore,
    } = quizData;

    return await prisma.quiz.update({
      where: { id },
      data: {
        title,
        description,
        courseId,
        lessionId,
        shuffleOptions,
        timeLimit,
        passingScore,
      },
      select: {
        id: true,
        title: true,
        description: true,
        courseId: true,
        lessionId: true,
        shuffleOptions: true,
        timeLimit: true,
        passingScore: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  },

  deleteQuiz: async (id) => {
    // Assuming you're using a soft delete pattern, though `Quiz` model doesn't currently have `deletedAt`
    // You might want to add `deletedAt: DateTime?` in the model if needed.
    return await prisma.quiz.delete({
      where: { id },
    });
  },
};
