"use client";
import ConversationContainer from "@/components/shared/conversations/ConversationContainer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import React, { useEffect, useState, useRef } from "react";
import { LuVideo } from "react-icons/lu";
import { MdCall } from "react-icons/md";
import { MdEmojiEmotions } from "react-icons/md";
import { IoAttachOutline } from "react-icons/io5";
import { IoMic } from "react-icons/io5";
import { IoIosSend } from "react-icons/io";
import {
  deleteGroup,
  getMyChatDetails,
  getMyChats,
  getMyMessages,
  renameGroup,
} from "@/redux/slices/chat.slice";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { io } from "socket.io-client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Pencil, ShieldCheck, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const socket = io(process.env.NEXT_PUBLIC_BASE_URL_SOCKET, {
  withCredentials: true,
});

export default function Page() {
  const [userMessage, setUserMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedGrpName, setEditedGrpName] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [openDeleteGrpModal, setOpenDeleteGrpModal] = useState(false);
  const { conversationId: chatId } = useParams();
  const dispatch = useDispatch();
  const { messageData, myChatDetails, isLoading } = useSelector(
    (state) => state.chat
  );
  const { userData } = useSelector((state) => state.auth);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();

  console.log("my chat details is: ", myChatDetails);
  

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // asking for permission of push notifications
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

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
      console.log("New message received via socket: ", data);
      if (
        data?.sender?._id !== userData?._id &&
        Notification.permission === "granted"
      ) {
        new Notification(`New message from ${data?.message?.sender?.name}`, {
          body: data?.message?.content,
        });
      }
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
    dispatch(getMyChats());
  };

  // rename a group
  const handleRenameGroup = () => {
    if (editedGrpName.trim() !== "") {
      dispatch(
        renameGroup({
          groupId: chatId,
          newName: editedGrpName,
        })
      ).then(() => {
        setIsEditing(false);
        setIsPopoverOpen(false);
        dispatch(getMyChatDetails(chatId));
        dispatch(getMyChats());
      });
    }
  };

  // delete a group
  const handleDeleteGroup = () => {
    if(myChatDetails) {
      dispatch(deleteGroup(myChatDetails?.chat?._id)).then(()=> {
        setOpenDeleteGrpModal(false);
        router.push("/conversations");
        dispatch(getMyChats());
      })
    }
  };

  return (
    <>
      <ConversationContainer>
        <>
          <nav className="flex justify-between p-5">
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    {myChatDetails?.chat?.groupChat
                      ? myChatDetails?.chat?.name?.charAt(0).toUpperCase()
                      : myChatDetails?.otherMember?.username
                          ?.charAt(0)
                          .toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <h1>
                  {myChatDetails?.chat?.groupChat
                    ? myChatDetails?.chat?.name
                    : myChatDetails?.otherMember?.username}
                </h1>
              </PopoverTrigger>
              <PopoverContent
                className={myChatDetails?.chat?.groupChat && "md:w-[400px]"}
              >
                {myChatDetails?.chat?.groupChat === false ? (
                  <div className="flex flex-col justify-center items-center gap-2 mb-4">
                    <Avatar className="w-[100px] h-[100px]">
                      <AvatarFallback className="text-3xl">
                        {myChatDetails?.otherMember?.username?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <h1>{myChatDetails?.otherMember?.username}</h1>
                    <div className="flex flex-col gap-2 w-full">
                      <div>
                        <label className="font-bold">Email</label>
                        <p className="flex justify-between text-sm text-gray-400">
                          {myChatDetails?.otherMember?.email}
                        </p>
                      </div>
                      <div>
                        <label className="font-bold">About</label>
                        <p className="flex justify-between items-center gap-4 text-sm text-gray-400">
                          {myChatDetails?.otherMember?.status}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col justify-center items-center gap-2 mb-4">
                    <Avatar className="w-[100px] h-[100px]">
                      <AvatarFallback className="text-3xl">
                        {myChatDetails?.chat?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {myChatDetails &&
                    myChatDetails?.chat?.creator?._id === userData?._id &&
                    isEditing ? (
                      <div className="flex flex-col gap-2">
                        <input
                          className="w-[200px] rounded-sm dark:bg-blue-950 bg-slate-300 px-2"
                          type="text"
                          ref={inputRef}
                          // value={myChatDetails?.chat?.name}
                          defaultValue={myChatDetails?.chat?.name}
                          onChange={(e) => setEditedGrpName(e.target.value)}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                          >
                            Cancel
                          </Button>
                          <Button size="sm" onClick={handleRenameGroup}>
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2 items-center">
                        <h1>{myChatDetails?.chat?.name}</h1>
                        <Pencil
                          size={15}
                          onClick={() => {
                            setIsEditing(true);
                            setIsPopoverOpen(true);
                          }}
                        />
                      </div>
                    )}
                    <div className="flex flex-col gap-2">
                      <div>
                        <label className="font-bold">Creator</label>
                        <p className="flex justify-between text-sm text-gray-400">
                          {myChatDetails?.chat?.creator?.username}
                        </p>
                      </div>
                      <div>
                        <label className="font-bold">CreatedAt</label>
                        <p className="flex justify-between items-center gap-4 text-sm text-gray-400">
                          {Date(
                            myChatDetails?.chat?.createdAt
                          ).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <label className="font-bold">Members</label>
                        <div className="space-y-2 h-[100px] overflow-y-auto no-scrollbar mt-2">
                          {myChatDetails?.chat?.members?.map((member) => (
                            <div
                              key={member._id}
                              className="flex items-center justify-between gap-2 bg-gray-200 dark:bg-blue-950 rounded-lg p-2 hover:bg-gray-300 dark:hover:bg-gray-800 cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback>
                                    {member?.username?.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <p>{member?.username}</p>
                              </div>
                              {myChatDetails &&
                                myChatDetails?.chat?.creator?._id ===
                                  member._id && (
                                  <div className="flex items-center justify-center gap-1">
                                    <ShieldCheck color="green" size={20} />
                                    <span className="text-green-400">
                                      Admin
                                    </span>
                                  </div>
                                )}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <Button size="sm" variant="outline">
                          <UserPlus />
                          Add Members
                        </Button>
                        <Button
                          onClick={() => {
                            setOpenDeleteGrpModal(true);
                          }}
                          size="sm"
                          variant="destructive"
                        >
                          Delete Group
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </PopoverContent>
            </Popover>
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
      {openDeleteGrpModal && (
        <Dialog open={openDeleteGrpModal}>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader className="flex flex-col gap-2 justify-center items-center">
              <DialogTitle>Delete Group</DialogTitle>
              <DialogDescription>
                Do you really want to delete this group?
              </DialogDescription>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpenDeleteGrpModal(false)
                    setIsEditing(false)
                  }}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteGroup}>
                  Delete
                </Button>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
