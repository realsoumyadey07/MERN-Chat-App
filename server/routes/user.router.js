import express from "express";
import { 
    getProfile, 
    userLogin, 
    userLogout, 
    userRegistration, 
    searchUser, 
    refreshAccessToken, 
    sendFriendRequest,
    acceptFriendRequest,
    getAllNotifications
} from "../controllers/user.controller.js";
import { IsAuthenticated } from "../middlewares/IsAuthenticated.js";
import { loginValidator, registerValidator, validateHandler } from "../lib/validator.js";

const userRouter = express.Router();

userRouter.post("/user-registration", registerValidator(), validateHandler, userRegistration);
userRouter.post("/user-login", loginValidator(), validateHandler, userLogin); 
userRouter.get("/user-logout", IsAuthenticated, userLogout);
userRouter.post("/refresh-token", refreshAccessToken);
userRouter.get("/get-user", IsAuthenticated, getProfile);
userRouter.get("/search-user", IsAuthenticated, searchUser);
userRouter.post("/send-friendrequest", IsAuthenticated, sendFriendRequest);
userRouter.post("/accept-friendrequest", IsAuthenticated, acceptFriendRequest);
userRouter.get("/get-notifications",IsAuthenticated , getAllNotifications);

export default userRouter;