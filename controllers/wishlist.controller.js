import User from "../models/user.model.js";
import Product from "../models/product.model.js";

// Add a product to the user's wishlist
export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }
        const userId = req.user.id; // Assuming user ID is available from authentication middleware
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const product = await Product.findOne({ id: productId }); // Find by 'id' field
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if product already in wishlist using product._id
        if (user.wishlist.includes(product._id)) {
            return res.status(400).json({
                message: "Product already in wishlist",
                exist: true
            });
        }

        user.wishlist.push(product._id); // Push product._id
        await user.save();

        res.status(200).json({ message: "Product added to wishlist successfully", wishlist: user.wishlist });
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        res.status(500).json({ message: "Failed to add to wishlist", error: error.message });
    }
};

// Remove a product from the user's wishlist
export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        // console.log("Server: Received request to remove product with ID:", productId);
        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the product by its 'id' field to get its MongoDB '_id'
        const productToRemove = await Product.findOne({ id: productId });

        if (!productToRemove) {
            return res.status(404).json({ message: "Product not found in database" });
        }

        const initialLength = user.wishlist.length;
        user.wishlist = user.wishlist.filter(
            (item) => item.toString() !== productToRemove._id.toString()
        );

        if (user.wishlist.length === initialLength) {
            return res.status(404).json({ message: "Product not found in wishlist" });
        }

        await user.save();

        res.status(200).json({ message: "Product removed from wishlist successfully", wishlist: user.wishlist });
    } catch (error) {
        console.error("Error removing from wishlist:", error);
        res.status(500).json({ message: "Failed to remove from wishlist", error: error.message });
    }
};

// Get user's wishlist
export const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).populate('wishlist');
        // console.log(user);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ wishlist: user.wishlist });
    } catch (error) {
        console.error("Error fetching wishlist:", error.message);
        res.status(500).json({ message: "Failed to fetch wishlist", error: error.message });
    }
}; 