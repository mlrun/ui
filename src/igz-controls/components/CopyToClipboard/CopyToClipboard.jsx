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
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { useDispatch } from 'react-redux'

import RoundedIcon from '../RoundedIcon/RoundedIcon'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import Tooltip from '../Tooltip/Tooltip'

import { setNotification } from '../../reducers/notificationReducer'
import { showErrorNotification } from '../../utils/notification.util'

import Copy from '../../images/copy-to-clipboard-icon.svg?react'

const CopyToClipboard = ({
  children = null,
  className = '',
  disabled = false,
  textToCopy = '',
  tooltipText
}) => {
  const dispatch = useDispatch()
  const copyIsDisabled = useMemo(() => disabled || !textToCopy, [disabled, textToCopy])

  const copyToClipboard = textToCopy => {
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

  return (
    <div className={className} data-testid="copy-to-clipboard">
      {children ? (
        <Tooltip template={<TextTooltipTemplate text={tooltipText} />} textShow>
          <span onClick={() => copyToClipboard(textToCopy)}>{children}</span>
        </Tooltip>
      ) : (
        <RoundedIcon
          tooltipText={tooltipText}
          onClick={() => copyToClipboard(textToCopy)}
          disabled={copyIsDisabled}
        >
          <Copy />
        </RoundedIcon>
      )}
    </div>
  )
}

CopyToClipboard.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.element]),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  textToCopy: PropTypes.string,
  tooltipText: PropTypes.string.isRequired
}

export default CopyToClipboard
