import express from "express"
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  registerUser,
  getUserProfile,
} from "../controllers/userController.js"
import { protect, restrictTo } from "../middleware/auth.js"

const router = express.Router()

// Public routes
router.post("/register", registerUser) //api/v1/users/register
router.post("/login", loginUser) //api/v1/users/login

// Protected routes
router.use(protect)

// User profile
router.get("/profile", getUserProfile) //api/v1/users/profile

// Admin only routes
router.use(restrictTo("admin"))

router.route("/").get(getUsers).post(createUser) //api/v1/users

router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser) //api/v1/users/:id

export default router

