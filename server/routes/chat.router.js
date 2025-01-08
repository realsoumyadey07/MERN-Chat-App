import express from "express";
import { IsAuthenticated } from "../middlewares/IsAuthenticated.js";
import {
  addMember,
  getMyChat,
  getMyGroups,
  leaveGroup,
  newGroupChat,
  removeMember,
  sendAttachments,
} from "../controllers/chat.controller.js";
import { attchmentsMulter } from "../middlewares/Multer.js";

const chatRouter = express.Router();
chatRouter.use(IsAuthenticated);

chatRouter.post("/new", newGroupChat);
chatRouter.get("/get-my-chat", getMyChat);
chatRouter.get("/get-my-group", getMyGroups);
chatRouter.put("/add-member", addMember);
chatRouter.put("/remove-member", removeMember);
chatRouter.delete("/leave-chat/:id", leaveGroup);
chatRouter.post("/message", attchmentsMulter, sendAttachments);

// get messages

//get chat details, rename, delete

export default chatRouter;
