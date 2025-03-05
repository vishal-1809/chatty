import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from "./useAuthStore";


export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    notFollowing: [],
    followers: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    view: 0,
    notifications: [],

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/message/users");
            set({ users: res.data.sortedFollowingUsers });
            set({ followers: res.data.sortedFollowersUsers });
            set({ notFollowing: res.data.sortedNotFollowingUsers });
            // get the notifications along with users list
            get().getNotification(useAuthStore.getState().authUser._id);
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            set({ messages: res.data });

            // update the notification on reading/selecting the user
            get().updateNotification(get().selectedUser._id);
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
            messageData["createdAt"] = res.data.newMessage.createdAt;
            messageData["receiverId"] = res.data.newMessage.receiverId;
            messageData["senderId"] = res.data.newMessage.senderId;
            messageData["iv"] = res.data.newMessage.iv;
            messageData["_id"] = res.data.newMessage._id;
            messageData["updatedAt"] = res.data.newMessage.updatedAt;
            messageData["_v"] = res.data.newMessage._v;
            if (res.data.newMessage.image) {
                messageData["image"] = res.data.newMessage.image;
            }
            set({ messages: [...messages, messageData] });

        } catch (error) {
            if (error.message && error.message === 'Network Error') {
                // Handle payload too large error
                toast.error('Payload too large. Please reduce the size of your request data.');
            }
            else {
                toast.error(error.response.data.message);
            }
        }
    },

    getNotification: async (userId) => {
        try {
            const res = await axiosInstance.get(`/message/getNotification/${userId}`);
            set({ notifications: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    updateNotification: async (selectedUserid) => {
        try {
            const res = await axiosInstance.put(`/message/updateNotification/${selectedUserid}`);
            set({ notifications: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    deleteMessage: async (selectUserId, id) => {
        try {
            const allMsg = get().messages;
            const res = await axiosInstance.delete(`/message/delete/${selectUserId}/${id}`);
            toast.success("Message Deleted");
            set({ messages: allMsg.filter(message => message._id !== id) });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    // not in use right now
    updateView: async (messageId, userId) => {
        try {
            const res = await axiosInstance.put(`/message/update/${messageId}/${userId}`);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) {
            return;
        }

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
            if (!selectedUser) {
                // if none is selected then also get the notifications
                get().getNotification(useAuthStore.getState().authUser._id);
                // get().getUsers();
                return;
            }
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if (!isMessageSentFromSelectedUser) {
                // get the notifications of others apart from the selected user.
                get().getNotification(useAuthStore.getState().authUser._id);
                // get().getUsers();
                return;
            }
            set({
                messages: [...get().messages, newMessage],
            });

            // update the notification of the selected user.
            get().updateNotification(get().selectedUser._id);
            //   get().getUsers();
        });

        socket.on("updateGetUsers", (id) => {
            get().getUsers();
        })

        socket.on("messageDeleted", (id) => {
            set({
                messages: get().messages.filter(message => message._id !== id),
            });
        })
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
        socket.off("messageDeleted");
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}))

