import dotenv from "dotenv";
dotenv.config({
    path: "./.env"
});
import express from "express";
import { connectDb } from "./utils/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Server } from "socket.io";
import {createServer} from "http";
import {v4 as uuid} from "uuid";

// Routers import
import userRouter from "./routes/user.router.js";
import chatRouter from "./routes/chat.router.js";
// import { createMessagesInAChat, createSingleChats, deleteAllChats } from "./seeders/chat.js";
// import { createUser, deleteAllUsers } from "./seeders/user.js";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from "./constants/events.js";
import { getSockets } from "./lib/helper.js";
import { Message } from "./models/message.model.js";
import { socketAuthenticator } from "./middlewares/IsAuthenticated.js";

const port = process.env.PORT || 8000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["https://mern-chat-app-six-orpin.vercel.app", "http://localhost:3000"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
});

app.set("io", io);
app.use(cors({
    origin: ["https://mern-chat-app-six-orpin.vercel.app", "http://localhost:3000"],
    credentials: true
}));
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

//user mapping with socketIds
export const socketUserIds = new Map();

app.get("/", (req, res)=> {
    res.status(200).json({
        success: true,
        serverRuning: true
    });
});
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);


io.use((socket, next)=> {
    cookieParser()(
        socket.request,
        socket.request.res,
        async (err) => await socketAuthenticator(err, socket, next)
    );
})

io.on("connection", (socket)=> {
    const user = socket.user;
    socketUserIds.set(user._id.toString(), socket.id);
    console.log(socketUserIds);
    console.log(`a user connected: ${socket.id}`);   
    socket.on(NEW_MESSAGE, async ({chatId, members, message}) => {
        console.log("New message: ", message);
        const messageForRealtime = {
            _id: uuid,
            content: message,
            sender: {
                _id: user._id,
                name: user.username
            },
            chat: chatId,
            createdAt: new Date().toISOString()
        }
        const messageForDB = {
            content: message,
            sender: user._id,
            chat: chatId
        }
        const membersSocket = getSockets(members);
        io.to(membersSocket).emit(NEW_MESSAGE, {
            chatId,
            message: messageForRealtime
        });
        io.to(membersSocket).emit(NEW_MESSAGE_ALERT, { chatId });

        console.log("New Message: ", messageForRealtime);
        try {
            await Message.create(messageForDB);
        } catch (error) {
            console.log("Error in creating message: ", error);
            throw new Error(error);
        }
    });
    socket.on("disconnect", () => {
        console.log("user disconnected!");
        socketUserIds.delete(user._id.toString());
    })
});


server.listen(port, ()=> {
    console.log(`⚙ Server is running on port: ${port}`);
    connectDb();
});

export default app;

// createUser(5);
// createSingleChats();
// createMessagesInAChat("67b9ce4e74c62ad7acafa4ad", 50);
// deleteAllChats();
// deleteAllUsers();