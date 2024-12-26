import { AsyncHandler } from "../middlewares/AsyncHandler.js";
import { Chat } from "../models/chat.model.js";
import { emitEvent } from "../utils/features.js";
import { ALERT } from "../constants/events.js";

export const newGroupChat = AsyncHandler(async(requestAnimationFrame, resizeBy, next)=> {
     try {
          const {name, members} = req.body;
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
          const emitEvent = async(req, ALERT)=> {

          }
     } catch (error) {
          
     }
});