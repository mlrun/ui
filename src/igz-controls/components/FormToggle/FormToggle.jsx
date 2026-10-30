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
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'

import Tip from '../Tip/Tip'
import { DENSITY } from '../../types.js'

import './formToggle.scss'

const FormToggle = ({
  className = '',
  density = '',
  label = '',
  labelTip = '',
  name,
  readOnly = false,
  onChange = () => {},
  ...inputProps
}) => {
  const formFieldClassNames = classnames(
    'form-field-toggle',
    'form-field__wrapper',
    density && `form-field__wrapper-${density}`,
    (label || labelTip) && 'form-field-toggle_has-label',
    className
  )

  return (
    <Field name={name} value={inputProps.value} type="checkbox">
      {({ input }) => (
        <div
          className={formFieldClassNames}
          data-testid={name ? `${name}-form-field-toggle` : 'form-field-toggle'}
        >
          {(label || labelTip) && (
            <label htmlFor={name} className="form-field-toggle__label">
              {label}
              {labelTip && <Tip text={labelTip} />}
            </label>
          )}
          <label htmlFor={name} className="form-field-toggle__toggle-wrapper">
            <input
              type="checkbox"
              data-testid={name ? `${name}-form-toggle` : 'form-toggle'}
              id={name}
              {...{ ...input, ...inputProps }}
              value={String(input.checked)}
              disabled={readOnly}
              onChange={event => {
                onChange?.(event)
                input.onChange(event)
              }}
            />
            <span className="form-field-toggle__switch" />
          </label>
        </div>
      )}
    </Field>
  )
}

FormToggle.propTypes = {
  className: PropTypes.string,
  density: DENSITY,
  label: PropTypes.string,
  labelTip: PropTypes.string,
  name: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
  onChange: PropTypes.func
}

export default FormToggle
