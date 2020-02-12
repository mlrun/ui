import React, { useState, useEffect } from 'react'
import SideBarView from './SideBarView'

const SideBar = ({ location }) => {
  const [currentPage, setCurrentPage] = useState(
    location.pathname.split('/')[1]
  )

  useEffect(() => {
    setCurrentPage(location.pathname.split('/')[1])
  }, [location.pathname])

  return <SideBarView currentPage={currentPage} />
}

export default SideBar
