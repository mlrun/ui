/*
Copyright 2022 Iguazio Systems Ltd.
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
import { create } from 'react-modal-promise'
import { differenceWith, isEqual, get, omit, isEmpty, isNumber } from 'lodash'

import ConfirmDialog from '../components/ConfirmDialog/ConfirmDialog'

import {
  DANGER_BUTTON,
  FORBIDDEN_ERROR_STATUS_CODE,
  PRIMARY_BUTTON,
  TERTIARY_BUTTON,
  VIEW_SEARCH_PARAMETER
} from '../constants'
import { setFiltersWasHandled, showWarning } from '../reducers/commonDetailsReducer'
import { setNotification } from '../reducers/notificationReducer'
import { showErrorNotification } from './notification.util'

export const openPopUp = (element, props) => {
  return create(element)(props)
}

export const openConfirmPopUp = (message, confirmHandler) => {
  return openPopUp(ConfirmDialog, {
    cancelButton: {
      label: 'Cancel',
      variant: TERTIARY_BUTTON
    },
    confirmButton: {
      label: 'OK',
      variant: PRIMARY_BUTTON,
      handler: confirmHandler
    },
    header: 'Are you sure?',
    message
  })
}

export const openDeleteConfirmPopUp = (header, message, confirmHandler) => {
  return openPopUp(ConfirmDialog, {
    cancelButton: {
      label: 'Cancel',
      variant: TERTIARY_BUTTON
    },
    confirmButton: {
      label: 'Delete',
      variant: DANGER_BUTTON,
      handler: confirmHandler
    },
    header,
    message
  })
}

export const isEveryObjectValueEmpty = obj =>
  Object.values(obj).every(
    item => !item || item?.length === 0 || (!isNumber(item) && isEmpty(item))
  )

// Checks, whether two arrays of objects are equal, can omit some keys if their comparison is not necessary
export const areArraysEqual = (firstArray, secondArray, omitBy = []) => {
  if (firstArray.length !== secondArray.length) return false

  return isEmpty(
    differenceWith(firstArray, secondArray, (a, b) => {
      return isEqual(omit(a, omitBy), omit(b, omitBy))
    })
  )
}

const commonErrorMessagesMap = {
  [FORBIDDEN_ERROR_STATUS_CODE]: 'You do not have a permission to view this data'
}

/**
 * Get error information from the error object.
 *
 * @param {Error} error - The error object.
 * @returns {string} - The detailed error information.
 */
export const getErrorDetail = error => {
  const errorDetail = get(error, 'response.data.detail', null)

  if (typeof errorDetail === 'string') {
    return errorDetail
  } else {
    return get(errorDetail, 'reason', '')
  }
}

/**
 * Get the error message from the error object or a default error message.
 *
 * @param {Error} error - The error object.
 * @param {string} defaultError - The default error message.
 * @returns {string} - The error message.
 */
export const getErrorMsg = (error, defaultError) => {
  const errorDetail = getErrorDetail(error)
  const errorMsg = errorDetail || error.message

  if (
    (!errorMsg ||
      errorMsg === 'Not Found' ||
      errorMsg.startsWith('Request failed with status code')) &&
    defaultError
  ) {
    return defaultError
  } else {
    if (commonErrorMessagesMap[error.status]) {
      return commonErrorMessagesMap[error.status]
    }

    return errorMsg || ''
  }
}

/**
 * Retrieves the appropriate transition end event name based on the browser.
 *
 * @returns {string} The transition end event name.
 */
export const getTransitionEndEventName = () => {
  const transitions = {
    transition: 'transitionend',
    OTransition: 'oTransitionEnd',
    MozTransition: 'transitionend',
    WebkitTransition: 'webkitTransitionEnd'
  }

  let bodyStyle = document.body.style

  for (let transition in transitions) {
    if (bodyStyle[transition] !== undefined) {
      return transitions[transition]
    }
  }
}

export const getScssVariableValue = variableName => {
  return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim()
}

export const getViewMode = search => {
  return new URLSearchParams(search).get(VIEW_SEARCH_PARAMETER)?.toLowerCase()
}

export const performDetailsActionHelper = async (changes, dispatch, filtersWasHandled = false) => {
  let actionCanBePerformed = Promise.resolve(true)

  if (changes.counter > 0) {
    actionCanBePerformed = await new Promise(resolve => {
      const resolver = isSuccess => {
        window.removeEventListener('discardChanges', resolver)
        window.removeEventListener('cancelLeave', resolver)

        resolve(isSuccess)
      }

      window.addEventListener('discardChanges', () => resolver(true))
      window.addEventListener('cancelLeave', () => resolver(false))

      dispatch(setFiltersWasHandled(filtersWasHandled))
      dispatch(showWarning(true))
    })
  }

  return actionCanBePerformed
}

export const copyToClipboard = (textToCopy, dispatch) => {
  if (!navigator.clipboard?.writeText) {
    return showErrorNotification(
      dispatch,
      null,
      '',
      'Copy to clipboard failed due to unsecured connection'
    )
  }

  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      dispatch(
        setNotification({
          status: 200,
          id: Math.random(),
          message: 'Copied to clipboard successfully'
        })
      )
    })
    .catch(error => {
      showErrorNotification(dispatch, error, '', 'Copy to clipboard failed')
    })
}

export const roundFloats = (value, precision) => {
  if (
    ((typeof value === 'string' && value.trim() !== '') || typeof value === 'number') &&
    !isNaN(value)
  ) {
    const parsedNum = parseFloat(value)

    return parsedNum % 1 === 0 ? parsedNum : +parsedNum.toFixed(precision ?? 2)
  }

  return value
}

export const generateUrlFromRouterPath = link => {
  return new URL(link, window.location.origin).toString()
}
