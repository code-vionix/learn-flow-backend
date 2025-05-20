import express from "express";
import {
  createWishlist,
  getWishlist,
} from "../controllers/wishlistController.js";
import { protect } from "../middleware/auth.js";

const wishlistrouter = express.Router();

wishlistrouter.post("/wishlist", protect, createWishlist);
wishlistrouter.get("/wishlist", protect, getWishlist);

export default wishlistrouter;
