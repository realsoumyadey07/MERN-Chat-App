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
  logOut,
  resetError,
  resetLoginUserData,
  resetUserData,
} from "@/redux/slices/auth.slice";
import LoadingSpinner from "./LoadingSpinner";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaWpexplorer } from "react-icons/fa";

export default function ThreeDotComp() {
  const [openModal, setOpenModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { userData, error, logoutUserData, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const handleLogout = () => {
    console.log("Logout clicked");
    dispatch(logOut());
    setOpenModal(false);
  };

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
            <DropdownMenuItem className="p-4">
                <MdGroups size={20} /> Create New Group

            </DropdownMenuItem>

            <DropdownMenuItem
              className="p-4"
              onClick={() => {
                setOpenModal(true);
                setDropdownOpen(false); // Close dropdown when opening modal
              }}
            >
             <FaWpexplorer />{" "} Find New Friends
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {openModal && (
        <Dialog open={openModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Do you really want to sign out?</DialogTitle>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <button
                onClick={() => {
                  setOpenModal(false);
                  console.log("Cancel clicked");
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log("Confirm clicked");
                  handleLogout();
                }}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
              >
                Confirm
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
