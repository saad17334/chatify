import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

export const socketAuthMiddleware = async (socket, next) => {
    try {
        // ✅ GET TOKEN FROM SOCKET AUTH (NOT COOKIES)
        const token = socket.handshake.auth?.token;

        if (!token) {
            console.log("Socket rejected: No token provided");
            return next(new Error("Unauthorized - No token provided"));
        }

        // ✅ VERIFY TOKEN
        const decoded = jwt.verify(token, ENV.JWT_SECRET);

        if (!decoded) {
            console.log("Socket rejected: Invalid token");
            return next(new Error("Unauthorized - Invalid token"));
        }

        // ✅ FIND USER
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            console.log("Socket rejected: User not found");
            return next(new Error("User not found"));
        }

        // ✅ ATTACH USER TO SOCKET
        socket.user = user;
        socket.userId = user._id.toString();

        console.log(
            `Socket authenticated: ${user.fullName} (${user._id})`
        );

        next();
    } catch (error) {
        console.log("Socket auth error:", error.message);
        return next(new Error("Unauthorized - Authentication failed"));
    }
};