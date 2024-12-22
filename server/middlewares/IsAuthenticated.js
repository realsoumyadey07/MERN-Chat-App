import dotenv from "dotenv";
dotenv.config();
import { AsyncHandler } from "./AsyncHandler.js";
import jwt from "jsonwebtoken";

export const IsAuthenticated = AsyncHandler(async(req, res, next)=>{
    const access_token = req.cookies.access_token;
    if(!access_token) return next(res.status(400).json({
        success: false,
        message: "You are not authenticated to access this!"
    }));
    const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN);
    if(!decoded) return next(res.status(400).json({
        success: false,
        message: "The token is not authenticated!"
    }));
    req.user = decoded?.id;
    console.log(req?.user);
    next();
});