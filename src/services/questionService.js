import { prisma } from "../models/index.js"
export const questionService = {
  
  getAllQuestions: async () => {
    return await prisma.quiz.findMany({
      include: {
        questions: {
          select: {
            id: true,
            questionText: true,
            options: true,
            correctAnswer: true,
            questionType: true,
            partialCredit: true,
            feedback: true,
          },
        },
      },
    });
  },

  getSingleQuestion: async (id) => {
    return await prisma.question.findUnique({
      where: { id },
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
          },
        },
        
      },
    });
  },

  createQuestion: async (questionData) => {
    const { quizId, questionText, options, correctAnswer, questionType, partialCredit, feedback } = questionData;
    return await prisma.question.create({
      data: {
        quizId,
        questionText,
        options,
        correctAnswer,
        questionType,
        partialCredit,
        feedback,
      },
      include: {
        quiz: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  },

  updateQuestion: async (id, questionData) => {
    return await prisma.question.update({
      where: { id },
      data: questionData,
    });
  },

  deleteQuestion: async (id) => {
    return await prisma.question.delete({
      where: { id },
    });
  },
};
