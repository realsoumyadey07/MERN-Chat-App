"use client"
import { Card } from "@/components/ui/card";
import { useNavigation } from "@/hooks/useNavigation"

export default function DesktopNav() {
  const paths = useNavigation();
  return (
    <Card className="hidden lg:flex lg:flex-col lg:justify-between lg:items-center lg:h-full lg:w-16 lg:px-2 lg:py-4">
      <nav></nav>
      <div className="flex flex-col items-centergap-4">

      </div>
    </Card>
  )
}
