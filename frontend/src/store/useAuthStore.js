import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
    import.meta.env.MODE === "development"
        ? "http://localhost:3000"
        : "https://chat-backend-7mix.onrender.com";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    socket: null,
    onlineUsers: [],

    // ================= CHECK AUTH =================
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");

            set({ authUser: res.data });

            get().connectSocket();
        } catch (error) {
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    // ================= SIGNUP =================
    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);

            // 🔥 SAVE TOKEN
            localStorage.setItem("token", res.data.token);

            set({ authUser: res.data.user });

            toast.success("Account created successfully!");

            get().connectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message || "Signup failed");
        } finally {
            set({ isSigningUp: false });
        }
    },

    // ================= LOGIN =================
    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);

            // 🔥 SAVE TOKEN
            localStorage.setItem("token", res.data.token);

            set({ authUser: res.data.user });

            toast.success("Logged in successfully");

            get().connectSocket();
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            set({ isLoggingIn: false });
        }
    },

    // ================= LOGOUT =================
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");

            localStorage.removeItem("token");

            set({ authUser: null });

            toast.success("Logged out successfully");

            get().disconnectSocket();
        } catch (error) {
            toast.error("Error logging out");
        }
    },

    // ================= UPDATE PROFILE =================
    updateProfile: async (data) => {
        try {
            const res = await axiosInstance.put(
                "/auth/update-profile",
                data
            );

            set({ authUser: res.data });

            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
        }
    },

    // ================= SOCKET =================
    connectSocket: () => {
        const { authUser } = get();

        const token = localStorage.getItem("token");

        if (!authUser || !token || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            auth: {
                token, // 🔥 send JWT to backend
            },
        });

        socket.connect();

        set({ socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },

    disconnectSocket: () => {
        if (get().socket?.connected) {
            get().socket.disconnect();
        }

        set({ socket: null });
    },
}));