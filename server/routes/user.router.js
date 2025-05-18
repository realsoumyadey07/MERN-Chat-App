import express from "express";
import { 
    getProfile, 
    userLogin, 
    userLogout, 
    userRegistration, 
    searchUser, 
    refreshAccessToken, 
    sendFriendRequest,
    acceptFriendRequest,
    getMyFriends,
    getUserDetails,
    getAllRequests,
    searchUnknownUser,
    getAllUnknownUsers,
    getRequestsByName
} from "../controllers/user.controller.js";
import { IsAuthenticated } from "../middlewares/IsAuthenticated.js";
import { loginValidator, registerValidator, validateHandler } from "../lib/validator.js";

const userRouter = express.Router();

userRouter.post("/user-registration", registerValidator(), validateHandler, userRegistration);
userRouter.post("/user-login", loginValidator(), validateHandler, userLogin); 
userRouter.get("/user-logout", IsAuthenticated, userLogout);
userRouter.post("/refresh-token", refreshAccessToken);
userRouter.get("/get-profile", IsAuthenticated, getProfile);
userRouter.get("/search-user", IsAuthenticated, searchUser);
userRouter.get("/search-unknown-user", IsAuthenticated, searchUnknownUser);
userRouter.get("/get-all-unknown-users", IsAuthenticated, getAllUnknownUsers);
userRouter.post("/send-friendrequest", IsAuthenticated, sendFriendRequest);
userRouter.post("/accept-friendrequest", IsAuthenticated, acceptFriendRequest);
userRouter.get("/get-all-requests",IsAuthenticated , getAllRequests);
userRouter.get("/get-requests-by-name",IsAuthenticated , getRequestsByName);
userRouter.get("/get-friends",IsAuthenticated , getMyFriends);
userRouter.get("/get-user-details/:id", IsAuthenticated, getUserDetails);
// for testing
userRouter.get("/try", (req, res)=> {
    res.send("Ok tested!");
});

export default userRouter;