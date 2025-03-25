import { categoryService } from "../services/categoryService.js"
import { subCategoryService } from "../services/subCategoryService.js"

// get all sub categories
export const getAllSubCategories = async (req, res, next) => {
  try {
    const subCategories = await subCategoryService.getAllCategories()
    res.status(200).json(subCategories)
  } catch (error) {
    next(error)
  }
}

// get single sub category
export const getSingleSubCategory = async (req, res, next) => {
  console.log("checkling sub category id", req.params.id);
  try {
    const subCategory = await subCategoryService.getSingleSubCategories(req.params.id)
    res.status(200).json(subCategory)
  } catch (error) {
    next(error)
  }
}


// POST create subcategory
export const createSubCategories = async (req, res, next) => {
  try {
    const { name, categoryId } = req.body; 

    const subCategoryInfo = await subCategoryService.createSubCategory({
      name,
      categoryId,
    });

    res.status(201).json(subCategoryInfo);
  } catch (error) {
    next(error);
  }
};



// update category
  export const updateSubCategories = async (req, res, next) => {
    try {
      const category = await subCategoryService.updateSubCategory(req.params.id, req.body)
      res.status(200).json(category)
    } catch (error) {
      next(error)
    }
}
  
//delete category
export const deleteSubCategory = async (req, res, next) => {
  try {
    const category = await subCategoryService.deleteCategory(req.params.id)
    res.status(200).json(category)
  } catch (error) {
    next(error)
  }
}