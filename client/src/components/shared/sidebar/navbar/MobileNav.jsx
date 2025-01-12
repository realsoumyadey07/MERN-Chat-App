"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigation } from "@/hooks/useNavigation";
import Link from "next/link";

export default function MobileNav() {
  const paths = useNavigation();
  return (
    <Card className="fixed bottom-4 w-[calc(100vw-50px)] flex lg:hidden justify-center items-center p-2">
      <nav className="w-full">
        <ul className="flex flex-row justify-evenly items-center">
          {paths.map((path, id) => {
            return (
              <li key={id} className="relative">
                <Tooltip>
                  <TooltipTrigger>
                    <Link href={path.href}>
                      <Button
                        size="icon"
                        variant={path.active ? "default" : "outline"}
                      >
                        {path.icon}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>{path.name}</TooltipContent>
                </Tooltip>
              </li>
            );
          })}
        </ul>
        <div className="flex flex-col items-centergap-4"></div>
      </nav>
    </Card>
  );
}
