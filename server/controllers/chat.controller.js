import { AsyncHandler } from "../middlewares/AsyncHandler.js";
import { Chat } from "../models/chat.model.js";
import { emitEvent } from "../utils/features.js";
import {
  ALERT,
  NEW_ATTACHMENT,
  NEW_MESSAGE_ALERT,
  REFETCH_CHATS,
} from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";
import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";

export const newGroupChat = AsyncHandler(async (req, res, next) => {
  try {
    const { name, members } = req.body;
    if (!name) {
      return next(
        res.status(400).json({
          success: false,
          message: "Name is required!",
        })
      );
    }
    if (members.length < 2) {
      return next(
        res.status(400).json({
          success: false,
          message: "Group chat must have at least 3 members!",
        })
      );
    }
    const allMembers = [...members, req.user];
    await Chat.create({
      name,
      groupChat: true,
      creator: req.user,
      members: allMembers,
    });
    emitEvent(req, ALERT, allMembers, `Welcome to ${name} group`);
    emitEvent(req, REFETCH_CHATS, members);
    return next(
      res.status(200).json({
        success: true,
        message: "Group created!",
      })
    );
  } catch (error) {
    return next(
      res.status(500).json({
        success: false,
        message: error.message,
      })
    );
  }
});

export const getMyChat = AsyncHandler(async (req, res, next) => {
  try {
    const chats = await Chat.find({ members: req.user }).populate(
      "members",
      "username"
    );
    const transeformedChats = chats.map(({ _id, name, members, groupChat }) => {
      const otherMember = getOtherMember(members, req.user);
      return {
        _id,
        name: groupChat ? name : otherMember.name,
        groupChat,
        members: members.reduce((prev, curr) => {
          if (curr._id.toString() !== req.user.toString()) {
            prev.push(curr._id);
          }
          return prev;
        }, []),
      };
    });
    return next(
      res.status(200).json({
        success: true,
        chats: transeformedChats,
      })
    );
  } catch (error) {
    return next(
      res.status(500).json({
        success: false,
        message: error.message,
      })
    );
  }
});

export const getMyGroups = AsyncHandler(async (req, res, next) => {
  try {
    const chats = await Chat.find({
      members: req.user,
      groupChat: true,
      creator: req.user,
    }).populate("members", "username");
    const groups = chats.map(({ members, _id, groupChat, name }) => ({
      _id,
      name,
      groupChat,
    }));
    return next(
      res.status(200).json({
        success: true,
        groups,
      })
    );
  } catch (error) {
    return next(
      res.status(500).json({
        success: false,
        message: error.message,
      })
    );
  }
});

export const addMember = AsyncHandler(async (req, res, next) => {
  try {
    const { chatId, members } = req.body;
    if (!chatId)
      return next(
        res.status(400).json({
          success: false,
          message: "Chat Id is required!",
        })
      );
    if (!members)
      return next(
        res.status(400).json({
          success: false,
          message: "At least one member is required!",
        })
      );
    const chat = await Chat.findById(chatId);
    if (!chat)
      return next(
        res.status(400).json({
          success: false,
          message: "Chat not found!",
        })
      );
    if (!chat.groupChat)
      return next(
        res.status(400).json({
          success: false,
          message: "This is not a group chat!",
        })
      );
    if (chat.creator.toString() !== req.user.toString())
      return next(
        res.status(400).json({
          success: false,
          message: "You are not allowed to add member!",
        })
      );

    const allNewMembersPromise = [
      ...new Set(members.map((i) => User.findById(i, "username"))),
    ];
    const allNewMembers = await Promise.all(allNewMembersPromise);
    chat.members.push(...allNewMembers.map((i) => i._id));
    if (chat.members.length > 100) {
      return next(
        res.status(400).json({
          success: false,
          message: "Group chat can have a maximum of 100 members!",
        })
      );
    }
    await chat.save();
    const allUserName = allNewMembers.map((i) => i.name).join(", ");
    emitEvent(
      req,
      ALERT,
      chat.members,
      `${allUserName} have been added in the group`
    );
    return next(
      res.status(200).json({
        success: true,
        chat,
      })
    );
  } catch (error) {
    return next(
      res.status(500).json({
        success: false,
        message: error.message,
      })
    );
  }
});

export const removeMember = AsyncHandler(async (req, res, next) => {
  try {
    const { userId, chatId } = req.body;
    if (!chatId || !userId) {
      return next(
        res.status(400).json({
          success: false,
          message: "Chat Id and User Id are required!",
        })
      );
    }
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return next(
        res.status(400).json({
          success: false,
          message: "Chat not found!",
        })
      );
    }
    if (!chat.groupChat) {
      return next(
        res.status(400).json({
          success: false,
          message: "This is not a group chat!",
        })
      );
    }
    if (chat.creator.toString() !== req.user.toString()) {
      return next(
        res.status(400).json({
          success: false,
          message: "You are not allowed to remove member!",
        })
      );
    }
    if (chat.members.length <= 3) {
      return next(
        res.status(400).json({
          success: false,
          message: "Group chat must have at least 3 members!",
        })
      );
    }
    chat.members = chat.members.filter(
      (member) => member.toString() !== userId.toString()
    );
    await chat.save();
    emitEvent(
      req,
      ALERT,
      chat.members,
      `${req.user.name} has been removed from the group`
    );
    emitEvent(req, REFETCH_CHATS, chat.members);
    return next(
      res.status(200).json({
        success: true,
        chat,
      })
    );
  } catch (error) {
    return next(
      res.status(500).json({
        success: false,
        message: error.message,
      })
    );
  }
});

export const leaveGroup = AsyncHandler(async (req, res, next) => {
  try {
    const chatId = req.params.id;
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return next(
        res.status(404).json({
          success: false,
          message: "Chat not found!",
        })
      );
    }
    if (!chat.groupChat) {
      return next(
        res.status(400).json({
          success: false,
          message: "This is not a group chat!",
        })
      );
    }
    const remainingMambers = chat.members.filter(
      (member) => member.toString() !== req.user.toString()
    );
    if (chat.creator.toString() === req.user.toString()) {
      const randomElement = Math.floor(Math.random() * remainingMambers.length);
      const newCreator = remainingMambers[randomElement];
      chat.creator = newCreator;
    }
    chat.members = remainingMambers;
    const [user] = await Promise.all([
      User.findById(req.user, "username"),
      chat.save(),
    ]);
    emitEvent(req, ALERT, chat.members, `${user} has left the group`);
    return next(
      res.status(200).json({
        success: true,
        message: "Member removed successfully!",
      })
    );
  } catch (error) {
    return next(
      res.status(500).json({
        success: false,
        message: error.message,
      })
    );
  }
});

export const sendAttachments = AsyncHandler(async (req, res, next) => {
  try {
    const { chatId } = req.body;
    const [chat, me] = await Promise.all([
      Chat.findById(chatId),
      User.findById(req.user, "username"),
    ]);
    if (!chat)
      return next(
        res.status(400).json({
          success: false,
          message: "Chat not found!",
        })
      );
    const files = req.files || [];
    if (files.length < 1) {
      return next(
        res.status(400).json({
          success: false,
          message: "No attachments found!",
        })
      );
    }
    // Upload files here
    const attachments = [];

    const messageForDB = {
      content: "",
      attachments,
      sender: me._id,
      chat: chatId,
    };
    const messageForRealTime = {
      ...messageForDB,
      sender: {
        _id: me._id,
        name: me.name,
      },
    };
    const message = await Message.create(messageForDB);
    emitEvent(req, NEW_ATTACHMENT, chat.members, {
      message: messageForRealTime,
      chatId,
    });
    emitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId });
    return next(
      res.status(200).json({
        success: true,
        message,
      })
    );
  } catch (error) {
    return next(
      res.status(500).json({
        success: false,
        message: error.message,
      })
    );
  }
});

export const getChatDetails = AsyncHandler(async (req, res, next) => {
  try {
    if (req.query.populate === "true") {
      const chat = await Chat.findById(req.params.id)
        .populate("members", "username")
        .lean();
      if (!chat)
        return next(
          res.status(404).json({
            success: false,
            message: "Chat not found",
          })
        );
      chat.members = chat.members.map(({ _id, username }) => ({
        _id,
        username,
      }));
      return next(
        res.status(200).json({
          success: true,
          chat,
        })
      );
    } else {
      const chat = await Chat.findById(req.params.id);
      if (!chat)
        return next(
          res.status(404).json({
            success: false,
            message: "Chat not found",
          })
        );
      return next(
        res.status(200).json({
          success: true,
          chat,
        })
      );
    }
  } catch (error) {
    return next(
      res.status(500).json({
        success: false,
        message: error.message,
      })
    );
  }
});

export const renameGroup = AsyncHandler(async (req, res, next) => {
  try {
    const chatId = req.params.id;
    const { newName } = req.body;
    if ([chatId, newName].some((field) => field?.trim() === "")) {
      return next(
        res.status(400).json({
          success: false,
          message: "Chat Id and new name are required!",
        })
      );
    }
    const chat = await Chat.findById(chatId);
    if (!chat)
      return next(
        res.status(404).json({
          success: false,
          message: "Chat not found!",
        })
      );
    if (!chat.groupChat) {
      return next(
        res.status(400).json({
          success: false,
          message: "This is not a group chat!",
        })
      );
    }
    if (chat.creator.toString() !== req.user.toString())
      return next(
        res.status(400).json({
          success: false,
          message: "You are not allowed to rename this chat!",
        })
      );
    chat.name = newName;
    chat.save();
    emitEvent(req, REFETCH_CHATS, chat.members);
    return next(
      res.status(200).json({
        success: true,
        message: "Chat name has been updated successfully!",
      })
    );
  } catch (error) {
    return next(
      response.status(500).json({
        success: false,
        message: error.message,
      })
    );
  }
});

export const deleteGroup = AsyncHandler(async (req, res, next) => {
  try {
    const groupId = req.params.groupId;
    if (!groupId)
      return next(
        res.status(404).json({
          success: false,
          message: "Group Id is required!",
        })
      );
    const chat = await Chat.findById(groupId);
    if (!chat)
      return next(
        res.status(404).json({
          success: false,
          message: "Chat not found!",
        })
      );
    const members = await chat.members;
    if (chat.groupChat && chat.creator.toString() !== req.user.toString())
      return next(
        res.status(400).json({
          success: false,
          message: "You are not allowed to delete this group!",
        })
      );
  } catch (error) {
    return next(
      res.status(500).json({
        success: false,
        message: error.message,
      })
    );
  }
});
