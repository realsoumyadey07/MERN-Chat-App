import { Contact, MessageSquare, Users } from "lucide-react";
import { usePathname } from "next/navigation"
import { useMemo } from "react";


export const useNavigation = () => {
    const pathname = usePathname();

    const paths = useMemo(()=> [
        {
            name: "Conversations",
            href: "/conversations",
            icon: <MessageSquare/>,
            active: pathname.startsWith("/conversations")
        },
        {
            name: "Groups",
            href: "/groups",
            icon: <Users/>,
            active: pathname.startsWith("/groups")
        },
        {
            name: "Friends",
            href: "/friends",
            icon: <Contact/>,
            active: pathname.startsWith("/friends")
        }
    ], [pathname]);

    return paths;
}