"use client";
import ConversationContainer from "@/components/shared/conversations/ConversationContainer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getMyChatDetails, getMyGroups, getMyMessages } from "@/redux/slices/chat.slice";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoIosSend } from "react-icons/io";
import { IoAttachOutline, IoMic } from "react-icons/io5";
import { LuVideo } from "react-icons/lu";
import { MdCall, MdEmojiEmotions } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_BASE_URL_SOCKET, {
  withCredentials: true
});

export default function Page() {
  const [userMessage, setUserMessage] = useState("");
  const { groupId } = useParams();
  const { myChatDetails, messageData } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMyChatDetails(groupId));
    dispatch(getMyMessages(groupId));
  }, [groupId, dispatch]);

  useEffect(()=> {
    const handleNewMessage = () => {
      dispatch(getMyMessages(groupId));
    }
    socket.on("NEW_MESSAGE", handleNewMessage);
    return ()=> {
      socket.off("NEW_MESSGAE", handleNewMessage);
    }
  },[dispatch, groupId]);

  const messagesEndRef = useRef(null);
  useEffect(()=> {
    if(messagesEndRef.current){
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth"
      })
    }
  }, [messageData]);

  //user data
  const { userData } = useSelector((state) => state.auth);

  //handle send message
  const handleSendMessage = () => {
    if(!userMessage.trim()) return;
    const members = myChatDetails?.chat?.members;
    socket.emit("NEW_MESSAGE", {
      chatId: groupId,
      members,
      message: userMessage
    });
    setUserMessage("");
    dispatch(getMyMessages(groupId));
    dispatch(getMyGroups());
  }
  return (
    <ConversationContainer>
      <nav className="flex justify-between p-5">
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            {/* <AvatarImage src="/path-to-your-profile-image.jpg" alt="Profile" /> */}
            <AvatarFallback>{myChatDetails?.chat?.name?.charAt(0).toUpperCase()}</AvatarFallback>
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
      <main className="flex-1 p-4 overflow-y-auto no-scrollbar">
        {messageData &&
          messageData?.map((item, index) =>
            item.sender._id === userData?._id ? (
              <div key={index} className="flex justify-end my-2">
                <span className="float-right bg-gray-200 dark:bg-blue-950 text-black dark:text-white py-1 px-2 rounded rounded-tr-none lg:max-w-[400px] md:max-w-[300px] max-w-[200px]">
                  {item.content}
                </span>
              </div>
            ) : (
              <div key={index} className="flex justify-start my-2">
                <span className="bg-gray-200 dark:bg-blue-950 text-black dark:text-white py-1 px-2 rounded rounded-tl-none lg:max-w-[400px] md:max-w-[300px] max-w-[200px]">
                  {item.content}
                </span>
              </div>
            )
          )}
          <div ref={messagesEndRef} />
      </main>
      <footer className="flex gap-4 justify-between w-full px-4 py-2">
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
              handleSendMessage();
            }
          }}
        />
        <div className="flex gap-3 items-center cursor-pointer">
          {userMessage.length > 0 ? (
            <IoIosSend
              onClick={handleSendMessage}
              size={25}
            />
          ) : (
            <IoMic size={25} />
          )}
        </div>
      </footer>
    </ConversationContainer>
  );
}
