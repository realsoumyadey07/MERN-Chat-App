import { Card } from "@/components/ui/card";
import Image from "next/image";
import React from "react";

export default function ConversationFallback() {
  return (
    <Card className="hidden lg:flex h-full w-full p-2 items-center justify-center bg-secondary text-secondary-foreground">
      <div className="text-center flex flex-col items-center gap-3">
        <Image
          src={"/images/whatsapp-logo2.webp"}
          width={80}
          height={80}
          alt="logo"
        />
        <h3 className="dark:text-gray-400 font-semibold text-xl">
          MERN Stack Chat Application
        </h3>
        <p className="dark:text-gray-300 text-[15px]">
          Send and receive messages without keeping your phone online.
        </p>
        <p className="dark:text-gray-300 text-[15px]">
          Use our chat application in order to stay in touch with your closeone.
        </p>
      </div>
    </Card>
  );
}
