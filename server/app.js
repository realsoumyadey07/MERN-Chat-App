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
import { createMessagesInAChat, createSingleChats, deleteAllChats } from "./seeders/chat.js";
import { createUser, deleteAllUsers } from "./seeders/user.js";
import { NEW_MESSAGE } from "./constants/events.js";

const port = process.env.PORT || 8000;
const app = express();
const server = createServer(app);
const io = new Server(server, {});
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());



app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);


io.on("connection", (socket)=> {
    console.log(`a user connected: ${socket.id}`);   
    const user = {
        _id: "bg48h",
        name: "soumya"
    }
    socket.on(NEW_MESSAGE, async ({chatId, numbers, message})=> {
        console.log("New message: ", data);
        const messageForRealtime = {
            _id: uuid(),
            content: message,
            sender: {
                _id: user._id,
                nsme: user.name
            },
            chat: chatId,
            createdAt: new Date().toISOString()
        }
        console.log("New Message: ", messageForRealtime);
        
    });
    socket.on("disconnect", ()=> {
        console.log("user disconnected!");
    })
})


server.listen(port, ()=> {
    console.log(`⚙ Server is running on port: ${port}`);
    connectDb();
});

// createUser(5);
// createSingleChats()
// createMessagesInAChat("67b9ce4e74c62ad7acafa4ad", 50);
// deleteAllChats();
// deleteAllUsers();