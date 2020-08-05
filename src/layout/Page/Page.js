import React from 'react'
import { withRouter } from 'react-router-dom'

import PageView from './PageView'

const Page = ({ children }) => {
  return <PageView>{children}</PageView>
}

export default withRouter(Page)
