import * as React from 'react'

import type { SidebarContextValue } from './sidebar.types'

export const SidebarContext = React.createContext<SidebarContextValue | null>(null)
