import { useBlockHistory } from './useBlockHistory.hook'
import { useCallback, useEffect, useState } from 'react'
import { defaultCloseModalHandler } from '../utils/defaultCloseModalHandler'

export const useModalBlockHistory = (closeModal, form) => {
  const { blockHistory, unblockHistory } = useBlockHistory()
  const [confirmationIsOpened, setConfirmationIsOpened] = useState(false)

  const resolveModal = useCallback(() => {
    closeModal()
    unblockHistory(false)
  }, [unblockHistory, closeModal])

  const handleRejectConfirmation = useCallback(() => {
    setConfirmationIsOpened(false)
    unblockHistory(false)
  }, [unblockHistory])

  const handleCloseModal = useCallback(() => {
    const showConfirmation = form && form.getState().dirty

    defaultCloseModalHandler(
      showConfirmation,
      resolveModal,
      handleRejectConfirmation,
      setConfirmationIsOpened
    )
  }, [form, resolveModal, handleRejectConfirmation])

  useEffect(() => {
    if (form) {
      blockHistory(handleCloseModal, confirmationIsOpened)
    }
  }, [confirmationIsOpened, blockHistory, handleCloseModal, form])

  useEffect(() => {
    return () => {
      resolveModal()
    }
  }, [resolveModal])

  return { handleCloseModal }
}
