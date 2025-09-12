"use client";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
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

export default function ProfileComponent() {
  const [openModal, setOpenModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { userData, error, logoutUserData, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async() => {
    console.log("Logout clicked");
    await dispatch(logOut()).unwrap();
    setOpenModal(false);
    router.push("/authentication");
  };

  useEffect(() => {
    if (logoutUserData) {
      dispatch(resetError());
      dispatch(resetLoginUserData());
      dispatch(resetUserData());
      router.push("/authentication");
    }
  }, [logoutUserData, dispatch, router]);


  return (
    <>
      <div className="flex items-center justify-center">
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0">
              <Avatar className="w-8 h-8">
                <AvatarFallback>{userData?.username?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          {userData && (
            <DropdownMenuContent className="w-fit">
              <div className="flex flex-col items-center gap-2 p-4">
                <Avatar className="w-[100px] h-[100px]">
                  <AvatarFallback className="text-3xl">{userData?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <p>{userData.username}</p>
                <div>
                  <div>
                    <label className="font-bold">Email</label>
                    <p className="flex justify-between">{userData.email}</p>
                  </div>
                  <div>
                    <label className="font-bold">About</label>
                    <p className="flex justify-between items-center gap-4">
                      {userData.status}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <Button
                  onClick={() => {
                    setOpenModal(true);
                    setDropdownOpen(false); // Close dropdown when opening modal
                  }}
                  variant="destructive"
                >
                  Sign Out
                </Button>
              </div>
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
            <DialogFooter className="gap-2">
              <Button
                onClick={() => {
                  setOpenModal(false);
                  console.log("Cancel clicked");
                }}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  console.log("Confirm clicked");
                  handleLogout();
                }}
                variant="destructive"
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
