import React from 'react'
import DesktopNav from './navbar/DesktopNav'
import MobileNav from './navbar/MobileNav'

export default function SidebarWrapper({children}) {
  return (
    <div className='h-screen flex-col-reverse w-full p-4 flex lg:flex-row gap-4'>
        <DesktopNav/>
        <MobileNav/>
        <main className='h-[calc(100%-80px)] lg:h-full w-full flex gap-4'>
            {children}
        </main>
    </div>
  )
}
