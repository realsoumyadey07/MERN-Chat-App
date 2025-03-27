"use client";
import ItemList from "@/components/shared/item-list/ItemList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getMyChats } from "@/redux/slices/chat.slice";
import Link from "next/link";
import React, { useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import NoContact from "../../../../public/images/no-contact.png"
import Image from "next/image";
import EmptyListComp from "@/components/EmptyListComp";

export default function layout({ children }) {
  const dispatch = useDispatch();
  const { myChatsData, isLoading, error } = useSelector((state) => state.chat);
  myChatsData ? console.log("my chat data ", myChatsData) : null;

  useEffect(() => {
    dispatch(getMyChats());
  }, []);
  const user = [
    // {
    //   id: "jdfeftgergrrw548235",
    //   name: "Soumya"
    // },
    // {
    //   id: "jdfertherurgw548235",
    //   name: "Sourav"
    // },
    // {
    //   id: "jdferggerfrgw548235",
    //   name: "Ayush"
    // },
    // {
    //   id: "jdfertgergrgwh48235",
    //   name: "Rahul"
    // },
    // {
    //   id: "jdfedtgergngw548235",
    //   name: "Rohit"
    // }
  ];
  return (
    <>
      <ItemList title="Conversations">
        <div className="flex w-full bg-gray-200 dark:bg-blue-950 rounded-lg justify-between items-center px-4">
          <input
            type="text"
            placeholder="Search here..."
            className="bg-transparent h-full py-3 basis-[90%] outline-none"
          />
          <div>
            <IoSearch size={23} color="#a6a6a6" />
          </div>
        </div>
        <ul className="flex flex-col gap-2 w-full cursor-pointer">
          {user && user.length > 0 ? (
            user.map((item, index) => (
              <Link
                className="w-full hover:bg-gray-200 dark:hover:bg-blue-950 rounded-lg p-2"
                href={`/conversations/${item.id}`}
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
                  <h2>{item.name}</h2>
                </div>
              </Link>
            ))
          ) : (
            <>
            <EmptyListComp heading="No conversations found." description="Start a new conversation by searching for users above."/>
            </>
          )}
        </ul>
      </ItemList>
      {children}
    </>
  );
}
