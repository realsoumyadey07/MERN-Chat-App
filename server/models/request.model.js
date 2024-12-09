import { model, Schema, Types } from "mongoose";

const requestSchema = new Schema({
    status: {
        type: String,
        default: "pendding",
        enum: ["pendding", "accepted", "rejected"]
    },
    sender: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true});

export const Request = model.Request || model("Request", requestSchema);