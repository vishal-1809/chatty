import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { useAuthStore } from './useAuthStore.js';

export const usePostStore = create((set, get) => ({
    // Profile Related
    noOfPost: 0,
    noOfFollowers: 0,
    noOfFollowing: 0,
    followerLst: [],
    followingLst: [],
    notFollowingLst: [],
    selectedUser: null,
    otherFollowingList: [],
    otherFollowersList: [],
    checker: false,

    // Post Related
    isUpdatingPost: false,
    gettingLikes: false,
    likes: {},
    postLst: [],
    postLstofUser: [],
    selectedPost: null,

    // Profile Related
    // All count related stuff
    countPost: async () => {
        try {
            const res = await axiosInstance("/profileInfo/numberOfPost");
            set({ noOfPost: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
    countFollower: async () => {
        try {
            const res = await axiosInstance("/profileInfo/numberOfFollowers");
            set({ noOfFollowers: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
    countFollowing: async () => {
        try {
            const res = await axiosInstance("/profileInfo/numberOfFollowing");
            set({ noOfFollowing: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    // To get the count of post, following, followers
    userDetails: async (data) => {
        try {
            const res = await axiosInstance.post("/profileInfo/userDetails", data);
            set({
                noOfPost: res.data.post,
                noOfFollowers: res.data.follower,
                noOfFollowing: res.data.following
            });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    // To get the count of detailed post, following, followers
    getUsersforOthers: async (data) => {
        try {
            const res = await axiosInstance.post("/profileInfo/getUsersforOthers", data);
            set({
                otherFollowingList: res.data.sortedFollowingUsers,
                otherFollowersList: res.data.sortedFollowersUsers,
            });
        } catch (error) {
            if (error.response.data.message === "You're not allowed to view this section of this profile") {
                // OK
            }
            else {
                toast.error(error.response.data.message);
            }
        }
    },

    // List of userName whom current user does not follows
    notFollowingList: async () => {
        try {
            const res = await axiosInstance.get("/profileInfo/notFollowingList");
            set({ notFollowingLst: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    // Folllow activity
    follow: async (data) => {
        try {
            const lst = get().notFollowingLst;
            const res = await axiosInstance.put("/profileInfo/follow", data);
            lst.forEach((item, index) => {
                if (item === data.userName) {
                    lst.splice(index, 1);
                }
            });
            set({ followingLst: [...get().followingLst, data.userName] });
            set({ notFollowingLst: lst });
            toast.success(`You followed ${data.userName}`);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    // Unfollow activity
    unfollow: async (data) => {
        try {
            const lst = get().followingLst;
            const lst1 = get().notFollowingLst;
            const res = await axiosInstance.put("/profileInfo/unfollow", data);
            lst1.push(data.userName);
            lst.forEach((item, index) => {
                if (item === data.userName) {
                    lst.splice(index, 1);
                }
            });
            set({ followingLst: lst });
            set({ notFollowingLst: lst1 });
            toast.success(`You unfollowed ${data.userName}`);

        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    // Not require now
    isFollow: async (data) => {
        try {
            const res = await axiosInstance.post("/profileInfo/isFollow", data);
            // set({ checker: res.data.message });
            return res.data.message;
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    othersFollowing: async (data) => {
        try {
            const res = await axiosInstance.post("/profileInfo/othersFollowingList", data);
            set({ followingLst: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    othersFollowers: async (data) => {
        try {
            const res = await axiosInstance.post("/profileInfo/othersFollowersList", data);
            set({ followerLst: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),


    // Post Related
    createPost: async (data) => {
        set({ isUpdatingPost: true });
        try {
            const res = await axiosInstance.put("/posting/post", data);
            toast.success("Posted successfully");
            set({ isUpdatingPost: false });
            return "Success";
        } catch (error) {
            if (error.message === 'Network Error') {
                // Handle payload too large error
                toast.error('Payload too large. Please reduce the size of your request data.');
                set({ isUpdatingPost: false });
                return "Payload";
            }
            else {
                toast.error(error.response.data.message);
                set({ isUpdatingPost: false });
                return "Error";
            }

        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    likePost: async (data) => {
        try {
            const res = await axiosInstance.put(`/posting/likePost/${data}`);
            // set({ likes: res.data.post.likes });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    dislikePost: async (data) => {
        try {
            const res = await axiosInstance.put(`/posting/dislikePost/${data}`);
            // set({ likes: res.data.post.likes });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    likeList: async (data) => {
        set({gettingLikes: true});
        try {
            const res = await axiosInstance.post('/posting/likeList', data);
            set({ likes: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({gettingLikes: false});
        }
    },

    likeActivity: () => {
        const socket = useAuthStore.getState().socket;
        if(socket){
            socket.on("likeActivity", (data) => {
                set((state) => ({
                    postLst: state.postLst.map((post) =>
                        post._id === data._id ? data : post // Replace only the matching post
                    ),
                }));
            });
        }
        
    },

    getPosts: async () => {
        try {
            const res = await axiosInstance.get("/posting/getPost");
            set({ postLst: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    getPostsbyUser: async (data) => {
        try {
            const res = await axiosInstance.post("/posting/getPostsbyUser", data);
            set({ postLstofUser: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    viewProfile: async (data) => {
        try {
            const res = await axiosInstance.post('/posting/viewProfile', data);
            return res.data;
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },


    deletePost: async (data) => {
        try {
            const res = await axiosInstance.delete(`/posting/deletePost/${data}`);
            toast.success("Post Deleted");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    setSelectedPost: async (data) => {
        set({ selectedPost: data });
        get().likeList({ _id: data });
    }

}));