"use client";
import ConversationFallback from "@/components/shared/conversations/ConversationFallback";
import { useRouter } from "next/navigation";
import React from "react";

function Page() {
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

export default Page;
