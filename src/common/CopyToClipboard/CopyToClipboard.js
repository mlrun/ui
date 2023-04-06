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
import { useDispatch } from 'react-redux'

import { Tooltip, TextTooltipTemplate, RoundedIcon } from 'igz-controls/components'

import { setNotification } from '../../reducers/notificationReducer'

import { ReactComponent as Copy } from 'igz-controls/images/ic_copy-to-clipboard.svg'

const CopyToClipboard = ({ children, className, textToCopy, tooltipText }) => {
  const dispatch = useDispatch()

  const copyToClipboard = textToCopy => {
    navigator.permissions
      .query({ name: 'clipboard-read', allowWithoutGesture: false })
      .then(result => {
        if (result.state === 'granted' || result.state === 'prompt') {
          return navigator.clipboard.writeText(textToCopy).then(() => {
            dispatch(
              setNotification({
                status: 200,
                id: Math.random(),
                message: 'Copied to clipboard successfully'
              })
            )
          })
        }
      })
      .catch(err => {
        dispatch(
          setNotification({
            error: err,
            status: 400,
            id: Math.random(),
            message: 'Copy to clipboard failed'
          })
        )
      })
  }

  return (
    <div className={className} data-testid="copy-to-clipboard">
      {children ? (
        <Tooltip template={<TextTooltipTemplate text={tooltipText} />}>
          <span onClick={() => copyToClipboard(textToCopy)}>{children}</span>
        </Tooltip>
      ) : (
        <RoundedIcon tooltipText={tooltipText} onClick={() => copyToClipboard(textToCopy)}>
          <Copy />
        </RoundedIcon>
      )}
    </div>
  )
}

CopyToClipboard.defaultProps = {
  children: null,
  className: ''
}

CopyToClipboard.propTypes = {
  children: PropTypes.string,
  className: PropTypes.string,
  textToCopy: PropTypes.string.isRequired,
  tooltipText: PropTypes.string.isRequired
}

export default CopyToClipboard
