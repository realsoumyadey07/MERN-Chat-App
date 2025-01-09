"use client"
import { FaSearch } from "react-icons/fa";
import { MdGroupAdd, MdGroups } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";
import { MdLogout } from "react-icons/md";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaRegUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "@/redux/slices/auth.slice";


export default function ChatLayout({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const {userData, error, isLoading} = useSelector((state)=> state.auth);
  const getUserProfile = ()=> {
    dispatch(getUserData());
  }
  console.log(userData);
  return (
    <div>
      <nav className="flex justify-between p-6 shadow-xl">
        <div className="basis-[80%]">
          <h1>MERN Chat App</h1>
        </div>
        <ul className="justify-around w-[300px] md:flex hidden">
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
          <li title="profile" onClick={getUserProfile}>
            <FaRegUser/>
          </li>
        </ul>
        <div className="md:hidden flex">
          <GiHamburgerMenu/>
        </div>
      </nav>
      <div className="flex p-6">
        <div className="lg:basis-[35%] basis-[50%] pr-2 border-r-2 border-slate-700">
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
        <div className="basis-[50%] lg:basis-[75%] w-full">
            {children}
        </div>
      </div>
    </div>
  );
}
