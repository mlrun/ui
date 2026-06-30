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

import { BUTTON_VARIANTS, DENSITY } from '../../types'
import { TERTIARY_BUTTON } from '../../constants'

import './Button.scss'

let Button = (
  {
    className = '',
    density = 'normal',
    icon = null,
    iconPosition = 'left',
    id = 'btn',
    label = 'Button',
    tooltip = '',
    variant = TERTIARY_BUTTON,
    ...restProps
  },
  ref
) => {
  const buttonClassName = classNames('btn', `btn-${variant}`, `btn-${density}`, className)

  return (
    <button {...restProps} className={buttonClassName} ref={ref} data-testid={id}>
      {icon && iconPosition === 'left' && icon}
      {(tooltip || label) && (
        <Tooltip template={<TextTooltipTemplate text={tooltip || label} />}>
          {label && <span>{label}</span>}
        </Tooltip>
      )}
      {icon && iconPosition === 'right' && icon}
    </button>
  )
}

Button = forwardRef(Button)

Button.displayName = 'Button'

Button.propTypes = {
  className: PropTypes.string,
  density: DENSITY,
  icon: PropTypes.element,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  id: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  variant: BUTTON_VARIANTS
}

export default Button
