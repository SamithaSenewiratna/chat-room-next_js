import { MessageSquare, Users } from "lucide-react";
import { usePathname } from "next/navigation"
import { useMemo } from "react";

export const useNavigation = () => {
   const pathname = usePathname();
   
   const paths = useMemo(()=>[
     {
        name : "Convesations",
        href : "/conversations",
        icon : <MessageSquare/>,
        active : pathname.startsWith("/conversations")

     },
      {
        name : "Members",
        href : "/members",
        icon : <Users/>,
        active : pathname ==="/members",

     }  
   ],[pathname]);

   return paths;
} 