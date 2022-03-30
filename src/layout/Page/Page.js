import React, { useEffect } from 'react'
import { connect } from 'react-redux'

import PageView from './PageView'
import appActions from '../../actions/app'

const Page = ({ children, fetchFrontendSpec }) => {
  useEffect(() => {
    fetchFrontendSpec()

    const interval = setInterval(fetchFrontendSpec, 60000)

    return () => clearInterval(interval)
  }, [fetchFrontendSpec])

  return <PageView>{children}</PageView>
}

export default connect(({ appStore }) => ({ appStore }), { ...appActions })(Page)
