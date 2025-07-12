import express from "express";
import { getALLinfo, getAllUsers, getAllProducts, deleteUser, deleteProduct, adminLogin, addProduct, getProductById, updateProduct, getSingleUser, updateUser } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/dashboard", getALLinfo);
router.get("/getusers", getAllUsers);
router.get("/getproducts", getAllProducts);
router.delete("/deleteuser/:id", deleteUser);
router.delete("/deleteproduct/:id", deleteProduct);
router.post("/login", adminLogin);
router.get("/products/add", (req, res) => {
    res.render('add-product');
});
router.post("/products/add", addProduct);
router.get("/products/edit/:id", getProductById);
router.put("/products/edit/:id", updateProduct);
router.get("/products", getAllProducts);
router.delete("/products/delete/:id", deleteProduct);
router.get("/products/delete/:id", deleteProduct);
router.get("/users", getAllUsers);
router.get("/users/edit/:id", getSingleUser);
router.put("/users/edit/:id", updateUser);
router.delete("/users/delete/:id", deleteUser);

export default router;