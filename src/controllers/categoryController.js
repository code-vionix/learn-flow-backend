import { categoryService } from "../services/categoryService.js"


// GET all categories
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategories()
    res.status(200).json(categories)
  } catch (error) {
    next(error)
  }
}

// get single category
export const getSingleCategory = async (req, res, next) => {
  try {
    const category = await categoryService.getSingleCategories(req.params.id)
    res.status(200).json(category)
  } catch (error) {
    next(error)
  }
}

// POST create category
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
      const category = await categoryService.updateCategory(req.params.id, req.body)
      res.status(200).json(category)
    } catch (error) {
      next(error)
    }
}
  
//delete category
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await categoryService.deleteCategory(req.params.id)
    res.status(200).json(category);

    return `Category with id ${req.params.id} deleted successfully`
  } catch (error) {
    next(error)
  }
}