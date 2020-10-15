import React from 'react'
import Header from '../Header/Header'

export default function PageView({ children }) {
  const headerShown =
    window.localStorage.getItem('mlrunUi.headerHidden') !== 'true'
  return (
    <div className="App">
      {headerShown && <Header />}
      <main>{children}</main>
    </div>
  )
}
