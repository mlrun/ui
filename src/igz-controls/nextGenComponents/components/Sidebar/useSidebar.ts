import * as React from 'react'

import type { SidebarContextValue } from './sidebar.types'
import { SidebarContext } from './sidebarContext'

export const useSidebar = (): SidebarContextValue => {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.')
  }
  return context
}
