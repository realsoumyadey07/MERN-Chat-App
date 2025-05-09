"use client";
import ConversationContainer from "@/components/shared/conversations/ConversationContainer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useEffect, useState } from "react";
import { LuVideo } from "react-icons/lu";
import { MdCall } from "react-icons/md";
import { MdEmojiEmotions } from "react-icons/md";
import { IoAttachOutline } from "react-icons/io5";
import { IoMic } from "react-icons/io5";
import { IoIosSend } from "react-icons/io";
import { getMyChatDetails } from "@/redux/slices/chat.slice";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useParams } from "next/navigation";

export default function page() {
  const [message, setMessage] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const { conversationId } = useParams();
  const dispatch = useDispatch();
  const { myChatDetails, isLoading } = useSelector(
    (state) => state.chat
  );
  useEffect(() => {
    dispatch(getMyChatDetails(conversationId));
  }, [conversationId]);
  return (
    <ConversationContainer>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
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
          <main className="flex-1 p-4">
            <div>
              <span className="bg-gray-200 dark:bg-blue-950 text-black dark:text-white py-1 px-2 rounded">
                Hi this is soumya
              </span>
            </div>
            {message?.map((item, index) => (
              <div key={index} className="flex justify-end my-2">
                <span className="float-right bg-gray-200 dark:bg-blue-950 text-black dark:text-white py-1 px-2 rounded">
                  {item}
                </span>
              </div>
            ))}
          </main>
          <footer className="flex gap-4 justify-between w-full p-4 mb-16 lg:mb-0">
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
                  setMessage([...message, userMessage]);
                  setUserMessage("");
                }
              }}
            />
            <div className="flex gap-3 items-center cursor-pointer">
              {userMessage.length > 0 ? (
                <IoIosSend
                  size={25}
                  onClick={() => {
                    setMessage([...message, userMessage]);
                    setUserMessage("");
                  }}
                />
              ) : (
                <IoMic size={25} />
              )}
            </div>
          </footer>
        </>
      )}
    </ConversationContainer>
  );
}
