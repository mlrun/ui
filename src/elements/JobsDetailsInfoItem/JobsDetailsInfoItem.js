import React from 'react'
import ChipCell from '../ChipCell/ChipCell'

const JobsDetailsInfoItem = ({ header, state, chips, info }) => {
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
            />
          }
        </div>
      )}
      {info && <div className="table__item_details_item_data">{info}</div>}
    </li>
  )
}

export default JobsDetailsInfoItem
