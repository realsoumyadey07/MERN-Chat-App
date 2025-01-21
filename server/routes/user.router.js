import express from "express";
import { 
    getProfile, 
    userLogin, 
    userLogout, 
    userRegistration, 
    searchUser, 
    refreshAccessToken 
} from "../controllers/user.controller.js";
import { IsAuthenticated } from "../middlewares/IsAuthenticated.js";

const userRouter = express.Router();

userRouter.post("/user-registration", userRegistration);
userRouter.post("/user-login", userLogin); 
userRouter.get("/user-logout", IsAuthenticated, userLogout);
userRouter.post("/refresh-token", refreshAccessToken);
userRouter.get("/get-user", IsAuthenticated, getProfile);
userRouter.get("/search-user", searchUser);

export default userRouter;