import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSoundEnabled:
        JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

    toggleSound: () => {
        const newValue = !get().isSoundEnabled;
        localStorage.setItem("isSoundEnabled", JSON.stringify(newValue));
        set({ isSoundEnabled: newValue });
    },

    setActiveTab: (tab) => set({ activeTab: tab }),
    setSelectedUser: (selectedUser) => set({ selectedUser }),

    // ================= CONTACTS =================
    getAllContacts: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/contacts");
            set({ allContacts: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    // ================= CHATS =================
    getMyChatPartners: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/chats");
            set({ chats: res.data });
        } catch (error) {
            toast.error(error.response?.data?.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    // ================= MESSAGES =================
    getMessagesByUserId: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    // ================= SEND MESSAGE =================
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        const { authUser } = useAuthStore.getState();

        if (!selectedUser || !authUser) return;

        const tempId = `temp-${Date.now()}`;

        const optimisticMessage = {
            _id: tempId,
            senderId: authUser._id,
            receiverId: selectedUser._id,
            text: messageData.text,
            image: messageData.image,
            createdAt: new Date().toISOString(),
            isOptimistic: true,
        };

        // ✅ add optimistic message
        set({ messages: [...messages, optimisticMessage] });

        try {
            const res = await axiosInstance.post(
                `/messages/send/${selectedUser._id}`,
                messageData
            );

            // ❗ FIX: replace instead of duplicating
            const updatedMessages = get().messages.filter(
                (msg) => msg._id !== tempId
            );

            set({
                messages: [...updatedMessages, res.data],
            });
        } catch (error) {
            // rollback optimistic message
            set({
                messages: messages,
            });

            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
        }
    },

    // ================= SOCKET SUB =================
    subscribeToMessages: () => {
        const { selectedUser, isSoundEnabled } = get();
        const socket = useAuthStore.getState().socket;

        if (!selectedUser || !socket) return;

        socket.off("newMessage"); // prevent duplicate listeners

        socket.on("newMessage", (newMessage) => {
            const currentSelected = get().selectedUser;

            if (!currentSelected) return;

            const isMessageFromSelectedUser =
                newMessage.senderId === currentSelected._id;

            if (!isMessageFromSelectedUser) return;

            set({
                messages: [...get().messages, newMessage],
            });

            if (isSoundEnabled) {
                const notificationSound = new Audio(
                    "/sounds/notification.mp3"
                );

                notificationSound.currentTime = 0;
                notificationSound
                    .play()
                    .catch((e) =>
                        console.log("Audio play failed:", e)
                    );
            }
        });
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;

        if (socket) {
            socket.off("newMessage");
        }
    },
}));