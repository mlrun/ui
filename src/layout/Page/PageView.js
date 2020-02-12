import React from 'react'
import PropTypes from 'prop-types'
import Header from '../Header/Header'
import SideBar from '../SideBar/SideBar'

export default function PageView({ children, location }) {
  return (
    <div className="App">
      <Header />
      <SideBar location={location} />
      <main>{children}</main>
    </div>
  )
}

PageView.propTypes = {
  children: PropTypes.element.isRequired
}
