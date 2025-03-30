"use client";
import ProfileComponent from "@/components/ProfileComponent";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigation } from "@/hooks/useNavigation";
import { getProfileData } from "@/redux/slices/auth.slice";
import Link from "next/link";
import { useDispatch } from "react-redux";

export default function MobileNav() {
  const paths = useNavigation();
  const {isActive} = useNavigation();
  if(isActive) return null;
  const dispatch = useDispatch();
  const getUserProfile = () => {
    dispatch(getProfileData());
  };
  return (
    <Card className="fixed bottom-4 w-[calc(100vw-32px)] flex lg:hidden justify-center items-center p-2">
      <nav className="w-full">
        <ul className="flex flex-row justify-evenly items-center">
          {paths.map((path, id) => {
            return (
              <li key={id} className="relative">
                <Tooltip>
                  <TooltipTrigger asChild>
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
          <li>
            <ThemeToggle/>
          </li>
          <li>
            <div className="flex flex-col items-center gap-4" onClick={getUserProfile}>
              <ProfileComponent/>
            </div>
          </li>
        </ul>
      </nav>
    </Card>
  );
}
