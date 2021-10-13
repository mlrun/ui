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
  setCredentialsAccessKey
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
        }}
        selectedId={credentialsAccessKey}
      />
      {credentialsAccessKey !== PANEL_DEFAULT_ACCESS_KEY && (
        <Input
          floatingLabel
          label="Access Key"
          onBlur={event => {
            if (credentialsAccessKey !== event.target.value) {
              setCredentialsAccessKey(event.target.value)
            }
          }}
          onChange={setInputValue}
          value={inputValue}
          wrapperClassName="access-key__input"
        />
      )}
    </div>
  )
}

PanelCredentialsAccessKey.defaultProps = {
  className: ''
}

PanelCredentialsAccessKey.propTypes = {
  className: PropTypes.string,
  credentialsAccessKey: PropTypes.string.isRequired,
  setCredentialsAccessKey: PropTypes.func.isRequired
}

export default PanelCredentialsAccessKey
