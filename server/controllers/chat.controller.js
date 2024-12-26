import { AsyncHandler } from "../middlewares/AsyncHandler.js";
import { Chat } from "../models/chat.model.js";
import { emitEvent } from "../utils/features.js";
import { ALERT, REFETCH_CHATS } from "../constants/events.js";

export const newGroupChat = AsyncHandler(async(req, res, next)=> {
     try {
          const {name, members} = req.body;
          if(!name){
               return next(res.status(400).json({
                    success: false,
                    message: "Name is required!"
               }));
          }
          if(members.length < 2){
               return next(res.status(400).json({
                    success: false,
                    message: "Group chat must have at least 3 members!"
               }));
          }
          const allMembers = [...members, req.user];
          await Chat.create({
               name,
               groupChat: true,
               creator: req.user,
               members: allMembers
          });
          emitEvent(req, ALERT, allMembers, `Welcome to ${name} group`);
          emitEvent(req, REFETCH_CHATS, members);
          return next(res.status(200).json({
               success: true,
               message: "Group created!"
          }));
     } catch (error) {
          return next(res.status(500).json({
               success: false,
               message: error.message
          }));
     }
});