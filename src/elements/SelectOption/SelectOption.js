import React from 'react'
import PropTypes from 'prop-types'

import { ReactComponent as Checked } from '../../images/checkbox-checked.svg'
import { ReactComponent as Unchecked } from '../../images/checkbox-unchecked.svg'

const SelectOption = ({ item, onClick, status, value }) => {
  return (
    <div className="select__item" onClick={() => onClick(item)}>
      {status && (
        <>
          {value === item ? <Checked /> : <Unchecked />}
          <span className={`status_${item.toLowerCase()}`} />
        </>
      )}
      {item}
    </div>
  )
}

SelectOption.defaultProps = {
  onClick: () => {}
}

SelectOption.propTypes = {
  item: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  status: PropTypes.bool.isRequired,
  value: PropTypes.string
}

export default SelectOption
