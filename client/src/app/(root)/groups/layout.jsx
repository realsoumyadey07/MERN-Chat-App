"use client";
import ItemList from "@/components/shared/item-list/ItemList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { IoSearch } from "react-icons/io5";
import EmptyListComp from "@/components/EmptyListComp";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyGroupByName, getMyGroups } from "@/redux/slices/chat.slice";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function layout({ children }) {
  const [groupName, setGroupName] = useState("");
  const dispath = useDispatch();
  const { myGroupsData, isLoading, error } = useSelector((state)=> state.chat);
  useEffect(()=> {
    if(groupName.length === 0) {
      
    dispath(getMyGroups());
    }
  },[])
  
  // if(!myGroupsData && isLoading){
  //   return <LoadingSpinner/>
  // }
  return (
    <>
      <ItemList title="Groups">
        <div className="flex w-full bg-gray-200 dark:bg-blue-950 rounded-lg justify-between items-center px-4">
          <input
            type="text"
            placeholder="Search here..."
            className="bg-transparent h-full py-3 basis-[90%] outline-none"
            value={groupName}
            onChange={(e)=> {
              setGroupName(e.target.value);
              dispath(getMyGroupByName(e.target.value));
              if(e.target.value === "") {
                dispath(getMyGroups());
              }
            }}
          />
          <div>
            <IoSearch size={23} color="#a6a6a6" />
          </div>
        </div>
        <ul className="flex flex-col gap-2 w-full cursor-pointer">
          {myGroupsData && myGroupsData.length > 0 ? (
            myGroupsData.map((item, index) => (
              <Link
                className="w-full hover:bg-gray-200 dark:hover:bg-blue-950 rounded-lg p-2"
                href={`/groups/${item._id}`}
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
