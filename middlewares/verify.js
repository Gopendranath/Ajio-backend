import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        // console.log("Received Cookie Header:", req.headers.cookie);
        // console.log(token, "verify.js");
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("JWT_SECRET (verifyToken):", process.env.JWT_SECRET); // Temporary log
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Error during verifyToken:", error.message);
        return res.status(500).json({ message: error.message });
        
    }
}
