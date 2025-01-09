"use client"
import { FaSearch } from "react-icons/fa";
import { MdGroupAdd, MdGroups } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import { MdLogout } from "react-icons/md";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ChatLayout({ children }) {
  const router = useRouter();
  return (
    <div>
      <nav className="flex justify-between p-6 shadow-xl">
        <div className="basis-[80%]">
          <h1>MERN Chat App</h1>
        </div>
        <ul className="flex justify-around w-[300px]">
          <li title="search">
            <FaSearch />
          </li>
          <li title="create group">
            <MdGroupAdd />
          </li>
          <li title="manage group">
            <MdGroups />
          </li>
          <li title="notification">
            <IoMdNotifications />
          </li>
          <li title="logout">
            <MdLogout />
          </li>
        </ul>
      </nav>
      <div className="flex p-6">
        <div className="basis-[35%] pr-2 border-r-2 border-slate-700">
          <h2>Active Chats</h2>
          <ul className="my-4">
            <li className="flex gap-4 my-2 p-2 rounded-md items-center hover:bg-slate-900" onClick={()=> router.push("/chat/soumya")}>
              <div>
                <Image
                  src={"/images/profile-logo.png"}
                  width={40}
                  height={40}
                  className="rounded-full"
                  alt="Display profile"
                />
              </div>
              <div>
                <h1>Name</h1>
                <p>Hi this is soumya 👨</p>
              </div>
            </li>
            <li className="flex gap-4 my-2 rounded-md p-2 items-center hover:bg-slate-900">
              <div>
                <Image
                  src={"/images/profile-logo.png"}
                  width={40}
                  height={40}
                  className="rounded-full"
                  alt="Display profile"
                />
              </div>
              <div>
                <h1>Name</h1>
                <p>Hi this is soumya 👨</p>
              </div>
            </li>
            <li className="flex gap-4 my-2 p-2 rounded-md items-center hover:bg-slate-900">
              <div>
                <Image
                  src={"/images/profile-logo.png"}
                  width={40}
                  height={40}
                  className="rounded-full"
                  alt="Display profile"
                />
              </div>
              <div>
                <h1>Name</h1>
                <p>Hi this is soumya 👨</p>
              </div>
            </li>
          </ul>
        </div>
        <div className="basis-75% w-full">
            {children}
        </div>
      </div>
    </div>
  );
}
