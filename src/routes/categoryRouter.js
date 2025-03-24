import express from "express"
 
import { protect, restrictTo } from "../middleware/auth.js"
import { createCategory, getAllCategories } from "../controllers/categoryController.js"
import { updateCategoryService } from "../services/categoryService.js";

const categoryRouter = express.Router();

// Public routes
categoryRouter.get("/", getAllCategories)
categoryRouter.post("/create-category", createCategory) //api/v1/users/register
// update category
categoryRouter.patch("/:id", async (req, res) => {
  try {
    const category = await updateCategoryService.updateCategory(req.params.id, req.body)
    res.status(200).json(category)
  } catch (error) {
    next(error)
  }
})


export default categoryRouter

