import Post from '../models/post.model.js';
import cloudinary from "../lib/cloudinary.js";
import User from '../models/user.model.js';
import { getReceiverSocketId, io } from "../lib/socket.js";


export const posts = async (req, res) => {
    try {
        const data = req.body;
        const user = req.user;

        if (!data.post) {
            return res.status(400).json({ message: "Photo is required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(data.post);
        let imgUrl = uploadResponse.secure_url;
        const newPost = new Post({
            userId: user._id,
            profilePic: user.profilePic,
            userName: user.userName,
            fullName: user.fullName,
            post: uploadResponse.secure_url,
            caption: data.caption,
            likes: [],
        });

        // For User Model
        let temp = await User.findById(user._id);
        if (!temp) {
            return res.status(400).json("User not found");
        }
        let postObject = {
            postUnique: newPost._id,
            user: user._id,
            post: imgUrl,
            caption: data.caption,
            likes: 0,
            createdAt: Date.now(), 
        }

        temp.post.push(postObject);

        const inUserModel = await User.findByIdAndUpdate(
            user._id,
            {
                post: temp.post,
            },
            { new: true }
        );


        await newPost.save();


        return res.status(200).json({
            userId: user._id,
            post: data.post,
            caption: data.caption,
            likes: [],
        })
    } catch (error) {
        console.error("Error in post function: ", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}


// Contains dislike activity as well    
export const like = async (req, res) => {
    try {
        const likedBy = req.user;
        const postId = req.params.id;

        const getPost = await Post.findById(postId);
        
        if (likedBy.postLikes.includes(postId)) {
            // return res.status(400).json({ message: "Already liked" });
            // Delete Activity
            
            getPost.likes.forEach((item, index) => {
                if (item.userId.toString() === likedBy._id.toString()) {
                    getPost.likes.splice(index, 1);
                }
            });

            const post = await Post.findByIdAndUpdate(
                postId,
                {
                    $set: { likes: getPost.likes },
                },
                { new: true }
            );

            const likerId =  getReceiverSocketId(likedBy._id);
            if(likerId) {
                io.emit("likeActivity", post);
            }

            // For User Model 
            const posterId = await User.findById(getPost.userId);
            for (let i = 0; i < posterId.post.length; i++) {
                if (posterId.post[i].postUnique.toString() === postId.toString()) {
                    posterId.post[i].likes -= 1;
                }
            }

            const inUserModelForPoster = await User.findByIdAndUpdate(
                getPost.userId,
                {
                    post: posterId.post,
                }
            )

            const temp = await User.findById(likedBy._id);
            

            temp.postLikes.forEach((item, index) => {
                if (item.toString() === postId.toString()) {
                    temp.postLikes.splice(index, 1);
                }
            });

            const inUserModel = await User.findByIdAndUpdate(
                likedBy._id,
                {
                    post: temp.post,
                    postLikes: temp.postLikes,
                },
                { new: true }
            )

            return res.status(200).json({ post, inUserModel });
        }

        else {
            // Like Activity
            const tempLikes = {
                userId: likedBy._id,
                profilePhoto: likedBy.profilePhoto,
                userName: likedBy.userName,
                fullName: likedBy.fullName,
            }
            getPost.likes.push(tempLikes);
            
            const post = await Post.findByIdAndUpdate(
                postId,
                {
                    $set: { likes: getPost.likes },
                },
                { new: true }
            );

            const likerId =  getReceiverSocketId(likedBy._id);
            if(likerId) {
                io.emit("likeActivity", post);
            }

            // For User Model
            const posterId = await User.findById(getPost.userId);
            for (let i = 0; i < posterId.post.length; i++) {
                if (posterId.post[i].postUnique.toString() === postId.toString()) {
                    posterId.post[i].likes += 1;
                }
            }

            const inUserModelForPoster = await User.findByIdAndUpdate(
                getPost.userId,
                {
                    post: posterId.post,
                }
            )

            const temp = await User.findById(likedBy._id);
            // for (let i = 0; i < temp.post.length; i++) {
            //     if (temp.post[i].postUnique.toString() === postId.toString()) {
            //         temp.post[i].likes += 1;
            //     }
            // }
            temp.postLikes.push(postId);

            const inUserModel = await User.findByIdAndUpdate(
                likedBy._id,
                {
                    post: temp.post,
                    postLikes: temp.postLikes,
                },
                { new: true }
            );

            return res.status(200).json({ post, inUserModel });
        }

    } catch (error) {
        console.error("Error in like function: ", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}



// Not required as like function includes both the activities
// Not updated
export const dislike = async (req, res) => {
    try {
        const dislikedBy = req.user;
        const postId = req.params.id;

        const getPost = await Post.findbyId(postId);
        if (!(getPost.likes.includes({
            userId: likedBy._id,
            profilePhoto: likedBy.profilePhoto,
            userName: likedBy.userName,
            fullName: likedBy.fullName,
        }))) {
            return res.status(400).json({ message: "Please like first" });
        }

        getPost.likes.forEach((item, index) => {
            if (item.userId.toString() === dislikedBy.userName.toString()) {
                getPost.likes.splice(index, 1);
            }
        });

        const post = await Post.findByIdAndUpdate(
            postId,
            {
                likes: getPost.likes,
            },
            { new: true }
        );

        // For User Model 
        const temp = await User.findById(dislikedBy._id);
        for (let i = 0; i < temp.post.length; i++) {
            if (temp.post[i].postId.toString() === postId.toString()) {
                temp.post[i].likes -= 1;
            }
        }

        const inUserModel = await User.findByIdAndUpdate(
            dislikedBy._id,
            {
                post: temp.post,
            },
            { new: true }
        )

        return res.status(200).json({ post, inUserModel });
    } catch (error) {
        console.error("Error in dislike function: ", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}




export const likeList = async (req, res) => {
    try {
        const postId = req.body._id;
        const likes = await Post.findById(postId);
        return res.status(200).json(likes);
    } catch (error) {
        console.log("Error in likeList function", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}




export const getPosts = async (req, res) => {
    try {
        const user = req.user;
        const posts = await Post.find({
            $or: [
                { userName: { $in: user.following } },  // Posts from followed users
                { userName: user.userName }             // Posts from the current user
            ]
        }).sort({ createdAt: -1 });
        return res.status(200).json(posts);
    } catch (error) {
        console.log("Error in getPosts function", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}



export const getPostsbyUser = async (req, res) => {
    try {
        const user = req.body._id;
        const userPost = await User.findById(user).select(-"password");
        const sortedPosts = userPost.post.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return res.status(200).json(sortedPosts);
    } catch (error) {
        console.log("Error in getPostsbyUser function", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}



export const deletePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const user = req.user;
        const result = await Post.findById(postId);
        if (result.userName !== user.userName) {
            return res.status(500).json({ message: "Unauthorize Access!" });
        }

        const userPosts = req.user.post;
        for (let i = 0; i < userPosts.length; i++) {
            if (userPosts[i].postUnique.toString() === postId.toString()) {
                userPosts.splice(i, 1);
            }
        }
        const inUserModel = await User.findByIdAndUpdate(
            req.user._id,
            {
                post: userPosts,
            },
            { new: true },
        );


        await Post.findByIdAndDelete(postId);

        return res.status(200).json({ message: "Post Deleted Successfully" });
    } catch (error) {
        console.log("Error in deletePost function", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}



export const viewProfile = async (req, res) => {
    try {
        const userId = req.body._id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(500).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.log("Error in viewProfile function", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

