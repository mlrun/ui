import {
  SECONDARY_BUTTON,
  TERTIARY_BUTTON
} from '../../../dashboard-react-controls/src/lib/constants'
import { openPopUp } from 'igz-controls/utils/common.util'
import { ConfirmDialog } from 'igz-controls/components'

export const defaultCloseModalHandler = (formState, onResolve, onReject) => {
  if (formState && formState.dirty) {
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
