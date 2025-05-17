"use client";
import ConversationContainer from "@/components/shared/conversations/ConversationContainer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useEffect, useState, useRef } from "react";
import { LuVideo } from "react-icons/lu";
import { MdCall } from "react-icons/md";
import { MdEmojiEmotions } from "react-icons/md";
import { IoAttachOutline } from "react-icons/io5";
import { IoMic } from "react-icons/io5";
import { IoIosSend } from "react-icons/io";
import { getMyChatDetails, getMyMessages } from "@/redux/slices/chat.slice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_BASE_URL_SOCKET, {
  withCredentials: true,
});

export default function Page() {
  const [userMessage, setUserMessage] = useState("");
  const { conversationId: chatId } = useParams();
  const dispatch = useDispatch();
  const { messageData, myChatDetails, isLoading } = useSelector(
    (state) => state.chat
  );
  const { userData } = useSelector((state) => state.auth);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    dispatch(getMyChatDetails(chatId));
  }, [chatId, dispatch]);

  useEffect(() => {
    dispatch(getMyMessages(chatId));
  }, [chatId, dispatch]);

  // Listen for new messages via socket
  useEffect(() => {
    const handleNewMessage = (data) => {
      // Option 1: Fetch messages again from server
      dispatch(getMyMessages(chatId));
    };

    socket.on("NEW_MESSAGE", handleNewMessage);

    // Cleanup on unmount
    return () => {
      socket.off("NEW_MESSAGE", handleNewMessage);
    };
  }, [chatId, dispatch]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageData]);

  //send message
  const handleSendMessage = () => {
    if (!userMessage.trim()) return;
    const members = myChatDetails?.chat?.members;
    socket.emit("NEW_MESSAGE", { chatId, members, message: userMessage });
    setUserMessage("");
    dispatch(getMyMessages(chatId));
  };
  return (
    <ConversationContainer>
      <>
        <nav className="flex justify-between p-5">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src="/path-to-your-profile-image.jpg"
                alt="Profile"
              />
              <AvatarFallback>DP</AvatarFallback>
            </Avatar>
            <h1>
              {myChatDetails?.chat?.groupChat
                ? myChatDetails?.chat?.name
                : myChatDetails?.otherMember?.username}
            </h1>
          </div>
          <ul className="flex gap-4 justify-center items-center w-[8%]">
            <li>
              <LuVideo size={23} />
            </li>
            <li>
              <MdCall size={23} />
            </li>
          </ul>
        </nav>
        <main className="flex-1 p-4 overflow-y-auto no-scrollbar">
          {messageData &&
            messageData?.map((item, index) =>
              item.sender._id === userData?._id ? (
                <div key={index} className="flex justify-end my-2">
                  <span className="float-right bg-gray-200 dark:bg-blue-950 text-black dark:text-white py-1 px-2 rounded rounded-tr-none">
                    {item.content}
                  </span>
                </div>
              ) : (
                <div key={index} className="flex justify-start my-2">
                  <span className="bg-gray-200 dark:bg-blue-950 text-black dark:text-white py-1 px-2 rounded rounded-tl-none">
                    {item.content}
                  </span>
                </div>
              )
            )}
          <div ref={messagesEndRef} />
        </main>
        <footer className="flex gap-4 justify-between w-full px-4 py-2">
          <div className="flex gap-4 items-center cursor-pointer">
            <MdEmojiEmotions size={23} />
            <IoAttachOutline size={25} />
          </div>
          <input
            type="text"
            className="bg-transparent border-none w-[85%] focus:border-none focus:outline-none placeholder:text-gray-950 dark:placeholder:text-gray-500"
            placeholder="Type a message"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <div className="flex gap-3 items-center cursor-pointer">
            {userMessage.length > 0 ? (
              <IoIosSend size={25} onClick={handleSendMessage} />
            ) : (
              <IoMic size={25} />
            )}
          </div>
        </footer>
      </>
    </ConversationContainer>
  );
}
