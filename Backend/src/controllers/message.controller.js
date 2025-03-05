import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { encrypt, decrypt } from "../crypto/crypto.js";
import { follow } from "./profileInfo.controller.js";

const moveToFirst = (arr, element) => arr.includes(element) ? [element, ...arr.filter(el => el !== element)] : arr;


export const getUsers = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        // Sorting in accordance with most number of followers.
        // const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password").sort((a, b) => b.followers.length - a.followers.length);
        // const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password").lean();
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password").lean();
        // Use .lean() for faster operations if no document methods are needed

        // Sort the users based on the length of their followers array in descending order
        filteredUsers.sort((a, b) => b.followers.length - a.followers.length);


        const followingAndNotFollowingList = await User.findById(loggedInUserId).select("following followers notFollowing").lean();
        // console.log(filteredUsers);

        const followingUsernames = followingAndNotFollowingList.following;
        const followerUsernames = followingAndNotFollowingList.followers;
        const notFollowingUsernames = followingAndNotFollowingList.notFollowing;

        // Create a map for quick lookup
        const userMap = new Map(filteredUsers.map(user => [user.userName, user]));
        // console.log(userMap);

        // Reorder the users based on the following and notFollowing lists
        const sortedFollowingUsers = [
            ...followingUsernames.map(username => userMap.get(username)).filter(Boolean),
            // ...notFollowingUsernames.map(username => userMap.get(username)).filter(Boolean),
        ];
        const sortedFollowersUsers = [
            ...followerUsernames.map(username => userMap.get(username)).filter(Boolean),
            // ...notFollowingUsernames.map(username => userMap.get(username)).filter(Boolean),
        ];
        const sortedNotFollowingUsers = [
            // ...followingUsernames.map(username => userMap.get(username)).filter(Boolean),
            ...notFollowingUsernames.map(username => userMap.get(username)).filter(Boolean),
        ];
        // console.log(sortedUsers);

        res.status(200).json({sortedFollowingUsers,sortedFollowersUsers, sortedNotFollowingUsers});

    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}


export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ],
        });

        const decryptedMessages = messages.map((message) => {
            const decryptedText = decrypt({iv: message.iv, encryptedData: message.text}); // Decrypt the text
            return { ...message.toObject(), text: decryptedText };
            // return { ...decryptedText.toString()};
        });

        res.status(200).json(decryptedMessages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imgUrl;
        if (image) {
            // Upload to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imgUrl = uploadResponse.secure_url;
        }


        const encryptedMessage = encrypt(text);
        const newMessage = new Message({
            senderId,
            receiverId,
            // text: hashedText,
            text: encryptedMessage.encryptedData,
            iv: encryptedMessage.iv.toString("hex"), // Store the IV for decryption
            image: imgUrl,
            view: [senderId],
        });

        await newMessage.save();

        const notification = await User.findById(receiverId);
        let found = 0;
        for(let i=0;i<notification.notifications.length;i++){
            if(notification.notifications[i].userId.toString() === senderId.toString()) {
                notification.notifications[i].notify += 1; 
                found = 1;
                break;
            }
        }
        if(!found) {
            notification.notifications.push({userId: senderId, notify: 1});
        }
        // await notification.save();

        // updating the receiver notification and following or notFollowing list for latest messages
        const notif = await User.findByIdAndUpdate(
            receiverId,
            {
                notifications: notification.notifications,
                following: moveToFirst(notification.following, req.user.userName),
                notFollowing: moveToFirst(notification.notFollowing, req.user.userName),
            },
            { new: true }
        );

        // updating the receiver notification and following or notFollowing list for latest messages
        const notif1 = await User.findByIdAndUpdate(
            senderId,
            {
                following: moveToFirst(req.user.following, notification.userName),
                notFollowing: moveToFirst(req.user.notFollowing, notification.userName),
            },
            { new: true }
        );

        const raw = {
            _id: newMessage.id,
            senderId,
            receiverId,
            text: text,
            image: imgUrl,
            createdAt: Date.now(),
        };


        // realtime functionality
        const receiverSocketId = getReceiverSocketId(receiverId);
        const senderSocketId = getReceiverSocketId(senderId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", raw);
            io.to(receiverSocketId).emit("updateGetUsers", receiverId);
        }
        
        if (senderSocketId) {
            io.to(senderSocketId).emit("updateGetUsers", senderId);
        }

        res.status(201).json({newMessage, notif});


    } catch (error) {
        console.log("Error in sendMessage function", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const getNotification = async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await User.findById(userId);
        return res.status(200).json(result.notifications);
    } catch (error) {
        console.log("Error in getNotification function", error);
        return res.status(500).json({message: "Internal Server Error"});
    }
};


export const updateNotification = async (req, res) => {
    try {
        const selectedUser = req.params.selectedUser;
        const result = req.user;
        let found=0;
        for(let i=0;i<result.notifications.length;i++){
            if(result.notifications[i].userId.toString() === selectedUser.toString()) {
                result.notifications[i].notify = 0;
                found = 1;
                break;
            }
        }
        if(!found) return res.status(200).json(result.notifications);
        const updating = await User.findByIdAndUpdate(
            result._id,
            { notifications: result.notifications },
            { new: true }
        );
        return res.status(200).json(updating.notifications);
    } catch (error) {
        console.log("Error in updateNotification function", error);
        return res.status(200).json({message: "Internal Server Error"});
    }
};


export const deleteMessage = async (req, res) => {
    try {
        const id = req.params.messageid;
        const receiverId = req.params.selectedUserid;
        const idPresent = await Message.findById({_id: id});
        if(!idPresent) {
            return res.status(400).json({message: "Message not found"});
        }
        // await Message.findByIdAndDelete({_id: id});
        await Message.findByIdAndDelete({_id: id})
      .then(() => {
        // Emit to all connected users in the same chat room
        io.emit('messageDeleted', idPresent.text); 
        const senderSocketId = getReceiverSocketId(req.user._id);
        const receiverSocketId = getReceiverSocketId(receiverId);

        if (senderSocketId) {
            io.to(senderSocketId).emit("messageDeleted", id);
        } 

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("messageDeleted", id);
        }  
      })

        return res.status(200).json({message: "Message Deleted Successfully"});
    } catch (error) {
        console.log("Error in deleteMessage function", error);
        return res.status(500).json({message: "Internal Server Error"});
    }
};


export const updateView = async (req, res) => {
    try {
        const messageid = req.params.messageid;
        const userId = req.params.userId;
        const currentUserId = req.user._id;
        const isMessageId = await Message.findOne({senderId: currentUserId, receiverId: userId, _id: messageid});
        if(!isMessageId) {
            res.status(400).json({message: "Message not found"});
        }
        
        isMessageId.view.push(userId);
        await isMessageId.save();

        return res.status(200).json(isMessageId);

    } catch (error) {
        console.log("Error in updateView function", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};