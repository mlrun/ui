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
import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

import { PANEL_DEFAULT_ACCESS_KEY } from '../../constants'

import CheckBox from '../../common/CheckBox/CheckBox'
import Input from '../../common/Input/Input'

import './panelCredentialsAccessKey.scss'

const PanelCredentialsAccessKey = ({
  className = '',
  credentialsAccessKey,
  isPanelEditMode = false,
  required = false,
  setCredentialsAccessKey,
  setValidation,
  validation
}) => {
  const [inputValue, setInputValue] = useState('')

  const accessKeyClassNames = classnames(className, 'new-item-side-panel__item', 'access-key')

  useEffect(() => {
    if (credentialsAccessKey !== PANEL_DEFAULT_ACCESS_KEY) {
      setInputValue(credentialsAccessKey)
    }
  }, [credentialsAccessKey])

  return (
    <div className={accessKeyClassNames}>
      <CheckBox
        disabled={isPanelEditMode}
        item={{
          id: PANEL_DEFAULT_ACCESS_KEY,
          label: 'Auto-generate access key'
        }}
        onChange={value => {
          if (value !== credentialsAccessKey && inputValue.length > 0) {
            setInputValue('')
          }

          setCredentialsAccessKey(value === credentialsAccessKey ? '' : value)
          setValidation(state => ({
            ...state,
            isAccessKeyValid: true
          }))
        }}
        selectedId={credentialsAccessKey}
      />
      {credentialsAccessKey !== PANEL_DEFAULT_ACCESS_KEY && (
        <Input
          floatingLabel
          label="Access Key"
          invalid={!validation.isAccessKeyValid}
          onBlur={event => {
            if (credentialsAccessKey !== event.target.value) {
              setCredentialsAccessKey(event.target.value)
            }
          }}
          onChange={setInputValue}
          required={required}
          setInvalid={value =>
            setValidation(state => ({
              ...state,
              isAccessKeyValid: value
            }))
          }
          value={inputValue}
          wrapperClassName="access-key__input"
        />
      )}
    </div>
  )
}

PanelCredentialsAccessKey.propTypes = {
  className: PropTypes.string,
  credentialsAccessKey: PropTypes.string.isRequired,
  isPanelEditMode: PropTypes.bool,
  required: PropTypes.bool,
  setCredentialsAccessKey: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.shape({}).isRequired
}

export default PanelCredentialsAccessKey
