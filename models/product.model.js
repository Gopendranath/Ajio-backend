import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    rating: {
        rate: {
            type: Number,
            required: true,
        },
        count: {
            type: Number,
            required: true,
        },
    },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product;