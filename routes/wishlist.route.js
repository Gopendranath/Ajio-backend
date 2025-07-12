import express from "express";
import { addToWishlist, removeFromWishlist, getWishlist } from "../controllers/wishlist.controller.js";
import { verifyToken } from "../middlewares/verify.js";

const router = express.Router();

// Add product to wishlist
router.post("/add", verifyToken, addToWishlist);

// Remove product from wishlist
router.post("/remove", verifyToken, removeFromWishlist);

// Get user's wishlist
router.get("/get", verifyToken, getWishlist);

export default router; 