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
router.post("/register", registerUser)
router.post("/login", loginUser)

// Protected routes
router.use(protect)

// User profile
router.get("/profile", getUserProfile)

// Admin only routes
router.use(restrictTo("admin"))
router.route("/").get(getUsers).post(createUser)

router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser)

export default router

