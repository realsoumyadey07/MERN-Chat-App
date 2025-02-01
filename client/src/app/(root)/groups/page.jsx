"use client";
import ConversationFallback from "@/components/shared/conversations/ConversationFallback";
import ItemList from "@/components/shared/item-list/ItemList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import React from "react";
import { IoSearch } from "react-icons/io5";

function page() {
  const router = useRouter();
  const handleClick = (id) => {
    router.push(`/conversations/${id}`);
  };
  return (
    <>
      {/* <ItemList title="Groups">
        <div className="flex w-[95%] bg-blue-950 rounded-lg justify-between px-4 py-3">
          <input
            type="text"
            placeholder="Search here..."
            className="bg-transparent outline-none"
          />
          <div>
            <IoSearch size={23} color="#a6a6a6" />
          </div>
        </div>
        <ul className="flex flex-col gap-2 w-full p-4">
          <li
            className="w-full"
            onClick={() => handleClick("ajkdfhafdjgadfgadf")}
          >
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src="/path-to-your-profile-image.jpg"
                  alt="Profile"
                />
                <AvatarFallback>DP</AvatarFallback>
              </Avatar>
              <h2>Name</h2>
            </div>
          </li>
        </ul>
      </ItemList> */}
      <ConversationFallback />
    </>
  );
}

export default page;
