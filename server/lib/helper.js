import { socketUserIds } from "../server.js";

export const getOtherMember = (members, userId) => {
     return members.find((member)=> member._id.toString() !== userId.toString());
}

export const getSockets = (users=[]) => {
     const sockets = users.map((user)=> socketUserIds.get(user._id.toString()));
     return sockets;
}