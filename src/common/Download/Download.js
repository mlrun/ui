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
import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import classnames from 'classnames'

import { RoundedIcon, Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { setDownloadItem, setShowDownloadsList } from '../../reducers/downloadReducer'

import { ReactComponent as DownloadIcon } from 'igz-controls/images/download.svg'

import './download.scss'

const Download = ({
  className = '',
  disabled = false,
  fileName,
  onlyIcon = false,
  path,
  user,
  withoutIcon = false
}) => {
  const downloadRef = useRef(null)
  const dispatch = useDispatch()
  const downloadClassNames = classnames('download', className, disabled && 'download_disabled')

  const handleClick = () => {
    dispatch(
      setDownloadItem({
        filename: fileName,
        id: path + Date.now(),
        path,
        user: user
      })
    )
    dispatch(setShowDownloadsList(true))
  }

  return (
    <div
      className={downloadClassNames}
      data-testid="download-btn"
      ref={downloadRef}
      onClick={handleClick}
    >
      {onlyIcon ? (
        <Tooltip template={<TextTooltipTemplate text="Download" />}>
          <RoundedIcon>
            <DownloadIcon />
          </RoundedIcon>
        </Tooltip>
      ) : (
        <>
          <div className="download__label">Download</div>
          {!withoutIcon && <DownloadIcon />}
        </>
      )}
    </div>
  )
}

Download.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  fileName: PropTypes.string,
  onlyIcon: PropTypes.bool,
  path: PropTypes.string.isRequired,
  user: PropTypes.string,
  withoutIcon: PropTypes.bool
}

export default React.memo(Download)
