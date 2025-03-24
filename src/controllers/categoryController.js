import { categoryService, getCategoryService, updateCategoryService } from "../services/categoryService.js"


// GET all categories
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await getCategoryService.getAllCategories()
    res.status(200).json(categories)
  } catch (error) {
    next(error)
  }
}

export const createCategory = async (req, res, next) => {
  try {
      const { 
          name
     } = req?.body

    const categoryInfo = await categoryService.createCategory({
      name
    })

    res.status(201).json(categoryInfo)
  } catch (error) {
    next(error)
  }
}


// update category
  export const updateCategory = async (req, res, next) => {
    try {
      const category = await updateCategoryService.updateCategory(req.params.id, req.body)
      res.status(200).json(category)
    } catch (error) {
      next(error)
    }
  }