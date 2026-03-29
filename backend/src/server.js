import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import cors from 'cors';
import connectDB from './lib/db.js';
import { ENV } from "./lib/env.js";
import cookieParser from "cookie-parser"
import { app, server } from './lib/socket.js';

dotenv.config();

const allowedOrigins = [
  "http://localhost:5173",
  "https://chatify-ruby-two.vercel.app"
];

app.use(cors({
  origin: ["http://localhost:5173", "https://chatify-ruby-two.vercel.app"],
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const PORT = ENV.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Backend is LIVE 🚀");
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});