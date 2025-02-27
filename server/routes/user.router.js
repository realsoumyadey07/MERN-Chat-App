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
import { loginValidator, registerValidator, validateHandler } from "../lib/validator.js";

const userRouter = express.Router();

userRouter.post("/user-registration", registerValidator(), validateHandler, userRegistration);
userRouter.post("/user-login", loginValidator(), validateHandler, userLogin); 
userRouter.get("/user-logout", IsAuthenticated, userLogout);
userRouter.post("/refresh-token", refreshAccessToken);
userRouter.get("/get-user", IsAuthenticated, getProfile);
userRouter.get("/search-user", IsAuthenticated, searchUser);

export default userRouter;