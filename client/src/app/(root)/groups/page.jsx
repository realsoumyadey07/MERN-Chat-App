import ConversationFallback from '@/components/shared/conversations/ConversationFallback'
import ItemList from '@/components/shared/item-list/ItemList'
import React from 'react'

function page() {
  return (
    <>
      <ItemList title="Groups">Groups page</ItemList>
      <ConversationFallback/>
    </>
  )
}

export default page