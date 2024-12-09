import mongoose, { Schema, Types, model } from "mongoose";

const messageSchema = new Schema({
    content: String,
    attchments: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    sender: {
        type: Types.ObjectId,
        ref: "User"
    },
    chat: {
        type: Types.ObjectId,
        ref: "Chat",
        required: true
    }
}, {timestamps: true});

export const Message = mongoose.models.Message || model("Message", messageSchema);