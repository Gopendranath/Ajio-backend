import express from "express";
import { addToCart, removeFromCart, updateCart, clearCart, getCart, syncCart } from "../controllers/cart.controller.js";
import { verifyToken } from "../middlewares/verify.js";

const router = express.Router();

router.post("/add", verifyToken, addToCart);
router.delete("/remove", verifyToken, removeFromCart);
router.put("/update", verifyToken, updateCart);
router.delete("/clear", verifyToken, clearCart);
router.get("/get", verifyToken, getCart);
router.post("/sync", verifyToken, syncCart);


export default router;