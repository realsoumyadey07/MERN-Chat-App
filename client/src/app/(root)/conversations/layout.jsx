import ItemList from '@/components/shared/item-list/ItemList'
import React from 'react'

export default function layout({children}) {
  return (
    <>
      <ItemList title="Conversations">Conversation page</ItemList>
      {children}
    </>
  )
}
