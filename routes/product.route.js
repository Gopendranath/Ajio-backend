import express from "express";
import { getProducts, getProductbyId } from "../controllers/product.controller.js";

const router = express.Router();

router.get("/products", getProducts);
router.get("/products/:id", getProductbyId);



export default router;