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
import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'
import classNames from 'classnames'

import './formCheckBox.scss'

let FormCheckBox = ({
  children = null,
  className = '',
  highlightLabel = false,
  label = '',
  name,
  readOnly = false,
  ...inputProps
}) => {
  const formFieldClassNames = classNames(
    'form-field-checkbox',
    readOnly && 'form-field-checkbox_readonly',
    className
  )
  const labelClassNames = classNames(highlightLabel && 'highlighted')
  const inputRef = useRef(null)

  return (
    <Field name={name} value={inputProps.value} type="checkbox">
      {({ input }) => {
        return (
          <div className={formFieldClassNames} data-testid="form-field-checkbox">
            <input
              ref={inputRef}
              className={classNames(input.checked ? 'checked' : 'unchecked')}
              type="checkbox"
              data-testid={name ? `${name}-form-checkbox` : 'form-checkbox'}
              id={inputProps.value ?? name}
              {...{ ...input, ...inputProps }}
              value={String(input.checked)}
            />
            <label htmlFor={inputProps.value ?? name} className={labelClassNames}>
              {label ? label : ''}
              {children}
            </label>
          </div>
        )
      }}
    </Field>
  )
}

FormCheckBox.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  highlightLabel: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  name: PropTypes.string.isRequired,
  readOnly: PropTypes.bool
}

FormCheckBox = React.memo(FormCheckBox)

export default FormCheckBox
