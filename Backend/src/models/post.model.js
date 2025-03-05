import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true, 
    },
    userName : {
        type: String,
        require: true,
    },
    fullName : {
        type: String,
        require: true,
    },
    profilePic: {
        type: String,
        default: ""
    },
    caption: {
        type: String,
    },
    post: {
        type: String,
        require: true, 
    },
    likes: [
        {
            type: mongoose.Schema.Types.Object, 
            ref: "Likes",
        },
    ]
}, { timestamps: true } );

const Post = mongoose.model("Post", PostSchema);

export default Post;