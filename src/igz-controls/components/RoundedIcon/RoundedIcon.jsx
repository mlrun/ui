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
import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Tooltip from '../Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

import './roundedIcon.scss'

let RoundedIcon = (
  {
    children,
    className = '',
    disabled = false,
    id = '',
    isActive = false,
    onClick = () => {},
    tooltipText = ''
  },
  ref
) => {
  const wrapperClassNames = classNames('round-icon-cp', className)
  const IconClassNames = classNames(
    'round-icon-cp__circle',
    isActive && 'round-icon-cp__circle-active',
    disabled && 'round-icon-cp__circle-disabled'
  )

  return (
    <div className={wrapperClassNames} ref={ref} data-testid={id}>
      <Tooltip hidden={!tooltipText} id={id} template={<TextTooltipTemplate text={tooltipText} />}>
        <button onClick={onClick} disabled={disabled} className={IconClassNames}>
          {children}
        </button>
      </Tooltip>
    </div>
  )
}

RoundedIcon = React.memo(forwardRef(RoundedIcon))

RoundedIcon.displayName = 'RoundedIcon'

RoundedIcon.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
  tooltipText: PropTypes.string
}

export default RoundedIcon
