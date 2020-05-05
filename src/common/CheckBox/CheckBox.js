import React from 'react'
import PropTypes from 'prop-types'

import { ReactComponent as UnCheckBox } from '../../images/checkbox-unchecked.svg'
import { ReactComponent as Checkbox } from '../../images/checkbox-checked.svg'

import './checkBox.scss'

const CheckBox = ({ children, className, item, onChange, selectedId }) => {
  return (
    <span
      className={`checkbox ${className}`}
      onClick={() => {
        onChange(item.id === selectedId ? '' : item.id)
      }}
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
  className: null
}

CheckBox.propTypes = {
  className: PropTypes.string,
  item: PropTypes.shape({}).isRequired,
  onChange: PropTypes.func.isRequired,
  selectedId: PropTypes.string.isRequired
}

export default React.memo(CheckBox)
