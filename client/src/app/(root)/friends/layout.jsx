"use client";
import ItemList from "@/components/shared/item-list/ItemList";
import {
  acceptFriendRequest,
  getAllRequests,
  resetAcceptedRequestData,
  resetRequests,
} from "@/redux/slices/user.slice";
import { useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import EmptyListComp from "@/components/EmptyListComp";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FriendsLayout({ children }) {
  const dispatch = useDispatch();
  const { requests, acceptedRequestData, isLoading } = useSelector(
    (state) => state.user
  );
  const handleRequestAccept = (requestId) => {
    dispatch(acceptFriendRequest({ requestId, accept: true }));
  };
  const handleRequestDecline = (requestId) => {
    dispatch(acceptFriendRequest({ requestId, accept: false }));
  };
  useEffect(() => {
    dispatch(getAllRequests());
    return () => {
      dispatch(resetRequests());
      dispatch(resetAcceptedRequestData());
    };
  }, []);
  if (isLoading) return <LoadingSpinner />;
  return (
    <>
      <ItemList title="Friend Requests">
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
          <h1 className="p-2">Requests</h1>
          {requests && requests.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {requests.map((request, index) => (
                <li
                  key={index}
                  className="flex justify-between w-full hover:bg-gray-200 dark:hover:bg-blue-950 rounded-lg p-2"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src="/path-to-your-profile-image.jpg"
                        alt="Profile"
                      />
                      <AvatarFallback>DP</AvatarFallback>
                    </Avatar>
                    <h2>{request?.sender?.username}</h2>
                  </div>
                  <div className="flex gap-2">
                    {acceptedRequestData !== null ? (
                        <Link href={`/friends/${acceptedRequestData?.chatId}`}>
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
            <EmptyListComp
              heading="No requests found"
              description="You have no friend requests"
            />
          )}
        </div>
      </ItemList>
      {children}
    </>
  );
}
