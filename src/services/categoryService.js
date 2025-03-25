import bcrypt from "bcryptjs"
import { prisma } from "../models/index.js"
import { AppError } from "../middleware/errorHandler.js"

export const categoryService = {
  getAllCategories: async () => {
    return await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,

        SubCategory: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true
          },
        },
      },
    })
  },

  //get single category with id
  getSingleCategories: async (id) => {
    const categoriesData = await prisma.category.findMany({
      where: { id },
      include: {
        SubCategory: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true
          }, 
        },
      }
    })
  
    return categoriesData
  },


   createCategory: async (categoryData) => {
    const { name } = categoryData
 
    const categories = await prisma.category.create({
      data: {
       name
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    })

    return categories
  },
   
  updateCategory: async (categoryId, categoryData) => {
    const { name } = categoryData

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    })

    return category
  },

  deleteCategory: async (categoryId) => {
     await prisma.category.update({
      where: { id: categoryId },
      data: {
        deletedAt: new Date(),
      },
    })

    return ({
      status: "success",
      message: `Category with id ${categoryId} deleted successfully`,
    })
  }
}