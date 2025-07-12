import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "shipped", "delivered", "cancelled"],
        default: "pending",
    },
    paymentMethod: {
        type: String,
        enum: ["cash", "card"],
        default: "cash",
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
    },
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

export default Order;
