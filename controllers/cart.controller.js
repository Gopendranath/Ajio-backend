import User from "../models/user.model.js";
import Product from "../models/product.model.js";

export const addToCart = async (req, res) => {
    try {
        const { productId, count } = req.body;
        if(!productId || !count){
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const existingProduct = user.cart.find((item) => item.productId.toString() === productId);
        if (existingProduct) {
            existingProduct.count += count;
        } else {
            user.cart.push({ productId: productId, count: count });
        }
        await user.save();

        res.status(200).json({ message: "Product added to cart successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if(!user.cart.find((item) => item.productId.toString() === productId)){
            return res.status(404).json({ message: "Product not found in cart" });
        }
        user.cart = user.cart.filter((item) => item.productId.toString() !== productId);
        await user.save();
        res.status(200).json({ message: "Product removed from cart successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const clearCart = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.cart = [];
        await user.save();
        res.status(200).json({ message: "Cart cleared successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateCart = async (req, res) => {
    try {
        const { productId, count } = req.body;
        if (!productId || !count) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const product = user.cart.find((item) => item.productId.toString() === productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found in cart" });
        }
        product.count = count;
        await user.save();
        res.status(200).json({ message: "Cart updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('cart.productId');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ cart: user.cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const syncCart = async (req, res) => {
    try {
        const { cart } = req.body;
        console.log("Received cart for sync:", JSON.stringify(cart, null, 2));
        if (!cart) {
            return res.status(400).json({ message: "Cart data is required" });
        }
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newCartItems = [];
        for (const item of cart) {
            console.log("Processing cart item:", JSON.stringify(item, null, 2));
            const { productId, count } = item;
            if (!productId || !productId._id) {
                console.error("Invalid cart item: productId or productId._id is missing", item);
                continue; // Skip invalid items
            }
            const product = await Product.findById(productId._id); // Assuming productId has _id
            if (product) {
                newCartItems.push({ productId: product._id, count });
            } else {
                console.warn(`Product with ID ${productId._id} not found in database. Skipping.`);
            }
        }

        // Use findByIdAndUpdate to directly update the cart to avoid versioning issues
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { cart: newCartItems } },
            { new: true, runValidators: true }
        ).populate('cart.productId');

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found after update" });
        }

        res.status(200).json({ message: "Cart synchronized successfully", cart: updatedUser.cart });
    } catch (error) {
        console.error("Error during cart sync:", error);
        res.status(500).json({ message: error.message });
    }
};