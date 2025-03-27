"use client";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { RiGroupLine } from "react-icons/ri";
import { SiWpexplorer } from "react-icons/si";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { IoSearch } from "react-icons/io5";

export default function ThreeDotComp() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [openGrpModal, setOpenGrpModal] = useState(false);
  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <BsThreeDotsVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit">
          <DropdownMenuItem
            onClick={() => setOpenGrpModal(true)}
            className="p-4"
          >
            {" "}
            <RiGroupLine /> Create New Group
          </DropdownMenuItem>

          <DropdownMenuItem className="p-4">
            {" "}
            <SiWpexplorer />
            Explore New Friends
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {openGrpModal && (
        <Dialog open={openGrpModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>New Group</DialogTitle>
            </DialogHeader>
            <main>
              <div className="flex flex-col gap-4">
              
                <input
                  type="text"
                  placeholder="Name of group"
                  className="bg-transparent h-full py-3 basis-[90%] outline-none flex w-full bg-gray-200 dark:bg-blue-950 rounded-lg justify-between items-center px-4"
                />
                
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
              </div>
            </main>
            <DialogFooter className="gap-2">
              <button
                onClick={() => {
                  setOpenGrpModal(false);
                  console.log("Cancel clicked");
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log("Confirm clicked");
                }}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
              >
                Create
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
