import React, { useEffect, useState } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

import { PANEL_DEFAULT_ACCESS_KEY } from '../../constants'

import CheckBox from '../../common/CheckBox/CheckBox'
import Input from '../../common/Input/Input'

import './panelCredentialsAccessKey.scss'

const PanelCredentialsAccessKey = ({
  className,
  credentialsAccessKey,
  required,
  setCredentialsAccessKey,
  setValidation,
  validation
}) => {
  const [inputValue, setInputValue] = useState('')

  const accessKeyClassNames = classnames(
    className,
    'new-item-side-panel__item',
    'access-key'
  )

  useEffect(() => {
    if (credentialsAccessKey !== PANEL_DEFAULT_ACCESS_KEY) {
      setInputValue(credentialsAccessKey)
    }
  }, [credentialsAccessKey])

  return (
    <div className={accessKeyClassNames}>
      <CheckBox
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

PanelCredentialsAccessKey.defaultProps = {
  className: '',
  required: false
}

PanelCredentialsAccessKey.propTypes = {
  className: PropTypes.string,
  credentialsAccessKey: PropTypes.string.isRequired,
  required: PropTypes.bool,
  setCredentialsAccessKey: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.shape({}).isRequired
}

export default PanelCredentialsAccessKey
