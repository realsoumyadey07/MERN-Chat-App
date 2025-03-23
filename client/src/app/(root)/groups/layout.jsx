"use client";
import ItemList from "@/components/shared/item-list/ItemList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { IoSearch } from "react-icons/io5";
import NoContact from "../../../../public/images/no-contact.png"
import Image from "next/image";

export default function layout({ children }) {
  const user = [
    // {
    //   id: "jdfeftgergrrw548235",
    //   name: "School"
    // },
    // {
    //   id: "jdfertherurgw548235",
    //   name: "College"
    // },
    // {
    //   id: "jdferggerfrgw548235",
    //   name: "Ajantrik"
    // },
    // {
    //   id: "jdfertgergrgwh48235",
    //   name: "BCA Official"
    // },
    // {
    //   id: "jdfedtgergngw548235",
    //   name: "TCS Smart Training"
    // }
  ];
  return (
    <>
      <ItemList title="Groups">
        <div className="flex w-[95%] bg-gray-200 dark:bg-blue-950 rounded-lg justify-between px-4 py-3">
          <input
            type="text"
            placeholder="Search here..."
            className="bg-transparent outline-none"
          />
          <div>
            <IoSearch size={23} color="#a6a6a6" />
          </div>
        </div>
        <ul className="flex flex-col gap-2 w-full p-2 cursor-pointer">
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
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <Image
                src={NoContact} // Add an illustration for empty state
                alt="No contact found"
                className="w-32 h-26 mb-4"
              />
              <p className="text-gray-500 dark:text-gray-400">
                No groups found.
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Start a new group by searching for community above.
              </p>
            </div>
          )}
        </ul>
      </ItemList>
      {children}
    </>
  );
}
