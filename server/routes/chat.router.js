import express from "express";
import { IsAuthenticated } from "../middlewares/IsAuthenticated.js";

const chatRouter = express.Router();

chatRouter.use(IsAuthenticated);

export default chatRouter;