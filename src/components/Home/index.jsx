import React from 'react'
import SideNavbar from '../SideNavbar'
import DisplayTree from '../DisplayTree'

function Home() {

  return (
    <div className='w-screen h-screen bg-red-300 flex justify-center items-center'>
        <SideNavbar/>
        <DisplayTree/>
    </div>
  )
}

export default Home