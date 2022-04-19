import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import PageView from './PageView'
import { fetchFrontendSpec } from '../../reducers/appReducer'

const Page = ({ children }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchFrontendSpec())

    const interval = setInterval(() => dispatch(fetchFrontendSpec()), 60000)

    return () => clearInterval(interval)
  }, [dispatch])

  return <PageView>{children}</PageView>
}

export default Page
