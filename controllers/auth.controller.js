import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import { generateToken } from "../utils/generateToken.util.js";

export const SignUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }
        const checkUser = await User.findOne({ email });
        if (checkUser && (checkUser.provider === "email" || checkUser.provider === "emailwithgoogle")) {
            console.log("User already exists.");
            return res.status(400).json({ message: "User already exists." });
        }
        if (checkUser && checkUser.provider === "google") {
            const hashedPassword = await bcrypt.hash(password, 10);
            const updatedUser = await User.findOneAndUpdate({ email }, { provider: "emailwithgoogle", password: hashedPassword }, { new: true });
            return res.status(200).json({ message: "updated authentication", user: { ...updatedUser._doc, password: undefined } });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, provider: "email" });
        return res.status(201).json({ message: "user created", user: { ...user._doc, password: undefined } });
    } catch (error) {
        console.error("Error during SignUp:", error);
        return res.status(500).json({ message: error.message });
    }
}

export const SignIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found." });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password." });
        }
        const token = generateToken(user);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" ? true : false,
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            maxAge: 24 * 60 * 60 * 1000
        });
        return res.status(200).json({ message: "User signed in", user: { ...user._doc, password: undefined } });
    } catch (error) {
        console.error("Error during SignIn:", error);
        return res.status(500).json({ message: error.message });
    }
}

export const SignOut = async (req, res) => {
    try {
        res.clearCookie("token");
        console.log("User signed out");
        res.status(200).json({ message: "User signed out" });
    } catch (error) {
        console.error("Error during SignOut:", error);
        return res.status(500).json({ message: error.message });
    }
}

export const changePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user){
            return res.status(400).json({ message: "User not found." });
        }
        if(user.provider === "google"){
            return res.status(400).json({ message: "Please sign up with same email of your google account" });
        }
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "All fields are required." });
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid old password." });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        return res.status(201).json({ message: "Password changed", user: { ...user._doc, password: undefined } });
    } catch (error) {
        console.error("Error during changePassword:", error);
        return res.status(500).json({ message: error.message });
        
    }

}

export const verifyAuth = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        // console.log(user._id, "auth.route.js verifyAuth");
        if (!user){
            return res.status(400).json({ message: "User not found." });
        } else {
            return res.status(200).json({ message: "User authenticated", user: { ...user._doc, password: undefined } });
        }
    } catch (error) {
        console.error("Error during verifyAuth:", error);
        return res.status(500).json({ message: error.message });
    }
}
