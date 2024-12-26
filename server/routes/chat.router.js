import express from "express";
import { IsAuthenticated } from "../middlewares/IsAuthenticated.js";
import { newGroupChat } from "../controllers/chat.controller.js";

const chatRouter = express.Router();
chatRouter.use(IsAuthenticated);

chatRouter.post("/new", newGroupChat);

export default chatRouter;