import { useContext, useRef, useCallback } from 'react'
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom'

export const useBlockRootChange = () => {
  const unblockRootChange = useRef()
  const { navigator } = useContext(NavigationContext)
  const retryNavigate = useRef()

  const blockRootChange = useCallback(
    (unblockHandler, removeUnblockHandler) => {
      if (!unblockRootChange.current) {
        unblockRootChange.current = navigator.block(tx => {
          retryNavigate.current = tx.retry
          unblockHandler()

          return false
        })
      } else if (removeUnblockHandler) {
        unblockRootChange.current()
        unblockRootChange.current = navigator.block(tx => {
          retryNavigate.current = tx.retry

          return false
        })
      }
    },
    [navigator]
  )

  const handleUnblockRootChange = useCallback(retryRootChange => {
    retryRootChange && retryNavigate.current()
    unblockRootChange.current()
    unblockRootChange.current = null
  }, [])

  return {
    blockRootChange,
    handleUnblockRootChange
  }
}
