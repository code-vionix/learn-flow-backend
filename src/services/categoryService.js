import bcrypt from "bcryptjs"
import { prisma } from "../models/index.js"
import { AppError } from "../middleware/errorHandler.js"
import { createCategory } from "../controllers/categoryController.js"

export const categoryService = {
//   getAllUsers: async () => {
//     return await prisma.user.findMany({
//       select: {
//         id: true,
//         firstName: true,
//         lastName: true,
//         email: true,
//         role: true,
//         createdAt: true,
//       },
//     })
//   },

  // Create a new user
  createCategory: async (categoryData) => {
    const { course, category, subCategory } = categoryData
 
    const categories = await prisma.courseCategory.create({
      data: {
        course,
        category,
        subCategory
      },
      select: {
        course: true,
        category: true,
        subCategory: true
      },
    })

    return categories
  },


}

