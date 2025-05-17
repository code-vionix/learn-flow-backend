// controllers/faqSubmissionController.js
import { AppError } from "../middleware/errorHandler.js";
import { prisma } from "../models/index.js";

export const submitQuestion = async (req, res, next) => {
    try {
      const { subject, question } = req.body;
  
      if (!subject || !question) {
        return next(new AppError("Subject and question are required", 400));
      }
  
      const newSubmission = await prisma.faqSubmission.create({
        data: { subject, question },
      });
  
      return res.status(201).json({
        msg: "Question submitted successfully, pending admin review",
        data: newSubmission,
      });
    } catch (error) {
      next(error);
    }
};
  
export const getAllSubmissions = async (req, res, next) => {
    try {
        const submissions = await prisma.faqSubmission.findMany({
        orderBy: { createdAt: "desc" }
      });
  
      return res.status(200).json({ data: submissions });
    } catch (error) {
      next(error);
    }
  };
  
export const approveAndAnswerQuestion = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { faqGroupId, answer, isApproved } = req.body;
  
      if (isApproved && (!faqGroupId || !answer)) {
        return next(new AppError("FAQ Group ID and answer are required when approving", 400));
      }
  
      const submission = await prisma.faqSubmission.findUnique({
        where: { id },
      });
  
      if (!submission) {
        return next(new AppError("Submission not found", 404));
      }
  
      let createdFaq = null;
  
      // ✅ Only add to faq table if isApproved is true
      if (isApproved === true) {
        createdFaq = await prisma.faq.create({
          data: {
            question: submission.question,
            answer,
            faqGroupId,
          },
        });
      }
  
      // ✅ Update the submission's approval status
      await prisma.faqSubmission.update({
        where: { id },
        data: {
          isApproved: Boolean(isApproved),
          updatedAt: new Date(),
        },
      });
  
      return res.status(200).json({
        msg: isApproved
          ? "FAQ approved and added to the FAQ group."
          : "FAQ submission updated without approval.",
        data: isApproved ? createdFaq : null,
      });
    } catch (error) {
      next(error);
    }
  };
  
  
  export const deleteSubmission = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      const deletedSubmission = await prisma.faqSubmission.delete({
        where: { id },
      });
  
      return res.status(200).json({
        msg: "Submission deleted successfully",
        data: deletedSubmission,
      });
    } catch (error) {
      next(error);
    }
  };