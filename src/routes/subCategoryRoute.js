import express from "express"
import { createSubCategories, deleteSubCategory, getAllSubCategories, getSingleSubCategory, updateSubCategories } from "../controllers/subCategoryController.js";

const subCategoryRouter = express.Router();

subCategoryRouter.get("/", getAllSubCategories) 
subCategoryRouter.get("/:id", getSingleSubCategory) 

subCategoryRouter.post("/", createSubCategories) 
subCategoryRouter.patch("/:id", updateSubCategories) 
subCategoryRouter.delete("/:id", deleteSubCategory) 


export default subCategoryRouter

