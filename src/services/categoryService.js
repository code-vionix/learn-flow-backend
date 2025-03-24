import bcrypt from "bcryptjs"
import { prisma } from "../models/index.js"
import { AppError } from "../middleware/errorHandler.js"
import { createCategory, getAllCategories } from "../controllers/categoryController.js"

export const getCategoryService = {
  getAllCategories: async () => {
    return await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
    })
  },
}

export const categoryService = {
  createCategory: async (categoryData) => {
    const { name } = categoryData
 
    const categories = await prisma.category.create({
      data: {
       name
      },
      select: {
       name : true,
      },
    })

    return categories
  },
}


//update category
export const updateCategoryService = {
  updateCategory: async (categoryId, categoryData) => {
    const { name } = categoryData

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name,
      },
    })

    return category
  },
}
