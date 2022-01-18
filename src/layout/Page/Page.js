import React, { useLayoutEffect, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { useDemoMode } from '../../hooks/demoMode.hook'

import PageView from './PageView'
import appActions from '../../actions/app'

const Page = ({ children, fetchFrontendSpec, history }) => {
  const isDemoMode = useDemoMode()

  const [savedDemoMode, setSavedDemoMode] = useState(isDemoMode)

  useEffect(() => {
    fetchFrontendSpec()

    const interval = setInterval(fetchFrontendSpec, 60000)

    return () => clearInterval(interval)
  }, [fetchFrontendSpec])

  useEffect(() => {
    if (isDemoMode) {
      setSavedDemoMode(true)
    }
  }, [isDemoMode])

  useLayoutEffect(() => {
    if (savedDemoMode && !isDemoMode) {
      history.replace({
        search: '?demo=true'
      })
    }
  }, [history, isDemoMode, savedDemoMode])

  return <PageView>{children}</PageView>
}

export default connect(({ appStore }) => ({ appStore }), { ...appActions })(
  withRouter(Page)
)
