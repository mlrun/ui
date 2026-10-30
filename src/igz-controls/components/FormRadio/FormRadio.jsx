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
import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'
import classNames from 'classnames'

import Tooltip from '../Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

import './FormRadio.scss'

let FormRadio = ({
  className = '',
  name,
  label,
  readOnly = false,
  tooltip = '',
  ...inputProps
}) => {
  const formFieldClassNames = classNames(
    'form-field-radio',
    readOnly && 'form-field-radio_readonly',
    className
  )

  return (
    <Field name={name} value={inputProps.value} type="radio">
      {({ input }) => (
        <div
          className={formFieldClassNames}
          data-testid={name ? `${name}-${inputProps.value}-form-radio` : 'form-field-radio'}
        >
          <input
            className={classNames(input.checked ? 'checked' : 'unchecked')}
            type="radio"
            data-testid={name ? `${name}-${inputProps.value}-radio` : 'form-radio'}
            {...{
              ...input,
              ...inputProps
            }}
            checked={input.checked}
            id={name + inputProps.value}
          />
          {tooltip ? (
            <Tooltip className="label" template={<TextTooltipTemplate text={tooltip} />}>
              <label htmlFor={name + inputProps.value}>{label}</label>
            </Tooltip>
          ) : (
            <label htmlFor={name + inputProps.value}>{label}</label>
          )}
        </div>
      )}
    </Field>
  )
}

FormRadio.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
  tooltip: PropTypes.string
}

FormRadio = React.memo(FormRadio)

export default FormRadio
