import mongoose, { Schema, Types, model, mongo } from "mongoose";

const messageSchema = new Schema({
    content: {
        type: String,
        require: true
    },
    attchments: {
        public_id: {
            type: String,
            default: null
        },
        url: {
            type: String,
            default: null
        }
    },
    seen_by: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
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