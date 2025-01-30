import { Card } from '@/components/ui/card'
import React from 'react'

export default function ConversationContainer({children}) {
  return (
    <Card className="w-full h-full lg:h-full p-2 flex flex-col justify-between gap-2">
      {children}
    </Card>
  )
}

 
