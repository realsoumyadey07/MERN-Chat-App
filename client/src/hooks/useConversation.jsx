import { useParams } from "next/navigation"
import { useMemo } from "react";

export const useConversation = ()=> {
    const params = useParams();

    const conversationId = useMemo(()=>{
        return params?.conversationId || params?.groupId || ""
    },[params?.conversationId, params?.groupId]);

    const isActive = useMemo(()=>{
        return !!conversationId
    },[conversationId]);
    
    return {
        isActive,
        conversationId
    }
}