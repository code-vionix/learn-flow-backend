import express from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUserProfile,
  getUsers,
  loginUser,
  oauthLoginUser,
  regenerateAccessToken,
  registerUser,
  updateUser,
  updateUserProfile,
} from "../controllers/userController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser); //api/v1/users/register
router.post("/login", loginUser); //api/v1/users/login
router.post("/oauth-login", oauthLoginUser); // api/v1/users/oauth-login

// Protected routes
router.use(protect);

// Token rotation route
router.post("/access-token", regenerateAccessToken); //api/v1/users/access-token

// User profile
router.get("/profile", getUserProfile); //api/v1/users/profile
router.put("/profile", updateUserProfile);
router.route("/change-password").put(updateUser); //api/v1/users/:id

// Admin only routes
router.use(restrictTo("ADMIN"));
router.route("/").get(getUsers).post(createUser); //api/v1/users
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser); //api/v1/users/:id

export default router;
