"use client";
import ItemList from "@/components/shared/item-list/ItemList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getMyChatByName, getMyChats } from "@/redux/slices/chat.slice";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import EmptyListComp from "@/components/EmptyListComp";
import { Info } from "lucide-react";

export default function Layout({ children }) {
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  const { myChatsData } = useSelector((state) => state.chat);
  useEffect(() => {
    if (name === "") {
      dispatch(getMyChats());
    }
  }, [ name, dispatch ]);
  const handleSearch = () => {
    dispatch(getMyChatByName(name));
  };
  console.log("mychats data is here: ",myChatsData);
  
  return (
    <>
      <ItemList title="Conversations">
        <div className="flex w-full bg-gray-200 dark:bg-blue-950 rounded-lg justify-between items-center px-4">
          <input
            type="text"
            placeholder="Search here..."
            className="bg-transparent h-full py-3 basis-[90%] outline-none"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              dispatch(getMyChatByName(e.target.value));
              if (e.target.value === "") {
                dispatch(getMyChats());
              }
            }}
          />
          <div className="cursor-pointer" onClick={handleSearch}>
            <IoSearch size={23} color="#a6a6a6" />
          </div>
        </div>
        <ul className="flex flex-col gap-2 w-full cursor-pointer">
          {myChatsData && myChatsData.length > 0 ? (
            myChatsData.map((item, index) => (
              <Link
                className="w-full hover:bg-gray-200 dark:hover:bg-blue-950 rounded-lg p-2 flex items-center justify-between"
                href={`/conversations/${item._id}`}
                key={index}
              >
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src="/path-to-your-profile-image.jpg"
                      alt="Profile"
                    />
                    <AvatarFallback>DP</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2>{item.name}</h2>
                    <p className="text-sm text-gray-500 truncate max-w-[200px] overflow-hidden">{item.latest_message?.content || ""}</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <>
              <EmptyListComp
                heading="No conversations found."
                description="Start a new conversation by searching for users above."
              />
            </>
          )}
        </ul>
      </ItemList>
      {children}
    </>
  );
}
