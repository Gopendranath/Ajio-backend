import Product from "../models/product.model.js";
import axios from "axios";

export const importFakestoreProducts = async (req, res) => {
    try {
        const response = await axios.get("https://fakestoreapi.com/products");
        const products = response.data;

        for (const productData of products) {
            const existingProduct = await Product.findOne({ id: productData.id });

            if (!existingProduct) {
                const newProduct = new Product({
                    id: productData.id.toString(), // Ensure ID is a string
                    title: productData.title,
                    price: productData.price,
                    description: productData.description,
                    category: productData.category,
                    image: productData.image,
                    rating: {
                        rate: productData.rating.rate,
                        count: productData.rating.count,
                    },
                });
                await newProduct.save();
                console.log(`Product ${productData.title} saved to DB.`);
            } else {
                console.log(`Product ${productData.title} already exists in DB.`);
            }
        }

        res.status(200).json({ message: "Fakestore products imported successfully!" });
    } catch (error) {
        console.error("Error importing Fakestore products:", error);
        res.status(500).json({ message: "Failed to import Fakestore products", error: error.message });
    }
};

export const addDummyProducts = async (req, res) => {
    try {
        const categories = ["electronics", "jewelery", "men's clothing", "women's clothing"];
        const adjectives = ["Stylish", "Modern", "Classic", "Innovative", "Durable", "Comfortable", "High-Quality", "Elegant", "Versatile", "Portable"];
        const nouns = ["Shirt", "Pants", "Jacket", "Earrings", "Necklace", "Laptop", "Monitor", "Headphones", "Dress", "Shoes"];
        const placeholderImage = "https://placehold.co/600?text=Product+Image";

        for (let i = 0; i < 100; i++) {
            const randomCategory = categories[Math.floor(Math.random() * categories.length)];
            const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
            const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
            const title = `${randomAdjective} ${randomNoun} ${i + 1}`;
            const price = parseFloat((Math.random() * (500 - 10) + 10).toFixed(2));
            const description = `This is a ${randomAdjective.toLowerCase()} and ${randomNoun.toLowerCase()} of excellent quality. Designed for comfort and style.`;
            const rate = parseFloat((Math.random() * (5 - 1) + 1).toFixed(1));
            const count = Math.floor(Math.random() * 1000) + 1;
            const uniqueId = `dummy-${Date.now()}-${i}`;

            const existingProduct = await Product.findOne({ id: uniqueId });

            if (!existingProduct) {
                const newProduct = new Product({
                    id: uniqueId,
                    title,
                    price,
                    description,
                    category: randomCategory,
                    image: placeholderImage,
                    rating: {
                        rate,
                        count,
                    },
                });
                await newProduct.save();
                console.log(`Dummy product ${title} saved to DB.`);
            } else {
                console.log(`Dummy product ${title} (ID: ${uniqueId}) already exists in DB.`);
            }
        }

        res.status(200).json({ message: "100 dummy products added successfully!" });
    } catch (error) {
        console.error("Error adding dummy products:", error);
        res.status(500).json({ message: "Failed to add dummy products", error: error.message });
    }
}; 