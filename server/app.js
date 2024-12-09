import dotenv from "dotenv";
dotenv.config();
import express from "express";
import userRouter from "./routes/user.router.js";
import { connectDb } from "./utils/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const port = process.env.PORT || 8000;
const app = express();
app.use(express.json({limit: "50mb"}));
app.use(cookieParser());
app.use(cors({
    origin: process.env.ORIGIN
}));

app.use("/api/user", userRouter);



app.listen(port, ()=> {
    console.log(`Server is running on port: ${port}`);
    connectDb();
})