import dotenv from "dotenv";
dotenv.config({
  path: "../.env",
});
import { AsyncHandler } from "../middlewares/AsyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { Chat } from "../models/chat.model.js";

export const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const access_token = await user.signAccessToken();
    const refresh_token = await user.signRefreshToken();
    user.refresh_token = refresh_token;
    await user.save({
      validateBeforeSave: false,
    });
    return {
      access_token,
      refresh_token,
    };
  } catch (error) {
    throw new Error(
      error.message ||
        "something went wrong while generating access and refresh token!"
    );
  }
};

export const userRegistration = AsyncHandler(async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if ([email, username, password].some((field) => field?.trim() === "")) {
      return res.status(400).json({
        success: false,
        message: "Three fiels are required!",
      });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists!",
      });
    }
    const user = await User.create({ email, username, password });
    const createdUser = await User.findById(user._id).select(
      "-password -refresh_token"
    );
    if (!createdUser)
      return res.status(400).json({
        success: false,
        message: "Something went wrong while registering user!",
      });
    return res.status(200).json({
      success: true,
      user: createdUser,
      message: "User successfully created!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export const userLogin = AsyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    if ([email, password].some((field) => field?.trim() === "")) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email is not correct!",
      });
    }
    const isMatched = await user.comparePassword(password);
    if (!isMatched) {
      return res.status(400).json({
        success: false,
        message: "Password is not corrent!",
      });
    }
    const { access_token, refresh_token } = await generateAccessAndRefreshToken(
      user._id
    );

    const loggedinUser = await User.findById(user._id).select(
      "-password -refresh_token"
    );
    const cookiesOption = {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    };
    return res
      .status(200)
      .cookie("access_token", access_token, cookiesOption)
      .cookie("refresh_token", refresh_token, cookiesOption)
      .json({
        success: true,
        user: loggedinUser,
        access_token,
        refresh_token,
        message: "User logged in successfully!",
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export const userLogout = AsyncHandler(async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user,
      {
        $unset: {
          refresh_token: 1,
        },
      },
      { new: true }
    );
    const cookiesOption = {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    };
    return res
      .status(200)
      .clearCookie("access_token", cookiesOption)
      .clearCookie("refresh_token", cookiesOption)
      .json({
        success: true,
        message: "User logout successfully!",
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export const refreshAccessToken = AsyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookie.refresh_token;
  if (!incomingRefreshToken)
    return res.status(400).json({
      success: false,
      message: "unauthorized access!",
    });
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN
    );
    const user = await User.findById(decodedToken?._id);
    if (!user)
      return res.status(400).json({
        success: false,
        message: "invalid refresh token!",
      });
    if (incomingRefreshToken !== user?.refresh_token)
      return res.status(400).json({
        success: false,
        message: "refresh token is expired or used!",
      });
    const cookiesOption = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };
    const { access_token, refresh_token } = await generateAccessAndRefreshToken(
      user._id
    );
    return res
      .status(200)
      .cookie("access_token", access_token, cookiesOption)
      .cookie("refresh_token", refresh_token, cookiesOption)
      .json({
        success: true,
        tokens: {
          access_token,
          refresh_token,
        },
        message: "Access token refreshed successfully!",
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error!",
    });
  }
});

export const getProfile = AsyncHandler(async (req, res) => {
  try {
    const user_id = req.user;
    const user = await User.findById({ _id: user_id }).select(
      "-password -refresh_token"
    );
    if (!user)
      return res.status(400).json({
        success: false,
        message: "Something went wrong!",
      });
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error!",
    });
  }
});

export const searchUser = AsyncHandler(async (req, res, next) => {
  try {
    const { name } = req.query;
    const myChats = await Chat.find({
      groupChat: false,
      members: req.user,
    });
    const allUsersFromMyChats = myChats.flatMap((chat) => chat.members);
    const allMemberAcceptMe = await User.find({
      _id: {
        $nin: allUsersFromMyChats,
      },
      username: {
        $regex: name,
        $options: "i",
      },
    });
    const users = allMemberAcceptMe.map(({ _id, name }) => ({
      _id,
      name,
    }));
    res.status(200).json({
      success: true,
      users ,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error!",
    });
  }
});
