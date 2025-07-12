import Product from "../models/product.model.js";

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ products });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: error.message });
    }
    
}

export const getProductbyId = async (req, res) => {
    try {
        const product = await Product.findOne({ id: req.params.id });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ product });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: error.message });
    }
    
}

