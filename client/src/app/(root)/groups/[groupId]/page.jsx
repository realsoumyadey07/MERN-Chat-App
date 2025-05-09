"use client";
import LoadingSpinner from "@/components/LoadingSpinner";
import ConversationContainer from "@/components/shared/conversations/ConversationContainer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getMyChatDetails } from "@/redux/slices/chat.slice";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosSend } from "react-icons/io";
import { IoAttachOutline, IoMic } from "react-icons/io5";
import { LuVideo } from "react-icons/lu";
import { MdCall, MdEmojiEmotions } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

export default function page() {
  const [message, setMessage] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const { groupId } = useParams();
  const { myChatDetails, isLoading } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMyChatDetails(groupId));
  }, [groupId]);
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
              <h1>{myChatDetails?.chat?.name}</h1>
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
            <div className="flex gap-4 items-center">
              <MdEmojiEmotions size={23} />
              <IoAttachOutline size={25} />
            </div>
            <input
              type="text"
              className="bg-transparent border-none w-[85%] focus:border-none focus:outline-none"
              placeholder="Type your message here"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setMessage((prev) => [...prev, userMessage]);
                  setUserMessage("");
                }
              }}
            />
            <div className="flex gap-3 items-center cursor-pointer">
              {userMessage.length > 0 ? (
                <IoIosSend
                  onClick={() => {
                    setMessage([...message, userMessage]);
                    setUserMessage("");
                  }}
                  size={25}
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
