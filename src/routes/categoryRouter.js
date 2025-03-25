import express from "express"
import { createCategory, deleteCategory, getAllCategories, getSingleCategory, updateCategory } from "../controllers/categoryController.js"

const categoryRouter = express.Router();

categoryRouter.get("/", getAllCategories)
categoryRouter.get("/:id", getSingleCategory)

categoryRouter.post("/", createCategory) 

categoryRouter.patch("/:id", updateCategory) 

categoryRouter.delete("/:id", deleteCategory);
 


export default categoryRouter

