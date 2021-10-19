import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { isDemoMode } from '../utils/helper'

export const useDemoMode = () => {
  const [isDemo, setIsDemo] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setIsDemo(isDemoMode(location.search))
  }, [location.search])

  return isDemo
}
