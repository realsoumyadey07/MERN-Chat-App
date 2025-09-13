import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import { connectDb } from "./utils/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import { v4 as uuid } from "uuid";

// Routers import
import userRouter from "./routes/user.router.js";
import chatRouter from "./routes/chat.router.js";
// import { createMessagesInAChat, createSingleChats, deleteAllChats } from "./seeders/chat.js";
import { createUser, deleteAllUsers } from "./seeders/user.js";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from "./constants/events.js";
import { getSockets } from "./lib/helper.js";
import { Message } from "./models/message.model.js";
import { socketAuthenticator } from "./middlewares/IsAuthenticated.js";
import { Chat } from "./models/chat.model.js";

const port = process.env.PORT || 8000;
const app = express();
const server = createServer(app);

// ---------------- CORS CONFIG ----------------
const allowedOrigins = [
  "http://localhost:3000",            // local dev frontend
  "https://your-frontend.vercel.app"  // production frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

// Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});
// ------------------------------------------------

app.set("io", io);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// user mapping with socketIds
export const socketUserIds = new Map();

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    serverRuning: true
  });
});

// Routers
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);

// Socket authentication
io.use((socket, next) => {
  cookieParser()(
    socket.request,
    {},
    async (err) => await socketAuthenticator(err, socket, next)
  );
});

// Socket events
io.on("connection", (socket) => {
  const user = socket.user;
  socketUserIds.set(user._id.toString(), socket.id);
  console.log(socketUserIds);
  console.log(`a user connected: ${socket.id}`);

  socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
    console.log("New message: ", message);

    const messageForRealtime = {
      _id: uuid(),
      content: message,
      sender: {
        _id: user._id,
        name: user.username
      },
      chat: chatId,
      createdAt: new Date().toISOString()
    };

    const messageForDB = {
      content: message,
      sender: user._id,
      chat: chatId
    };

    const membersSocket = getSockets(members);

    io.to(membersSocket).emit(NEW_MESSAGE, {
      chatId,
      message: messageForRealtime
    });

    io.to(membersSocket).emit(NEW_MESSAGE_ALERT, { chatId });

    console.log("New Message: ", messageForRealtime);

    try {
      const newMessage = await Message.create(messageForDB);
      await Chat.findByIdAndUpdate(chatId, {
        latest_message: newMessage._id,
        updatedAt: new Date()
      });
    } catch (error) {
      console.log("Error in creating message: ", error);
      throw new Error(error);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected!");
    socketUserIds.delete(user._id.toString());
  });
});

// Connect DB and start server
connectDb()
  .then(() => {
    server.listen(port, () => {
      console.log(`✅ Server is running on: ${port}`);
    });
  })
  .catch(err => {
    console.log("❌ DB connection failed:", err);
  });

// Seeder examples
// createUser(5);
// createSingleChats();
// createMessagesInAChat("67b9ce4e74c62ad7acafa4ad", 50);
// deleteAllChats();
// deleteAllUsers();
