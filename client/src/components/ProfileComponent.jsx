"use client";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useRouter } from "next/navigation";
import { logOut, resetError, resetLoginUserData, resetUserData } from "@/redux/slices/auth.slice";
import LoadingSpinner from "./LoadingSpinner";


export default function ProfileComponent() {
  const [openModal, setOpenModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { userData, error, logoutUserData, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const handleLogout = () => {
    console.log("Logout clicked");
    dispatch(logOut());
    setOpenModal(false);
    // Add your logout logic here
  };

  useEffect(()=> {
    if(logoutUserData) {
      dispatch(resetError());
      dispatch(resetLoginUserData());
      dispatch(resetUserData());
      router.push("/login");
    }
  },[logoutUserData])

  if(isLoading) {
    return <LoadingSpinner/>
  }

  return (
    <>
      <div className="flex items-center justify-center">
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src="/path-to-your-profile-image.jpg"
                  alt="Profile"
                />
                <AvatarFallback>DP</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          {userData && (
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem onClick={() => console.log("Profile clicked!")}>
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src="/path-to-your-profile-image.jpg"
                    alt="Profile"
                  />
                  <AvatarFallback>DP</AvatarFallback>
                </Avatar>
                {userData.username}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log("Settings clicked!")}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setOpenModal(true);
                  setDropdownOpen(false); // Close dropdown when opening modal
                }}
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </div>

      {openModal && (
        <Dialog open={openModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Do you really want to sign out?</DialogTitle>
            </DialogHeader>
            <DialogFooter>
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