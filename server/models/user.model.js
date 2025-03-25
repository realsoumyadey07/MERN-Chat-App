import doetnv from "dotenv";
import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
doetnv.config();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value){
                return emailRegex.test(value)
            },
            message: "Invalid email format!"
        } 
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minlength: [6, "Password must be at least 6 characters long"]
    },
    avatar: {
        public_id: String,
        url: String
    },
    refresh_token: {
        type: String
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },
    status: {
        type: String,
        default: "Hay there! I am using MERN Chat App"
    },
    is_online: {
        type: Boolean,
        default: false
    },
    last_seen: {
        type: Date,
        default: Date.now
    },
    chats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    }],
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
}, {timestamps: true});

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.signAccessToken = async function(){
 return jwt.sign({
    id: this._id,
    email: this.email,
    username: this.username
 }, process.env.ACCESS_TOKEN, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES
 });
}

userSchema.methods.signRefreshToken = async function() {
    return jwt.sign({
        id: this._id
    }, process.env.REFRESH_TOKEN, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES
    });
}

export const User = mongoose.models.User || model("User", userSchema);