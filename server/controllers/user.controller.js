import dotenv from "dotenv";
dotenv.config({
  path: "../.env",
});
import { AsyncHandler } from "../middlewares/AsyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { Chat } from "../models/chat.model.js";
import { Request } from "../models/request.model.js";
import { emitEvent } from "../utils/features.js";
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/events.js";

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
    if (!name)
      return res.status(400).json({
        success: false,
        message: "Search param is required!",
      });
    const chats = await Chat.find({
      groupChat: false,
      $or: [{ members: req.user }],
    });
    const allUsersOfMyChat = chats.flatMap((chat) => chat.members);
    const searchedUsers = await User.find({
      _id: { $in: allUsersOfMyChat },
      username: { $regex: name, $options: "i" },
    });
    const users = searchedUsers.map(({ _id, username }) => ({
      _id,
      username,
    }));
    if (users.length === 0)
      return res.status(400).json({
        message: "User not found!",
      });
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error!",
    });
  }
});

export const sendFriendRequest = AsyncHandler(async (req, res, next) => {
  try {
    const { receiverId } = req.body;
    if (!receiverId)
      return res.status(400).json({
        success: false,
        message: "Sender is required!",
      });
    const request = await Request.findOne({
      $or: [
        { sender: req.user, receiver: receiverId },
        { sender: receiverId, receiver: req.user },
      ],
    });
    if (request)
      return res.status(400).json({
        success: false,
        message: "Request already sent!",
      });
    emitEvent(req, NEW_REQUEST, [receiverId]);
    await Request.create({
      sender: req.user,
      receiver: receiverId,
    });
    return res.status(200).json({
      success: true,
      message: "Friend request sent!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.members || "Internal server error!",
    });
  }
});

export const acceptFriendRequest = AsyncHandler(async (req, res, next) => {
  try {
    const { requestId, accept } = req.body;
    if (!requestId)
      return res.status(404).json({
        success: false,
        message: "RequestId is required!",
      });
    if (!accept)
      return res.status(400).json({
        success: false,
        message: "provide accept or reject!",
      });
    const request = await Request.findById(requestId)
      .populate("sender", "username")
      .populate("receiver", "username");
    if (!request)
      return res.status(400).json({
        success: false,
        message: "request not found!",
      });
    if (request.receiver.toString() === req.user.toString())
      return res.status(400).json({
        success: false,
        message: "Cannot accept request from your own account!",
      });
    if (accept === false) {
      await request.deleteOne();
      return res.status(200).json({
        success: true,
        message: "Friend request rejected!",
      });
    }
    const members = [request.receiver._id, request.sender._id];
    await Promise.all([
      Chat.create({
        members,
        name: `${request.sender.username} - ${request.receiver.name}`,
      }),
      request.deleteOne(),
    ]);
    emitEvent(req, REFETCH_CHATS, members);
    return res.status(200).json({
      success: true,
      message: "Friend request accepted!",
      senderId: request.sender._id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error!",
    });
  }
});

export const getAllNotifications = AsyncHandler(async (req, res, next) => {
  try {
    console.log(req.user);
    
    const requests = await Request.find({ receiver: req.user }).populate(
      "sender",
      "username"
    );
    console.log(requests);
    
    if (requests.length < 1) {
      return res.status(200).json({
        success: true,
        requests: [],
        message: "No new requests",
      });
    }
    const allRequests = requests.map(({ _id, sender }) => ({
      _id,
      sender: {
        _id: sender._id,
        username: sender.username,
      },
    }));
    return res.status(200).json({
      success: true,
      requests: allRequests,
      message: "All new requests",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error!",
    });
  }
});

export const getMyFriends = AsyncHandler(async(req, res, next)=> {
  try {
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal; server error!"
    });
  }
})