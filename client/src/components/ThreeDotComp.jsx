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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoSearch } from "react-icons/io5";
import { getMyFriends, searchMyFriendByName } from "@/redux/slices/user.slice";
import { createNewGroup, getMyChats, getMyGroups } from "@/redux/slices/chat.slice";
import { Avatar, AvatarFallback } from "./ui/avatar";

export default function ThreeDotComp() {
  const [modalScreen, setModalScreen] = useState("members");
  const [groupName, setGroupName] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);
  const [openGroupModal, setOpenGroupModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [name, setName] = useState("");
  const [emptyMember, setEmptyMember] = useState(false);
  const { friends, error, isLoading } = useSelector((state) => state.user);
  const {
    newCreatedGroup,
    error: groupError,
    isLoading: groupLoading,
  } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  useEffect(() => {
    if (openGroupModal) {
      dispatch(getMyFriends());
    }
  }, [openGroupModal, dispatch]);

  const handleSearch = () => {
    dispatch(searchMyFriendByName(name));
    if (name === "") {
      dispatch(getMyFriends());
    }
  };

  const handleCreateGroup = async () => {
    try {
      if (!groupName.trim()) {
        alert("Please enter a group name");
        return;
      }
      if (groupMembers.length === 0) {
        alert("Please select at least one member");
        return;
      }

      const memberIds = groupMembers.map((member) => member._id);
      dispatch(
        createNewGroup({
          name: groupName.trim(),
          members: memberIds,
        })
      ).then(() => {
        setOpenGroupModal(false);
        setGroupMembers([]);
        setGroupName("");
        setModalScreen("members");
        dispatch(getMyGroups());
        dispatch(getMyChats());
      });
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Failed to create group. Please try again.");
    }
  };

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
            <DropdownMenuItem
              className="p-4"
              onClick={() => {
                setOpenGroupModal(true);
                setDropdownOpen(false);
              }}
            >
              <MdGroups size={20} /> Create New Group
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {openGroupModal && (
        <Dialog open={openGroupModal}>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader className="flex flex-col gap-2 justify-center items-center">
              <DialogTitle>Create New Group</DialogTitle>
              <DialogDescription>{""}</DialogDescription>
            </DialogHeader>
            {modalScreen === "members" && (
              <>
                {" "}
                <main>
                  <div className="flex w-full bg-gray-200 dark:bg-blue-950 rounded-lg justify-between items-center px-4">
                    <input
                      type="text"
                      placeholder="Search users here..."
                      className="bg-transparent h-full py-3 basis-[90%] outline-none"
                      onChange={(e) => {
                        setName(e.target.value);
                        dispatch(searchMyFriendByName(e.target.value));
                        if (e.target.value === "") {
                          dispatch(getMyFriends());
                        }
                      }}
                      value={name}
                    />
                    <div onClick={handleSearch}>
                      <IoSearch size={23} color="#a6a6a6" />
                    </div>
                  </div>
                  <section>
                    <h1 className="p-2">Selected Friends</h1>
                    <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto pb-2 pl-2 scrollbar-thin">
                      {groupMembers.map((member) => (
                        <div
                          key={member._id}
                          className="flex items-center gap-2 bg-gray-200 dark:bg-blue-950 rounded-full px-3 py-2 hover:bg-gray-300 dark:hover:bg-gray-800 cursor-pointer whitespace-nowrap"
                        >
                          <Avatar className="w-6 h-6 shrink-0">
                            <AvatarFallback>
                              {member?.username?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-sm">{member?.username}</p>
                        </div>
                      ))}
                    </div>
                    {emptyMember && (
                      <p className="text-red-500 text-sm px-2">
                        Please select at least two members
                      </p>
                    )}
                  </section>
                  <h1 className="p-2">All Friends</h1>
                  <div className="space-y-2 h-[100px] overflow-y-auto no-scrollbar">
                    {friends.map((friend) => (
                      <div
                        key={friend._id}
                        className="flex items-center gap-2 bg-gray-200 dark:bg-blue-950 rounded-lg p-2 hover:bg-gray-300 dark:hover:bg-gray-800 cursor-pointer"
                        onClick={() => {
                          if (
                            !groupMembers.some(
                              (member) => member._id === friend._id
                            )
                          ) {
                            setGroupMembers([...groupMembers, friend]);
                          }
                          if (groupMembers.length > 1) {
                            setEmptyMember(false);
                          }
                        }}
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>
                            {friend?.username?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <p>{friend?.username}</p>
                      </div>
                    ))}
                  </div>
                </main>
                <DialogFooter>
                  <Button
                    onClick={() => {
                      setGroupMembers([]);
                      setOpenGroupModal(false);
                      setEmptyMember(false);
                      setName("");
                      console.log("Cancel clicked");
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      if (groupMembers.length <= 1) {
                        setEmptyMember(true);
                        return;
                      }
                      setModalScreen("groupName");
                      console.log("next clicked");
                    }}
                  >
                    Next
                  </Button>
                </DialogFooter>
              </>
            )}
            {modalScreen === "groupName" && (
              <>
                <main>
                  <div className="flex w-full bg-gray-200 dark:bg-blue-950 rounded-lg justify-between items-center px-4">
                    <input
                      type="text"
                      placeholder="Group name"
                      className="bg-transparent h-full py-3 basis-[90%] outline-none"
                      value={groupName}
                      onChange={(e) => {
                        setGroupName(e.target.value);
                      }}
                    />
                  </div>
                </main>
                <DialogFooter>
                  <Button
                    onClick={() => {
                      setGroupName("");
                      setModalScreen("members");
                    }}
                    // className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    variant="outline"
                  >
                    Back
                  </Button>
                  <Button
                    // className="px-4 py-2 text-white rounded-sm bg-green-600 hover:bg-green-700 flex items-center "
                    onClick={handleCreateGroup}
                  >
                    {groupLoading ? <h1>Loading...</h1> : <h1>Create</h1>}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
