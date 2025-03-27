"use client";
import ConversationFallback from "@/components/shared/conversations/ConversationFallback";
import ItemList from "@/components/shared/item-list/ItemList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import React from "react";
import { IoSearch } from "react-icons/io5";

function page() {
  const router = useRouter();
  const handleClick = (id) => {
    router.push(`/conversations/${id}`);
  };
  return (
    <>
      <ConversationFallback />
    </>
  );
}

export default page;
