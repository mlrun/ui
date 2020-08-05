import React from 'react'
import Header from '../Header/Header'

export default function PageView({ children }) {
  return (
    <div className="App">
      <Header />
      <main>{children}</main>
    </div>
  )
}
