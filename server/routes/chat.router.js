import express from "express";
import { IsAuthenticated } from "../middlewares/IsAuthenticated.js";
import {
  addMember,
  deleteGroup,
  getChatDetails,
  getMessages,
  getMyChat,
  getMyChatByName,
  getMyGroupByName,
  getMyGroups,
  leaveGroup,
  newGroupChat,
  removeMember,
  renameGroup,
  sendAttachments,
} from "../controllers/chat.controller.js";
import { attchmentsMulter } from "../middlewares/Multer.js";


const chatRouter = express.Router();
chatRouter.use(IsAuthenticated);

chatRouter.post("/new-group-chat", newGroupChat);
chatRouter.get("/get-my-chat", getMyChat);
chatRouter.get("/get-my-chat-by-name", getMyChatByName);
chatRouter.get("/get-my-group", getMyGroups);
chatRouter.get("/get-my-group-by-name", getMyGroupByName);
chatRouter.put("/add-member", addMember);
chatRouter.put("/remove-member", removeMember);
chatRouter.delete("/leave-chat/:id", leaveGroup);
chatRouter.post("/message", attchmentsMulter, sendAttachments);

// get messages
chatRouter.get("/message/:id", getMessages);

//get chat details, rename, delete
chatRouter.route("/:id").get(getChatDetails).put(renameGroup).delete(deleteGroup);

export default chatRouter;
