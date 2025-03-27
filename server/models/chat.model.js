import mongoose, { Schema, Types, model } from "mongoose";

const chatSchema = new Schema({
    name: {
        type: String,
        default: "" //only for group chats
    },
    groupChat: {
        type: Boolean,
        default: false
    },
    creator: {
        type: Types.ObjectId,
        ref: "User" //only for group chats
    },
    members: [{
        type: Types.ObjectId,
        ref: "User"
    }],
    latest_message: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    }
}, {timestamps: true});

export const Chat = mongoose.models.Chat || model("Chat", chatSchema);