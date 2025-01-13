"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Skeleton } from "./ui/skeleton";

export default function ProfileComponent() {
  const {userData, error, isLoading} = useSelector((state)=> state.auth);
  return (
    <div className="flex items-center justify-center" >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-0">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src="/path-to-your-profile-image.jpg"
                alt="Profile"
              />
              <AvatarFallback>DP</AvatarFallback> {/*Fallback for initials*/}
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        {/* Dropdown Menu Content */}
        {userData && <DropdownMenuContent className="w-48">
          <DropdownMenuItem onClick={() => console.log("Profile clicked!")}>
            <Avatar className="w-8 h-8">
              <AvatarImage
                src="/path-to-your-profile-image.jpg"
                alt="Profile"
              />
              <AvatarFallback>DP</AvatarFallback>{/* Fallback for initials */}
            </Avatar>
            {userData && userData?.username}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log("Settings clicked!")}>
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => console.log("Sign Out clicked!")}>
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>}
      </DropdownMenu>
    </div>
  );
}
