import { useContext, useRef, useCallback } from 'react'
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom'

export const useBlockHistory = () => {
  const unblock = useRef()
  const { navigator } = useContext(NavigationContext)
  const historyRetry = useRef()

  const blockHistory = useCallback(
    (unblockHandler, removeUnblockHandler) => {
      if (!unblock.current) {
        unblock.current = navigator.block(historyContext => {
          if (historyContext.action === 'PUSH') {
            unblock.current && unblock.current()
            historyContext.retry()

            return true
          }

          historyRetry.current = historyContext.retry
          unblockHandler()
        })
      } else if (!unblockHandler || removeUnblockHandler) {
        unblock.current()
        unblock.current = navigator.block(historyContext => {
          historyRetry.current = historyContext.retry

          return false
        })
      }
    },
    [navigator]
  )

  const unblockHistory = useCallback(retryNavigation => {
    retryNavigation && historyRetry.current()
    unblock.current()
    unblock.current = null
  }, [])

  return {
    blockHistory,
    unblockHistory
  }
}
