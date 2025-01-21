import doetnv from "dotenv";
import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
doetnv.config({
    path: "../.env"
});

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (value){
                return emailRegex.test(value)
            }
        } 
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: [true, "password is required"]
    },
    avatar: {
        public_id: String,
        url: String
    },
    refresh_token: {
        type: String
    }
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