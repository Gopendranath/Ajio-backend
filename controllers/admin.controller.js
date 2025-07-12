import Product from "../models/product.model.js"
import User from "../models/user.model.js"
import Order from "../models/order.model.js"



export const getALLinfo = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const productCount = await Product.countDocuments();
        const orderCount = await Order.countDocuments();

        res.render('dashboard', {
            userCount,
            productCount,
            orderCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.render('user-list', { users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: error.message });
    }
}

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.render('product-list', { products });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: error.message });
    }
}

export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const adminLogin = async (req, res) => {
    const { keyword1, keyword2, keyword3 } = req.body;

    // Replace with your actual secret keywords
    const SECRET_KEYWORD_1 = "admin1";
    const SECRET_KEYWORD_2 = "admin2";
    const SECRET_KEYWORD_3 = "admin3";

    if (keyword1 === SECRET_KEYWORD_1 && keyword2 === SECRET_KEYWORD_2 && keyword3 === SECRET_KEYWORD_3) {
        // In a real application, you'd likely set a session or token here
        res.redirect('/admin/dashboard');
    } else {
        res.render('default', { error: 'Invalid keywords' });
    }
}

export const addProduct = async (req, res) => {
    try {
        const { id, title, price, description, category, image, rate, count } = req.body;

        // Basic validation
        if (!id || !title || !price || !description || !category || !image || !rate || !count) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newProduct = new Product({
            id,
            title,
            price: parseFloat(price),
            description,
            category,
            image,
            rating: {
                rate: parseFloat(rate),
                count: parseInt(count),
            },
        });

        await newProduct.save();
        // For server-side rendering, you might want to redirect or re-render with a success message
        res.redirect('/admin/products/add?message=Product added successfully');
    } catch (error) {
        console.error("Error adding product:", error);
        res.render('add-product', { error: "Failed to add product: " + error.message });
    }
}

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            // If product is not found, render edit-product with an error
            return res.render('edit-product', { error: "Product not found", product: {} });
        }
        res.render('edit-product', { product, message: req.query.message, error: req.query.error });
    } catch (error) {
        console.error("Error fetching product for edit:", error);
        res.render('edit-product', { error: "Error fetching product: " + error.message, product: {} });
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { title, price, description, category, image, rate, count } = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                title,
                price: parseFloat(price),
                description,
                category,
                image,
                rating: {
                    rate: parseFloat(rate),
                    count: parseInt(count),
                },
            },
            { new: true } // Return the updated document
        );

        if (!updatedProduct) {
            return res.redirect(`/admin/products/edit/${req.params.id}?error=Product not found`);
        }

        res.redirect(`/admin/products/edit/${updatedProduct._id}?message=Product updated successfully`);
    } catch (error) {
        console.error("Error updating product:", error);
        res.redirect(`/admin/products/edit/${req.params.id}?error=Failed to update product: ${error.message}`);
    }
}

export const getSingleUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.render('edit-user', { error: "User not found", user: {} });
        }
        res.render('edit-user', { user, message: req.query.message, error: req.query.error });
    } catch (error) {
        console.error("Error fetching user for edit:", error);
        res.render('edit-user', { error: "Error fetching user: " + error.message, user: {} });
    }
}

export const updateUser = async (req, res) => {
    try {
        const { name, email, profilePicture, phone } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                name,
                email,
                profilePicture,
                phone,
            },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.redirect(`/admin/users/edit/${req.params.id}?error=User not found`);
        }

        res.redirect(`/admin/users/edit/${updatedUser._id}?message=User updated successfully`);
    } catch (error) {
        console.error("Error updating user:", error);
        res.redirect(`/admin/users/edit/${req.params.id}?error=Failed to update user: ${error.message}`);
    }
}