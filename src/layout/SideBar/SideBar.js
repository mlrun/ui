import React, { useState } from 'react'
import SideBarView from './SideBarView'

const SideBar = ({ location }) => {
  const [currentPage, setCurrentPage] = useState(
    location.pathname.split('/')[1]
  )

  const handleMenuClick = value => {
    if (!currentPage.includes(value)) {
      document
        .getElementsByClassName('active sidebar__menu__item')[0]
        .classList.remove('active')
    }
    setCurrentPage(value)
  }
  return <SideBarView currentPage={currentPage} onClick={handleMenuClick} />
}

export default SideBar
