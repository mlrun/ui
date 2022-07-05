import { useContext, useRef, useCallback } from 'react'
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom'

export const useBlockRootChange = () => {
  const unblock = useRef()
  const { navigator } = useContext(NavigationContext)
  const retryNavigate = useRef()

  const blockRootChange = useCallback(
    (unblockHandler, removeUnblockHandler) => {
      if (!unblock.current) {
        unblock.current = navigator.block(tx => {
          retryNavigate.current = tx.retry
          unblockHandler()

          return false
        })
      } else if (removeUnblockHandler) {
        unblock.current()
        unblock.current = navigator.block(tx => {
          retryNavigate.current = tx.retry

          return false
        })
      }
    },
    [navigator]
  )

  const unblockRootChange = useCallback(retryRootChange => {
    retryRootChange && retryNavigate.current()
    unblock.current()
    unblock.current = null
  }, [])

  return {
    blockRootChange,
    unblockRootChange
  }
}
