import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { ReactComponent as UnCheckBox } from 'igz-controls/images/checkbox-unchecked.svg'
import { ReactComponent as Checkbox } from 'igz-controls/images/checkbox-checked.svg'

import './checkBox.scss'

const CheckBox = ({ children, className, disabled, item, onChange, selectedId }) => {
  const checkboxClassName = classnames('checkbox', className, disabled && 'checkbox_disabled')

  return (
    <span
      className={checkboxClassName}
      onClick={() => !disabled && onChange(item.id)
      }
    >
      {item.id === selectedId ? (
        <Checkbox className="checked" />
      ) : (
        <UnCheckBox className="unchecked" />
      )}
      {children || item.label}
    </span>
  )
}

CheckBox.defaultProps = {
  className: '',
  disabled: false,
  selectedId: ''
}

CheckBox.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  selectedId: PropTypes.string
}

export default React.memo(CheckBox)
