import mongoose, { model, Schema, Types } from "mongoose";

const requestSchema = new Schema({
    status: {
        type: String,
        enum: ["pendding", "accepted", "rejected"],
        default: "pendding"
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

export const Request = mongoose.models.Request || model("Request", requestSchema);