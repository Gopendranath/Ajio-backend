import express from "express";
import { importFakestoreProducts, addDummyProducts } from "../controllers/fakestore.controller.js";

const router = express.Router();

router.get("/import-fakestore", importFakestoreProducts);
router.get("/add-dummy-products", addDummyProducts);

export default router; 