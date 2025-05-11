import dotenv from "dotenv";
dotenv.config();
import { AsyncHandler } from "./AsyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const IsAuthenticated = AsyncHandler(async (req, res, next) => {
  console.log("browser cookie: "+ req.cookies.access_token);
  console.log("bearer token: "+ req.header("Authorization"));
  try {
    const access_token =
      req.cookies.access_token ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!access_token)
      return res.status(401).json({
        success: false,
        message: "Token is not found. Please log in!",
      });
    const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN);
    console.log("decoded id is: "+ decoded?.id);
    
    const user = await User.findById(decoded?.id).select(
      "-password -refresh_token"
    );
    if (!user) return res.status(401).json({
        success: false,
        message: "Invalid access token!",
      });
    // req.user = user._id;
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "The token is not authenticated!",
    });
  }
});

export const socketAuthenticator = async (err, socket, next) => {
  try {
    if(err) {
      return next(err);
    }
    const access_token = socket.request.cookies.access_token;
    if(!access_token) {
      return next(res.status(401).json({
        success: false,
        message: "Token is not found. Please log in!",
      }))
    }
    const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN);
    console.log("decoded id is: "+ decoded?.id);
    const user = await User.findById(decoded?.id).select(
      "-password -refresh_token"
    );
    if(!user) {
      return next(res.status(401).json({
        success: false,
        message: "Invalid access token!"
      }))
    }
    socket.user = user;
    return next();
  } catch (error) {
    return next(new Error("Please login to access this route", 401));
  }
}

export const authorizeRole = (...roles)=> {
  return (req, res, next)=> {
    if(!roles.includes(req.user?.role || "")) {
      return next(res.status(400).json({
        success: false,
        message: `Role ${req.user?.role} is not allowed to access this resourses`
      }));
    }
    next();
  }
}