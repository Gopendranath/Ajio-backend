import express from "express";
import { createOrder } from "../controllers/order.controller.js";
import { verifyToken } from "../middlewares/verify.js";

const router = express.Router();


router.post("/createorder", verifyToken, createOrder);


export default router;