import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";


// Copy of getUsers from message controller
export const getUsersforOthers = async (req, res) => {
    try {
        const neededUser = req.body.userName;
        const filteredUsers = await User.find({ userName: { $ne: neededUser } }).select("-password").lean();

        const followingAndNotFollowingList = await User.findOne({userName: neededUser}).select("following followers").lean();

        const followingUsernames = followingAndNotFollowingList.following;
        const followerUsernames = followingAndNotFollowingList.followers;
        
        const userMap = new Map(filteredUsers.map(user => [user.userName, user]));
        
        const sortedFollowingUsers = [
            ...followingUsernames.map(username => userMap.get(username)).filter(Boolean),
        ];
        const sortedFollowersUsers = [
            ...followerUsernames.map(username => userMap.get(username)).filter(Boolean),
        ];
        res.status(200).json({sortedFollowingUsers,sortedFollowersUsers});

    } catch (error) {
        console.error("Error in getUsersForOthers: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}




export const countPost = async (req, res) => {
    try {
        return res.status(200).json(req.user.post.length);

    } catch (error) {
        console.log("Error in countPost function", error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}




export const countFollower = async (req, res) => {
    try {
        return res.status(200).json(req.user.followers.length);

    } catch (error) {
        console.log("Error in countFollower function", error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}




export const countFollowing = async (req, res) => {
    try {
        return res.status(200).json(req.user.following.length);

    } catch (error) {
        console.log("Error in countFollowing function", error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}




export const userDetails = async (req, res) => {
    try {
        const reqUser = req.body;
        const user = await User.findOne({userName: reqUser.userName}).select("-password");

        if(!user) {
            return res.status(400).json({message: "Username not found"});
        }

        const post = user.post.length; // Post count
        const follower = user.followers.length; // Follower count
        const following = user.following.length; // Following count
        
        return res.status(200).json({
            message: "Succesful!",
            post,
            follower,
            following
        });
    } catch (error) {
        console.log("Error in userDetails function", error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}



export const isFollow = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);  // User 
        const username = req.body.userName; // Username to follow
        
        if(user.userName === username) {
            return res.status(400).json({message: "You cannot follow yourself"});
        }

        if(user.following.includes(username)) {
            return res.status(200).json({message: true});
        }

        return res.status(200).json({message: false});

    } catch (error) {
        console.log("Error in followers function", error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}




export const follow = async (req, res) => {
    try {
        const user = req.user;  // User 
        const username = req.body.userName; // Username to follow
        const isUserPresent = await User.findOne({userName: username}); // checking username if present or not

        if(!isUserPresent) {
            return res.status(404).json({message: "Username does not exists to follow"});
        }
        if(user.userName === username) {
            return res.status(400).json({message: "You cannot follow yourself"});
        }

        // Already followed
        let alreadyFollowed = false;
        for(let i=0;i<user.following.length;i++){
            if (user.following[i] === username) {
                alreadyFollowed = true;
                break;
            }
        }

        if(alreadyFollowed) {
            return res.status(400).json({message: "Already followed"});
        }

        user.following.push(username);
        // removing from the notFollowing list
        user.notFollowing = user.notFollowing.filter(lst => lst !== username);

        await user.save();

        isUserPresent.followers.push(user.userName);
        await isUserPresent.save();

        return res.status(200).json({message: `${user.userName} followed successfully to ${username}`});

    } catch (error) {
        console.log("Error in followers function", error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}



export const unfollow = async (req, res) => {
    try {
        const user = req.user;  // User 
        const username = req.body.userName; // Username to follow
        const isUserPresent = await User.findOne({userName: username}); // checking username if present or not

        if(!isUserPresent) {
            return res.status(400).json({message: "Username does not exists to unfollow"});
        }
        if(user.userName === username) {
            return res.status(400).json({message: "You cannot unfollow yourself"});
        }

        // isFollowed
        let isFollowed = false;
        for(let i=0;i<user.following.length;i++){
            if (user.following[i] === username) {
                isFollowed = true;
                break;
            }
        }

        if(!isFollowed) {
            return res.status(400).json({message: "Not followed"});
        }


        user.following.forEach((item, index) => {
            if (item === username) {
              user.following.splice(index, 1);
            }
        });
        
        // Adding in notFollowingList
        user.notFollowing.push(username);

        await user.save();

        isUserPresent.followers.forEach((item, index) => {
            if (item === user.userName) {
                isUserPresent.followers.splice(index, 1);
            }
        });
        await isUserPresent.save();

        return res.status(200).json({message: `${user.userName} unfollowed successfully to ${username}`});

    } catch (error) {
        console.log("Error in followers function", error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}



export const followingList = async (req, res) => {
    try {
        const lst = req.user.following; // User
        return res.status(200).json({lst});

    } catch (error) {
        console.log("Error in followingList function", error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}



export const followerList = async (req, res) => {
    try {
        const lst = req.user.followers; // User
        return res.status(200).json({lst});

    } catch (error) {
        console.log("Error in followingList function", error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}




export const notFollowingList = async (req, res) => {
    try {
        const lst = req.user.notFollowing; // User
        return res.status(200).json({lst});
    } catch (error) {
        console.log("Error in notFollowingList function", error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}




export const othersFollowing = async (req, res) => {
    try {
        const username = req.body.userName;
        const user = await User.findOne({userName: username}).select("-password");
        if(!user) {
            res.status(400).json("Username not found");
        }
        const lst = user.following;
        return res.status(200).json(lst);

    } catch (error) {
        console.log("Error in othersFollowing function", error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}




export const othersFollowers = async (req, res) => {
    try {
        const username = req.body.userName;
        const user = await User.findOne({userName: username}).select("-password");
        if(!user) {
            res.status(400).json("Username not found");
        }
        const lst = user.followers;
        return res.status(200).json(lst);

    } catch (error) {
        console.log("Error in othersFollowers function", error);
        return res.status(500).json({message: "Internal Server Error"});
    }
}




