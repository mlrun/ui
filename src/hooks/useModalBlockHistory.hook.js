import { useBlockHistory } from './useBlockHistory.hook'
import { useCallback, useEffect, useState } from 'react'
import { defaultCloseModalHandler } from '../utils/defaultCloseModalHandler'
import { isEqualValues } from 'igz-controls/utils/form.util'

export const useModalBlockHistory = (closeModal, form) => {
  const { blockHistory, unblockHistory } = useBlockHistory()
  const [confirmationIsOpened, setConfirmationIsOpened] = useState(false)

  const resolveModal = useCallback(
    retryNavigation => {
      closeModal()
      unblockHistory(retryNavigation)
    },
    [closeModal, unblockHistory]
  )

  const handleRejectConfirmation = useCallback(() => {
    setConfirmationIsOpened(false)
    unblockHistory(false)
  }, [unblockHistory])

  const handleCloseModal = useCallback(() => {
    const { initialValues, values, submitSucceeded } = form.getState()

    const showConfirmation = form && !isEqualValues(initialValues, values) && !submitSucceeded

    defaultCloseModalHandler(
      showConfirmation,
      () => resolveModal(submitSucceeded),
      handleRejectConfirmation,
      setConfirmationIsOpened,
      submitSucceeded
    )
  }, [form, resolveModal, handleRejectConfirmation])

  useEffect(() => {
    if (form) {
      blockHistory(handleCloseModal, confirmationIsOpened)
    }
  }, [confirmationIsOpened, blockHistory, handleCloseModal, form])

  return { handleCloseModal }
}
