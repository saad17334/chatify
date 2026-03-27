import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import cors from 'cors';
import connectDB from './lib/db.js';
import {ENV} from "./lib/env.js";
import cookieParser from "cookie-parser"


const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const PORT = ENV.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Backend is LIVE 🚀");
});

app.listen(PORT, () => 
  {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});