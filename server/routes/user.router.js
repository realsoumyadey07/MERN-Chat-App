import express from "express";
import { userLogin, userRegistration } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/user-registration", userRegistration);
userRouter.post("/user-login", userLogin);

export default userRouter;