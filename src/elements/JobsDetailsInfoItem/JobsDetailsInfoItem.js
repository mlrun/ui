import React from 'react'
import PropTypes from 'prop-types'

import ChipCell from '../ChipCell/ChipCell'

const JobsDetailsInfoItem = ({
  chips,
  header,
  info,
  handleShowElements,
  state
}) => {
  return (
    <li className="table__item_details_item">
      <div className="table__item_details_item_header">{header}</div>
      {state && (
        <div className="table__item_details_item_data">
          {`${state[0].toUpperCase()}${state.slice(1)}`}
          <i className={state} />
        </div>
      )}
      {chips && (
        <div className="table__item_details_item_data">
          {
            <ChipCell
              elements={chips}
              className="table__item_details_item_data__parameters"
              handleShowElements={handleShowElements}
            />
          }
        </div>
      )}
      {info && <div className="table__item_details_item_data">{info}</div>}
    </li>
  )
}

JobsDetailsInfoItem.propTypes = {
  chips: PropTypes.arrayOf(PropTypes.shape({})),
  header: PropTypes.string.isRequired
}

export default JobsDetailsInfoItem
