import { prisma } from "../models/index.js"

export const subCategoryService = {
  getAllCategories: async () => {
    return await prisma.subCategory.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        category: {
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


  getSingleSubCategories: async (id) => {
    const subCategories = await prisma.subCategory.findMany({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true
          }
        }
      }
    })
  
    
        return subCategories
  },
  

  createSubCategory: async (subCategoryData) => {
    const { name, categoryId } = subCategoryData;

    const subCategory = await prisma.subCategory.create({
      data: {
        name,
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true
          },
        },
      },
    });

    return subCategory;
},



   
  updateSubCategory: async (id, subCategoryData) => {
    const { name, categoryId,category } = subCategoryData;

    const categories = await prisma.subCategory.update({
      where: { id },
      data: {
        name,
        categoryId,
        category
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        category: {
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

    return categories
  },

  deleteCategory: async (subCategoryId) => {
     await prisma.subCategory.update({
      where: { id: subCategoryId },
      data: {
        deletedAt: new Date(),
      },
    })

    return ({
      status: "success",
      data: {
        id: subCategoryId,
        deletedAt: new Date(),
        message: `SubCategory with id ${subCategoryId} deleted successfully`,
      },
    })
  }
}