import { questionService } from "../services/questionService.js";

export const getAllQuestions = async (req, res, next) => {
  try {
    const questions = await questionService.getAllQuestions();
    res.status(200).json(questions);
  } catch (error) {
    next(error);
  }
};


export const getSingleQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const question = await questionService.getSingleQuestion(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json(question);
  } catch (error) {
    next(error);
  }
};


export const createQuestion = async (req, res, next) => {
  try {
    const questionData = req.body;
    const question = await questionService.createQuestion(questionData);
    res.status(201).json(question);
  } catch (error) {
    next(error);
  }
};

export const updateQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const questionData = req.body;
    const question = await questionService.updateQuestion(id, questionData);
    res.status(200).json(question);
  } catch (error) {
    next(error);
  }
};


export const deleteQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    await questionService.deleteQuestion(id);
    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    next(error);
  }
};
