"use client";
import ItemList from "@/components/shared/item-list/ItemList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { IoSearch } from "react-icons/io5";
import NoContact from "../../../../public/images/no-contact.png"
import Image from "next/image";
import EmptyListComp from "@/components/EmptyListComp";

export default function layout({ children }) {
  const user = [
    {
      id: "jdfeftgergrrw548235",
      name: "School"
    },
    {
      id: "jdfertherurgw548235",
      name: "College"
    },
    {
      id: "jdferggerfrgw548235",
      name: "Ajantrik"
    },
    {
      id: "jdfertgergrgwh48235",
      name: "BCA Official"
    },
    {
      id: "jdfedtgergngw548235",
      name: "TCS Smart Training"
    }
  ];
  return (
    <>
      <ItemList title="Groups">
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
            <EmptyListComp heading="No groups found." description="Start a new group by searching for community above."/>
            </>
          )}
        </ul>
      </ItemList>
      {children}
    </>
  );
}
