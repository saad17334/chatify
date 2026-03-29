import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const app = express();
const server = http.createServer(app);

const userSocketMap = {}; // { userId: socketId }

const io = new Server(server, {
    cors: {
        origin: [ENV.CLIENT_URL],
        credentials: true,
    },
});


// ================= AUTH MIDDLEWARE =================
io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token;

        if (!token) {
            return next(new Error("No token provided"));
        }

        const decoded = jwt.verify(token, ENV.JWT_SECRET);

        const user = await User.findById(decoded.userId).select(
            "-password"
        );

        if (!user) {
            return next(new Error("User not found"));
        }

        socket.user = user;
        socket.userId = user._id.toString();

        next();
    } catch (err) {
        console.log("Socket auth error:", err.message);
        next(new Error("Invalid token"));
    }
});


// ================= HELPER =================
export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}


// ================= SOCKET CONNECTION =================
io.on("connection", (socket) => {
    console.log("User connected:", socket.user.fullName);

    const userId = socket.userId;

    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    // send online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.user.fullName);

        delete userSocketMap[userId];

        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { io, app, server };