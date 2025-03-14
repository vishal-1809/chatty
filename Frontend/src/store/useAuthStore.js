import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import axios from 'axios';
import { io } from 'socket.io-client';

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  followers: null,
  following: null,
  post: null,
  isSigningUp: false,
  isLoggingIng: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  isChangingPassword: false,
  isGettingOtp: false,
  otpSent: false,
  isResettingPassword: false,
  otp: null,
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/auth/check');
      set({ authUser: res.data });
      set({ followers: res.data.followers.length});
      set({ following: res.data.following.length});
      set({ post: res.data.post.length});
      
      get().connectSocket();
    } catch (error) {
      // console.log("Error in checkAuth:", error);
      // toast.error(error.response.data.message);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");

      get.connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIng: true });
    try {
      const res = await axiosInstance.post("auth/login", data);
      set({ authUser: res.data });
      // set({ onlineUsers: [...onlineUsers, res._id]});
      toast.success("Logged in Successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIng: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("auth/logout");
      set({ authUser: null });
      toast.success("Logout Successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/updateProfile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      if (error.message === 'Network Error') {
        // Handle payload too large error
        toast.error('Payload too large. Please reduce the size of your request data.');
      }
      else {
        toast.error(error.response.data.message);
      }
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  updateFullName: async (data) => {
    try {
      const res = await axiosInstance.put("/auth/updateName", data);
      set({ authUser: res.data });
      toast.success("Name changed successfully!");
    } catch (error) {
      toast.error(error.response.data.message);
      toast.error("Try Again!");
    }
  },

  updateEmail: async (data) => {
    try {
      const res = await axiosInstance.put("/auth/updateEmail", data);
      set({ authUser: res.data });
      toast.success("Email changed successfully!");
    } catch (error) {
      toast.error(error.response.data.message);
      toast.error("Try Again!");
    }
  },

  updateUsername: async (data) => {
    try {
      const res = await axiosInstance.put("/auth/updateUsername", data);
      set({ authUser: res.data });
      toast.success("Username changed successfully!");
    } catch (error) {
      toast.error(error.response.data.message);
      toast.error("Try Again!");
    }
  },

  changePassword: async (data) => {
    set({ isChangingPassword: true });
    try {
      const res = await axiosInstance.put("/auth/changePassword", data);
      toast.success("Password changed successfully!");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isChangingPassword: false });
    }
  },

  getOtp: async (data) => {
    set({ isGettingOtp: true });
    try {
      const res = await axiosInstance.post('/auth/getOtp', data);
      set({ otp: res.data.otp });
      set({ otpSent: true});
      toast.success(res.data.message);
      return { otp: res.data.otp, email: res.data.email };
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isGettingOtp: false });
    }
  },

  forgotPassword: async (data) => {
    set({ isResettingPassword: true });
    try {
      const res = await axiosInstance.put('/auth/forgotPassword', data);
      toast.success("Password Reset Successful!");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isResettingPassword: false });
    }
  },

  setOtp: () => {
    set({ otp: null });
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },


  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },

}));