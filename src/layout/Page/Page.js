import React, { useLayoutEffect, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import PageView from './PageView'
import appActions from '../../actions/app'
import { isDemoMode } from '../../utils/helper'

const Page = ({ children, fetchFrontendSpec, history, location }) => {
  const [savedDemoMode, setSavedDemoMode] = useState(
    isDemoMode(location.search)
  )

  useEffect(() => {
    fetchFrontendSpec()

    const interval = setInterval(fetchFrontendSpec, 60000)

    return () => clearInterval(interval)
  }, [fetchFrontendSpec])

  useEffect(() => {
    if (isDemoMode(location.search)) {
      setSavedDemoMode(true)
    }
  }, [location.search])

  useLayoutEffect(() => {
    if (savedDemoMode && !isDemoMode(location.search)) {
      history.replace({
        search: '?demo=true'
      })
    }
  }, [history, location.search, savedDemoMode])

  return <PageView>{children}</PageView>
}

export default connect(({ appStore }) => ({ appStore }), { ...appActions })(
  withRouter(Page)
)
