import React from 'react'
import PropTypes from 'prop-types'

import CheckBox from '../../common/CheckBox/CheckBox'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

const SelectOption = ({ item, onClick, selectType, selectedId }) => {
  if (selectType === 'checkbox') {
    return (
      <div className="select__item">
        <CheckBox item={item} selectedId={selectedId} onChange={onClick}>
          <span className={`status ${item.id}`} /> {item.label}
        </CheckBox>
      </div>
    )
  }

  return (
    <div className="select__item" onClick={() => onClick(item.id)}>
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
  item: PropTypes.shape({}).isRequired,
  onClick: PropTypes.func,
  selectType: PropTypes.string.isRequired,
  selectedId: PropTypes.string
}

export default SelectOption
