import { Card } from '@/components/ui/card'
import React from 'react'

export default function ConversationContainer({children}) {
  return (
    <Card className="w-full h-[calc(100svh-32px)] lg:h-full p-2 flex flex-col gap-2">
      {children}
    </Card>
  )
}

 
