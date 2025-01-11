import SidebarWrapper from '@/components/shared/sidebar/SidebarWrapper'
import React from 'react'

export default function layout({children}) {
  return (
    <SidebarWrapper>{children}</SidebarWrapper>
  )
}
