import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ENV } from "../lib/env.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import cloudinary from "../lib/cloudinary.js";


// 🔐 Helper: generate JWT (NO COOKIE)
const generateToken = (userId) => {
    return jwt.sign({ userId }, ENV.JWT_SECRET, {
        expiresIn: "7d",
    });
};



// ======================== SIGNUP ========================
export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
        });

        const token = generateToken(newUser._id);

        // email (non-blocking)
        try {
            await sendWelcomeEmail(newUser.email, newUser.fullName, ENV.CLIENT_URL);
        } catch (err) {
            console.log("Email error:", err);
        }

        return res.status(201).json({
            message: "User created successfully",
            user: {
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            },
            token,
        });

    } catch (error) {
        console.log("Signup error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



// ======================== LOGIN ========================
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user._id);

        return res.status(200).json({
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic,
            },
            token,
        });

    } catch (error) {
        console.log("Login error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



// ======================== LOGOUT ========================
// (No cookie anymore → just frontend removes token)
export const logout = (req, res) => {
    return res.status(200).json({ message: "Logged out successfully" });
};



// ======================== UPDATE PROFILE ========================
export const updateprofile = async (req, res) => {
    try {
        const { profilePic } = req.body;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile Pic is required" });
        }

        const userId = req.userId; // IMPORTANT CHANGE

        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        );

        res.status(200).json(updatedUser);

    } catch (error) {
        console.log("error in update profile:", error);
        res.status(500).json({ message: "internal server error" });
    }
};