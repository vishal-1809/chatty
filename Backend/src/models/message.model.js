import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    text: {
        type: String,
    },
    iv: {
        type: String,
    },
    image: {
        type: String,
    },
    view: [
        {
            type: String,
            ref: 'viewedBy'
        }
    ]
}, { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;