import express from "express";
import { IsAuthenticated } from "../middlewares/IsAuthenticated.js";
import { addMember, getMyChat, getMyGroups, newGroupChat } from "../controllers/chat.controller.js";

const chatRouter = express.Router();
chatRouter.use(IsAuthenticated);

chatRouter.post("/new", newGroupChat);
chatRouter.get("/get-my-chat", getMyChat);
chatRouter.get("/get-my-group", getMyGroups);
chatRouter.put("/add-member", addMember);

export default chatRouter;