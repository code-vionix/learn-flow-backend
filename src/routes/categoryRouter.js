import express from "express"
 
import { protect, restrictTo } from "../middleware/auth.js"
import { createCategory } from "../controllers/categoryController.js"

const categoryRouter = express.Router()

// Public routes
categoryRouter.post("/create-category", createCategory) //api/v1/users/register


export default categoryRouter

