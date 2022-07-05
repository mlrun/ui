import { useBlockRootChange } from './useBlockRootChange'
import { useCallback, useEffect, useState } from 'react'
import { defaultCloseModalHandler } from '../utils/defaultCloseModalHandler'

export const useCloseModal = (onResolve, form) => {
  const { blockRootChange, unblockRootChange } = useBlockRootChange()
  const [confirmationIsOpened, setConfirmationIsOpened] = useState(false)

  const resolveModal = useCallback(() => {
    onResolve()
    unblockRootChange(false)
  }, [unblockRootChange, onResolve])

  const handleRejectConfirmation = useCallback(() => {
    setConfirmationIsOpened(false)
    unblockRootChange(false)
  }, [unblockRootChange])

  const handleCloseModal = useCallback(
    () => {
      const showConfirmation = form && form.getState().dirty

      defaultCloseModalHandler(
        showConfirmation,
        resolveModal,
        handleRejectConfirmation,
        setConfirmationIsOpened
      )
    },
    [form, resolveModal, handleRejectConfirmation]
  )

  useEffect(() => {
    if (form) {
      blockRootChange(handleCloseModal, confirmationIsOpened)
    }
  }, [confirmationIsOpened, blockRootChange, handleCloseModal, form])

  return { handleCloseModal, resolveModal }
}
