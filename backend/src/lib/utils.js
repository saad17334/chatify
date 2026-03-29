import jwt from "jsonwebtoken";
import { ENV } from './env.js';

export const generateToken = (userId, res) => {
    if (!ENV.JWT_SECRET) {
        throw new Error("JWT Secret is not set");
    }

    const token = jwt.sign({ userId }, ENV.JWT_SECRET, {
        expiresIn: "7d",
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return token;
};