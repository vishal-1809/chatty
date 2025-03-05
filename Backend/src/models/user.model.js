import mongoose from "mongoose";

const userSchema =  new mongoose.Schema(
    {
        email: {
            type: String,
            require: true,
            unique: true
        },
        fullName: {
            type: String,
            require: true
        },
        userName: {
            type: String,
            require: true,
            unique: true
        },
        profilePic: {
            type: String,
            default: ""
        },
        createdAt: {
            type: Date,
            default: Date.now()
        },
        password: {
            type: String,
            require: true
        },
        followers: [
            { 
                type: String, 
                ref: 'Followers' 
            }
        ],
        following: [
            { 
                type: String, 
                ref: 'Following' 
            }
        ],
        notFollowing: [
            { 
                type: String, 
                ref: 'Following' 
            }
        ],
        post: [
            { 
                type: mongoose.Schema.Types.Object, 
                ref: 'Posted'
            }
        ],
        notifications: [
            {
                type: Object,
                ref: "Notifications",
            }
        ],
        postLikes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "PostLikes"
            }
        ]
    },
    { timestamps: true }
);

const User =  mongoose.model("User", userSchema);

export default User;
