import User from "../models/User.js";
import { ENV } from "../lib/env.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
    try {
        // ✅ GET TOKEN FROM HEADER (NOT COOKIES)
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }

        const token = authHeader.split(" ")[1];

        // ✅ VERIFY TOKEN
        const decoded = jwt.verify(token, ENV.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        }

        // ✅ GET USER
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // attach user to request
        req.user = user;
        req.userId = user._id;

        next();

    } catch (error) {
        console.log("Error in protectRoute middleware:", error);
        return res.status(500).json({ message: "Internal Server error" });
    }
};