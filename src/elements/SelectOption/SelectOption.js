import React from 'react'
import PropTypes from 'prop-types'

import CheckBox from '../../common/CheckBox/CheckBox'

const SelectOption = ({ item, onClick, selectedId, status }) => {
  return status ? (
    <div className="select__item">
      <CheckBox item={item} selectedId={selectedId} onChange={onClick}>
        <span className={`status ${item.id}`} /> {item.label}
      </CheckBox>
    </div>
  ) : (
    <div className="select__item" onClick={() => onClick(item.id)}>
      {item.label}
      {item.sub && <span className="sub-label">{item.sub}</span>}
    </div>
  )
}

SelectOption.defaultProps = {
  onClick: () => {}
}

SelectOption.propTypes = {
  item: PropTypes.shape({}).isRequired,
  onClick: PropTypes.func,
  selectedId: PropTypes.string,
  status: PropTypes.bool.isRequired
}

export default SelectOption
