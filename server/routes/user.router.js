import express from "express";
import { userLogin, userLogout, userRegistration } from "../controllers/user.controller.js";
import { IsAuthenticated } from "../middlewares/IsAuthenticated.js";

const userRouter = express.Router();

userRouter.post("/user-registration", userRegistration);
userRouter.post("/user-login", userLogin);
userRouter.get("/user-logout", IsAuthenticated, userLogout);

export default userRouter;