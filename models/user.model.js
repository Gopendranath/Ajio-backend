import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    profilePicture: {
        type: String,
        default: "",
    },
    provider: {
        type: String,
        enum: ["google", "email", "emailwithgoogle"],
        default: "email",
    },
    providerId: {
        type: String,
        default: "",
    },
    cart: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            count: {
                type: Number,
                default: 1,
            },
        },
    ],
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
        },
    ],
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
    address: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address",
            default: [],
        },
    ],
    phone: {
        type: String,
        default: "",
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;