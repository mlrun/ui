import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import PageView from './PageView'
import appActions from '../../actions/app'

const Page = ({ fetchFrontendSpec, children }) => {
  useEffect(() => {
    fetchFrontendSpec()
  }, [fetchFrontendSpec])
  return <PageView>{children}</PageView>
}

export default connect(({ appStore }) => ({ appStore }), { ...appActions })(
  withRouter(Page)
)
