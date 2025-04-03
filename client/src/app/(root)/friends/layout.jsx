"use client";
import ItemList from "@/components/shared/item-list/ItemList";
import {
  acceptFriendRequest,
  getAllRequests,
  getAllUnknownUsers,
  resetAcceptedRequestData,
  resetError,
  resetRequests,
  sendFriendRequest,
} from "@/redux/slices/user.slice";
import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import EmptyListComp from "@/components/EmptyListComp";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function FriendsLayout({ children }) {
  const [screen, setScreen] = useState("requests");
  const [refresh, setRefresh] = useState(false);
  const dispatch = useDispatch();
  const { requests, unknownUsers, acceptedRequestData, isLoading, error } = useSelector(
    (state) => state.user
  );

  const handleRequestAccept = async (requestId) => {
    try {
      await dispatch(acceptFriendRequest({ requestId, accept: true })).unwrap();
    } catch (error) {
      console.error("Failed to accept friend request:", error);
    }
  };

  const handleRequestDecline = async (requestId) => {
    try {
      await dispatch(acceptFriendRequest({ requestId, accept: false })).unwrap();
    } catch (error) {
      console.error("Failed to decline friend request:", error);
    }
  };

  const handleSendRequest = async (userId) => {
    try {
      await dispatch(sendFriendRequest(userId)).unwrap();
      setRefresh(!refresh);
    } catch (error) {
      console.error("Failed to send friend request:", error);
    }
  };

  useEffect(() => {
    if (screen === "requests") {
      dispatch(getAllRequests());
      return () => {
        dispatch(resetRequests());
        dispatch(resetAcceptedRequestData());
      };
    } else if (screen === "suggested") {
      dispatch(getAllUnknownUsers());
    }
  }, [screen, refresh]);

  // if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <ItemList title="Friends">
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
        <div className="w-full">
          <div className="flex items-center justify-between">
            <h1
              className={`p-2 cursor-pointer ${screen === "requests" ? "font-bold" : ""}`}
              onClick={() => setScreen("requests")}
            >
              Requests
            </h1>
            <h1
              className={`p-2 cursor-pointer ${screen === "suggested" ? "font-bold" : ""}`}
              onClick={() => setScreen("suggested")}
            >
              Suggestions
            </h1>
          </div>

          {screen === "requests" ? (
            requests && requests.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {requests.map((request, index) => (
                  <li
                    key={index}
                    className="flex justify-between w-full hover:bg-gray-200 dark:hover:bg-blue-950 rounded-lg p-2"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="/path-to-your-profile-image.jpg" alt="Profile" />
                        <AvatarFallback>DP</AvatarFallback>
                      </Avatar>
                      <h2>{request?.sender?.username}</h2>
                    </div>
                    <div className="flex gap-2">
                      {acceptedRequestData !== null ? (
                        <Link
                          href={`/friends/${acceptedRequestData?.chatId}`}
                        >
                          <Button size="sm" className="dark:bg-white text-black">
                            Open Chat
                          </Button>
                        </Link>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 dark:text-white"
                            onClick={() => handleRequestAccept(request?._id)}
                          >
                            {isLoading ? <p>Accepting...</p> : <p>Accept</p>}
                          </Button>
                          <Button
                            size="sm"
                            className="bg-red-500 hover:bg-red-600 dark:text-white"
                            onClick={() => handleRequestDecline(request?._id)}
                          >
                            Decline
                          </Button>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyListComp heading="No requests found" description="You have no friend requests" />
            )
          ) : screen === "suggested" ? (
            unknownUsers && unknownUsers.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {unknownUsers.map((unknownUser, index) => (
                  <li
                    key={index}
                    className="flex justify-between w-full hover:bg-gray-200 dark:hover:bg-blue-950 rounded-lg p-2"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="/path-to-your-profile-image.jpg" alt="Profile" />
                        <AvatarFallback>DP</AvatarFallback>
                      </Avatar>
                      <h2>{unknownUser?.username}</h2>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-green-500 hover:bg-green-600 dark:text-white" onClick={() => handleSendRequest(unknownUser?._id)}>
                        {isLoading ? <p>Sending...</p> : <p>Add Friend</p>}
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyListComp heading="No users found" description="Please try again later" />
            )
          ) : null}
        </div>
      </ItemList>
      {children}
      {error && (
        <Dialog open={!!error}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{error}</DialogTitle>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => dispatch(resetError())}>Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

