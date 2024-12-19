import dotenv from "dotenv";
dotenv.config();
import { AsyncHandler } from "../middlewares/AsyncHandler.js";
import { User } from "../models/user.model.js";

export const userRegistration = AsyncHandler(async(req, res, next)=> {
    try {
        const {email, username, password} = req.body;
        if([email, username, password].some((field)=> field?.trim()==="")){
            return res.status(400).json({
                success: false,
                message: "Three fiels are required!"
            });
        }
        const userExists = await User.findOne({email});
        if(userExists){
            return next(res.status(400).json({
                success: false,
                message: "Email already exists!"
            }));
        }
        const user = await User.create({email, username, password});
        return next(res.status(200).json({
            success: true,
            user,
            message: "User successfully created!"
        }));
    } catch (error) {
        return next(res.status(500).json({
            success: false,
            message: error.message
        }))
    }
});

export const userLogin = AsyncHandler(async(req, res, next)=> {
    try {
        const {email, password} = req.body;
        if([email, password].some((field)=> field?.trim()==="")){
            return next(res.status(400).json({
                success: false,
                message: "All fields are required!"
            }));
        }
        const user = await User.findOne({email}).select("+password");
        if(!user){
            return next(res.status(400).json({
                success: false,
                message: "Email is not correct!"
            }))
        }
        const isMatched = await user.comparePassword(password);
        if(!isMatched){
            return next(res.status(400).json({
                success: false,
                message: "Password is not corrent!"
            }))
        }
        const accessToken = await user.signAccessToken();
        const refreshToken = await user.signRefreshToken();
        const accessTokenOption = {
            expires: new Date( Date.now() + 5 * 24 * 60 * 60 * 1000 ),
            maxAge: 5 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }
        const refreshTokenOption = {
            expires: new Date( Date.now() + 30 * 24 * 60 * 60 * 1000 ),
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }
        return next(
            res
            .status(200)
            .cookie("access_token", accessToken, accessTokenOption)
            .cookie("refresh_token", refreshToken, refreshTokenOption)
            .json({
            success: true,
            user,
            access_token: accessToken,
            refresh_token: refreshToken,
            message: "User logged in successfully!"
        }));
    } catch (error) {
        return next(res.status(500).json({
            success: false,
            message: error.message
        }))
    }
});

export const userLogout = AsyncHandler(async(req, res, next)=> {
    try {
        res.cookie("access_token", "", {maxAge: 1});
        res.cookie("refresh_token", "", {maxAge: 1});
        res.status(200).json({
            success: true,
            message: "User logout successfully!"
        });
    } catch (error) {
        return next(res.status(500).json({
            success: false,
            message: error.message
        }))
    }
})