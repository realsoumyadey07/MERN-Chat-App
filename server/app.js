import dotenv from "dotenv";
dotenv.config({
    path: "./.env"
});
import express from "express";
import { connectDb } from "./utils/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

// Routers import
import userRouter from "./routes/user.router.js";
import chatRouter from "./routes/chat.router.js";
import { createMessagesInAChat, createSingleChats } from "./seeders/chat.js";
import { createUser } from "./seeders/user.js";

const port = process.env.PORT || 8000;
const app = express();
app.use(cors({
    origin: "http://192.168.1.6:8081",
    credentials: true
}));
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());



app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);



app.listen(port, ()=> {
    console.log(`⚙ Server is running on port: ${port}`);
    connectDb();
});

// createUser(10);
// createSingleChats()
// createMessagesInAChat("67b9ce4e74c62ad7acafa4ad", 50);