"use client";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { MdGroups } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useRouter } from "next/navigation";
import {
  resetError,
  resetLoginUserData,
  resetUserData,
} from "@/redux/slices/auth.slice";
import LoadingSpinner from "./LoadingSpinner";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaWpexplorer } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";

export default function ThreeDotComp() {
  const [openFriendModal, setOpenFriendModal] = useState(false);
  const [openGroupModal, setOpenGroupModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { userData, error, logoutUserData, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const router = useRouter();
  

  useEffect(() => {
    if (logoutUserData) {
      dispatch(resetError());
      dispatch(resetLoginUserData());
      dispatch(resetUserData());
      router.push("/authentication");
    }
  }, [logoutUserData]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="flex items-center justify-center">
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0">
              <BsThreeDotsVertical />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-fit">
            <DropdownMenuItem className="p-4" onClick={()=> {
              setOpenGroupModal(true);
              setDropdownOpen(false);
            }}>
              <MdGroups size={20} /> Create New Group
            </DropdownMenuItem>

            <DropdownMenuItem
              className="p-4"
              onClick={() => {
                setOpenFriendModal(true);
                setDropdownOpen(false); // Close dropdown when opening modal
              }}
            >
              <FaWpexplorer /> Find New Friends
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {openFriendModal && (
        <Dialog open={openFriendModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader className="flex flex-col gap-2 justify-center items-center">
              <DialogTitle>Add New Friends</DialogTitle>
              <div className="flex w-full bg-gray-200 dark:bg-blue-950 rounded-lg justify-between items-center px-4">
                <input
                  type="text"
                  placeholder="Search users here..."
                  className="bg-transparent h-full py-3 basis-[90%] outline-none"
                />
                <div>
                  <IoSearch size={23} color="#a6a6a6" />
                </div>
              </div>
            </DialogHeader>
            <DialogFooter>
              <button
                onClick={() => {
                  setOpenFriendModal(false);
                  console.log("Cancel clicked");
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Cancel
              </button>
              
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {openGroupModal && (
        <Dialog open={openGroupModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader className="flex flex-col gap-2 justify-center items-center">
              <DialogTitle>Create New Group</DialogTitle>
              <div className="flex w-full bg-gray-200 dark:bg-blue-950 rounded-lg justify-between items-center px-4">
                <input
                  type="text"
                  placeholder="Search users here..."
                  className="bg-transparent h-full py-3 basis-[90%] outline-none"
                />
                <div>
                  <IoSearch size={23} color="#a6a6a6" />
                </div>
              </div>
            </DialogHeader>
            <DialogFooter>
              <button
                onClick={() => {
                  setOpenGroupModal(false);
                  console.log("Cancel clicked");
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Cancel
              </button>
              
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
