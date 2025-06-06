import { faker, simpleFaker } from "@faker-js/faker";
import { User } from "../models/user.model.js";
import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";

const createSingleChats = async () => {
  try {
    const users = await User.find().select("_id");

    if (users.length < 2) {
      console.log("Not enough users to create chats");
      process.exit();
    }

    const chats = [];

    for (let i = 0; i < users.length; i++) {
      for (let j = i + 1; j < users.length; j++) {
        const existingChat = await Chat.findOne({
          members: { $all: [users[i]._id, users[j]._id] },
        });

        if (!existingChat) {
          chats.push({
            members: [users[i]._id, users[j]._id].sort((a, b) =>
              a.toString().localeCompare(b.toString())
            ),
          });
        }
      }
    }

    if (chats.length > 0) {
      await Chat.insertMany(chats);
      console.log("Chats created successfully");
    } else {
      console.log("No new chats to create");
    }
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const createGroupChats = async (numChats) => {
  try {
    const users = await User.find().select("_id");

    const chatsPromise = [];

    for (let i = 0; i < numChats; i++) {
      const numMembers = simpleFaker.number.int({ min: 3, max: users.length });
      const members = [];

      for (let i = 0; i < numMembers; i++) {
        const randomIndex = Math.floor(Math.random() * users.length);
        const randomUser = users[randomIndex];

        // Ensure the same user is not added twice
        if (!members.includes(randomUser)) {
          members.push(randomUser);
        }
      }

      const chat = Chat.create({
        groupChat: true,
        name: faker.lorem.words(1),
        members,
        creator: members[0],
      });

      chatsPromise.push(chat);
    }

    await Promise.all(chatsPromise);

    console.log("Chats created successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const createMessages = async (numMessages) => {
  try {
    const users = await User.find().select("_id");
    const chats = await Chat.find().select("_id");

    const messagesPromise = [];

    for (let i = 0; i < numMessages; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomChat = chats[Math.floor(Math.random() * chats.length)];

      messagesPromise.push(
        Message.create({
          chat: randomChat,
          sender: randomUser,
          content: faker.lorem.sentence(),
        })
      );
    }

    await Promise.all(messagesPromise);

    console.log("Messages created successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const createMessagesInAChat = async (chatId, numMessages) => {
  try {
    const users = await User.find().select("_id");

    const messagesPromise = [];

    for (let i = 0; i < numMessages; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];

      messagesPromise.push(
        Message.create({
          chat: chatId,
          sender: randomUser,
          content: faker.lorem.sentence(),
        })
      );
    }

    await Promise.all(messagesPromise);

    console.log("Messages created successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const deleteAllChats = async () => {
  try {
    await Chat.deleteMany({});
    console.log("all data deleted!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export {
  createGroupChats,
  createMessages,
  createMessagesInAChat,
  createSingleChats,
  deleteAllChats,
};
