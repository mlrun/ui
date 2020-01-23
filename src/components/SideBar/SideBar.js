import React, { useState } from 'react'
import SideBarView from './SideBarView'

const SideBar = () => {
  const [currentPage, setCurrentPage] = useState('jobs')

  const handleMenuClick = value => {
    if (value !== currentPage) {
      document
        .getElementsByClassName('active sidebar__menu__item')[0]
        .classList.remove('active')
    }
    setCurrentPage(value)
  }
  return <SideBarView currentPage={currentPage} onClick={handleMenuClick} />
}

export default SideBar
