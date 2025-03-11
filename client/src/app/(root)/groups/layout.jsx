"use client";
import ItemList from "@/components/shared/item-list/ItemList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { IoSearch } from "react-icons/io5";

export default function layout({ children }) {
  const router = useRouter();
  const handleClick = (id) => {
    router.push(`/groups/${id}`);
  };
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
        <ul className="flex flex-col gap-2 w-full p-4 cursor-pointer">
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
      </ItemList>
      {children}
    </>
  );
}
