import { te } from "date-fns/locale";
import { AppError } from "../middleware/errorHandler.js";
import { prisma } from "../models/index.js";

export const createTestimonial = async (req, res, next) => {
  try {
    const { name, employer, company, message } = req.body;

    // Validation
    if (!name || !employer || !company || !message) {
      return next(new AppError("All fields are required", 400));
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        employer,
        company,
        message,
      },
    });

    res.status(201).json({
      msg: "Testimonial created successfully",
      data: testimonial,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllTestimonial = async (req, res, next) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: {
        createdAt: 'desc', // optional: order by latest first
      },
    });

    return res.status(200).json({
      msg: "All Testimonials fetched successfully",
      data: testimonials,
    });
  } catch (error) {
    next(error);
  }
};


export const getTestimonialById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const testimonial = await prisma.testimonial.findUnique({
      where: { id }
    });

    if (!testimonial) {
      return next(new AppError("Testimonial not found", 404));
    }
  

    return res.status(200).json({
      msg: "Testimonial found",
      data: testimonial,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, employer, company, message } = req.body;

    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!existingTestimonial) {
      return next(new AppError("Testimonial not found", 404));
    }

    const updatedTestimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        name,
        employer,
        company,
        message,
      },
    });

    return res.status(200).json({
      msg: "Testimonial updated successfully",
      data: updatedTestimonial,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id },
    });

    if (!existingTestimonial) {
      return next(new AppError("Testimonial not found", 404));
    }

    const deletedTestimonial = await prisma.testimonial.delete({
      where: { id },
    });

    return res.status(200).json({
      msg: "Testimonial deleted successfully",
      data: deletedTestimonial,
    });
  } catch (error) {
    next(error);
  }
};
