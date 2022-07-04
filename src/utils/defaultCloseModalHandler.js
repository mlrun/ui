import {
  SECONDARY_BUTTON,
  TERTIARY_BUTTON
} from '../../../dashboard-react-controls/src/lib/constants'
import { openPopUp } from 'igz-controls/utils/common.util'
import { ConfirmDialog } from 'igz-controls/components'

export const defaultCloseModalHandler = (
  showConfirmation,
  onResolve,
  onReject,
  setConfirmationIsOpened
) => {
  if (showConfirmation) {
    setConfirmationIsOpened && setConfirmationIsOpened(true)
    openPopUp(ConfirmDialog, {
      cancelButton: {
        label: 'Cancel',
        handler: () => {
          onReject && onReject()
        },
        variant: TERTIARY_BUTTON
      },
      confirmButton: {
        handler: () => {
          onResolve && onResolve()
        },
        label: 'OK',
        variant: SECONDARY_BUTTON
      },
      header: 'Are you sure?',
      message: 'All changes will be lost'
    })
  } else {
    onResolve()
  }
}
