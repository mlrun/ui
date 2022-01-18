import { useLocation } from 'react-router-dom'
import { useLayoutEffect, useState } from 'react'

import { isPanelOpened } from '../utils/helper'

export const useOpenPanel = () => {
  const [panelOpened, setPanelOpened] = useState(false)
  const location = useLocation()

  useLayoutEffect(() => {
    setPanelOpened(isPanelOpened(location.search))
  }, [location.search])

  return panelOpened
}
