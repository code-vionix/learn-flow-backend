import { quizService } from "../services/quizService.js";


export const getAllQuizzes = async (req, res, next) => {
  try {
    const quizzes = await quizService.getAllQuizzes();
    res.status(200).json(quizzes);
  } catch (error) {
    next(error);
  }
};


export const getSingleQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    const quiz = await quizService.getSingleQuiz(id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.status(200).json(quiz);
  } catch (error) {
    next(error);
  }
};


export const createQuiz = async (req, res, next) => {
  try {
    const {
      title,
      description,
      courseId,
      lessionId,
      shuffleOptions,
      timeLimit,
      passingScore,
    } = req.body;

    const quiz = await quizService.createQuiz({
      title,
      description,
      courseId,
      lessionId,
      shuffleOptions,
      timeLimit,
      passingScore,
    });

    res.status(201).json(quiz);
  } catch (error) {
    next(error);
  }
};


export const updateQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    const quizData = req.body;
    const quiz = await quizService.updateQuiz(id, quizData);
    res.status(200).json(quiz);
  } catch (error) {
    next(error);
  }
};


export const deleteQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    const quiz = await quizService.deleteQuiz(id);
    res.status(200).json({
      status: 200,
      message: "Quiz deleted successfully",
      data: quiz,
    });
  } catch (error) {
    next(error);
  }
};
