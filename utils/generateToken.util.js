import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateToken = (user) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
    // console.log("JWT_SECRET (generateToken):", process.env.JWT_SECRET); // Temporary log
    return token;
};