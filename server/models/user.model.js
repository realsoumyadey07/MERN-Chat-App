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
        required: true,
        select: false
    },
    avatar: {
        public_id: String,
        url: String
    }
}, {timestamps: true});

userSchema.pre("save", async function(){
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
    id: this._id
 }, process.env.ACCESS_TOKEN || "");
}

userSchema.methods.signRefreshToken = async function() {
    return jwt.sign({
        id: this._id
    }, process.env.REFRESH_TOKEN || "");
}

export const User = mongoose.models.User || model("User", userSchema);