// controllers/faqController.js
import { AppError } from "../middleware/errorHandler.js";
import { prisma } from "../models/index.js";
import { faqService } from "../services/faqService.js";

export const createFaqGroup = async (req, res, next) => {
  try {
    const { role, category, faqs } = req.body;

    if (!role || !category || !Array.isArray(faqs) || faqs.length === 0) {
      return next(new AppError("Role, category, and at least one FAQ are required", 400));
    }

    const newGroup = await faqService.createFaqGroup({ role, category, faqs });

    return res.status(201).json({
      msg: "FAQ group created successfully",
      data: newGroup,
    });
  } catch (error) {
    next(error);
  }
};

export const getFaqGroups = async (req, res, next) => {
  try {
    const faqGroups = await prisma.faqGroup.findMany({
      select: {
        id: true,
        category: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // ✅ Do NOT include the `faqs` relation here
      },
    });

    return res.status(200).json(faqGroups);
  } catch (error) {
    next(error);
  }
};

// get faq group by id
export const getFaqGroupByCategoryId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const group = await faqService.getFaqsByCategoryId(id);
    return res.status(200).json({
      msg: "FAQ group fetched successfully",
      data: group,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllFaqGroups = async (req, res, next) => {
  try {
    const groups = await faqService.getAllFaqGroups();

    return res.status(200).json({
      msg: "All FAQ groups fetched successfully",
      data: groups,
    });
  } catch (error) {
    next(error);
  }
};

// get faq group by role
export const getFaqByRole = async (req, res, next) => {
  try {
    const { role } = req.params;
    const groups = await faqService.getFaqByRoleService(role);

    return res.status(200).json({
      msg: "FAQ groups fetched successfully",
      data: groups,
    });
  } catch (error) {
    next(error);
  }
};

export const updateFaqGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role, category } = req.body;

    const group = await faqService.getFaqGroupById(id);
    if (!group) {
      return next(new AppError("FAQ group not found", 404));
    }

    const updated = await faqService.updateFaqGroup(id, { role, category });

    return res.status(200).json({
      msg: "FAQ group updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFaqGroup = async (req, res, next) => {
  try {
    const { id } = req.params;

    const faq = await prisma.faq.findUnique({
      where: { id },
    });

    if (!faq) {
      return next(new AppError("FAQ not found", 404));
    }

    await prisma.faq.update({
      where: { id },
      data: {
        deletedAt: new Date(), // soft delete
      },
    });

    return res.status(200).json({
      message: "FAQ deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};


