/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import * as React from 'react'

import { cn } from '../../lib/utils'
import { TooltipProvider } from '../ui/tooltip'
import { SidebarContext } from './sidebarContext'

const SIDEBAR_COOKIE_NAME = 'sidebar_state'
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = '15rem'
const SIDEBAR_WIDTH_ICON = '70px'
const SIDEBAR_KEYBOARD_SHORTCUT = 'b'

interface SidebarProviderProps extends React.ComponentProps<'div'> {
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  open?: boolean
}

export function SidebarProvider({
  children,
  className,
  defaultOpen = true,
  onOpenChange,
  open: openProp,
  style,
  ref,
  ...props
}: SidebarProviderProps) {
  const [pinned, setPinned] = React.useState<boolean>(() => {
    try {
      return JSON.parse(localStorage.getItem('isNavbarPinned') || 'false')
    } catch {
      return false
    }
  })
  const [hoverLocked, setHoverLocked] = React.useState(false)
  const [_open, _setOpen] = React.useState(defaultOpen || pinned)
  const open = openProp ?? _open

  const setOpen = React.useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      const openState = typeof value === 'function' ? value(open) : value
      if (onOpenChange) {
        onOpenChange(openState)
      } else {
        _setOpen(openState)
      }
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    },
    [onOpenChange, open]
  )

  const toggleSidebar = React.useCallback(() => setOpen(prev => !prev), [setOpen])

  const togglePin = React.useCallback(() => {
    setPinned(prev => {
      const newValue = !prev
      localStorage.setItem('isNavbarPinned', JSON.stringify(newValue))
      setOpen(newValue)
      return newValue
    })
  }, [setOpen])

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        toggleSidebar()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleSidebar])

  const state: 'expanded' | 'collapsed' = open ? 'expanded' : 'collapsed'

  const contextValue = React.useMemo(
    () => ({
      state,
      open,
      setOpen,
      toggleSidebar,
      pinned,
      togglePin,
      hoverLocked,
      setHoverLocked
    }),
    [state, open, setOpen, toggleSidebar, pinned, togglePin, hoverLocked]
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH,
              '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
              ...style
            } as React.CSSProperties
          }
          className={cn(
            'group/sidebar-wrapper flex h-full w-full has-[[data-variant=inset]]:bg-sidebar',
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  )
}
SidebarProvider.displayName = 'SidebarProvider'
