"use client"
import { Card } from "@/components/ui/card";
import { useNavigation } from "@/hooks/useNavigation"

export default function MobileNav() {
  const paths = useNavigation();
  return (
    <Card className="flex lg:hidden justify-center items-center p-4">
      <nav></nav>
      <div className="flex flex-col items-centergap-4">

      </div>
    </Card>
  )
}
