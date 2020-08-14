import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import CheckBox from '../../common/CheckBox/CheckBox'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

import './selectOption.scss'

const SelectOption = ({ disabled, item, onClick, selectType, selectedId }) => {
  if (selectType === 'checkbox') {
    return (
      <div className="select__item">
        <CheckBox item={item} selectedId={selectedId} onChange={onClick}>
          <span className={`status ${item.id}`} /> {item.label}
        </CheckBox>
      </div>
    )
  }

  const selectClassName = classnames('select__item', disabled && 'disabled')

  return (
    <div
      className={selectClassName}
      onClick={() => {
        !disabled && onClick(item.id)
      }}
    >
      {item.icon && <span className="select__icon">{item.icon}</span>}
      {item.label}
      {item.subLabel && (
        <Tooltip
          className="sub-label"
          template={<TextTooltipTemplate text={item.subLabel} />}
        >
          {item.subLabel}
        </Tooltip>
      )}
    </div>
  )
}

SelectOption.defaultProps = {
  onClick: () => {}
}

SelectOption.propTypes = {
  disabled: PropTypes.bool,
  item: PropTypes.shape({}).isRequired,
  onClick: PropTypes.func,
  selectType: PropTypes.string.isRequired,
  selectedId: PropTypes.string
}

export default SelectOption
