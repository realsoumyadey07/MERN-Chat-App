import dotenv from "dotenv";
dotenv.config();
import { AsyncHandler } from "./AsyncHandler.js";
import jwt from "jsonwebtoken";

export const IsAuthenticated = AsyncHandler(async (req, res, next) => {
  try {
    const access_token = req.cookies.access_token;
    if (!access_token)
      return next(
        res.status(400).json({
          success: false,
          message: "Token is not found. Please log in!",
        })
      );
    const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN);

    req.user = decoded?.id;
    console.log(req?.user);
    next();
  } catch (error) {
    if (!decoded)
      return next(
        res.status(500).json({
          success: false,
          message: "The token is not authenticated!",
        })
      );
  }
});
