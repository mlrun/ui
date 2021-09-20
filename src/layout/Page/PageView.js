import React from 'react'
import Header from '../Header/Header'
import Notification from '../../common/Notification/Notification'

export default function PageView({ children }) {
  const headerShown =
    window.localStorage.getItem('mlrunUi.headerHidden') !== 'true'
  return (
    <div className="App">
      {headerShown && <Header />}
      <main id="main">{children}</main>
      <Notification />
    </div>
  )
}
