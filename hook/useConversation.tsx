import { useParams } from "next/navigation"
import { useMemo } from "react";

export const useConversation = () =>{
    const parms = useParams()
    const conversationId = useMemo(
        ()=>parms?.conversationId||(""as string),
    
    [parms?.conversationId] );

    const isActive = useMemo(()=>
        !!conversationId,[conversationId])

   return {
    isActive,conversationId
   }


}