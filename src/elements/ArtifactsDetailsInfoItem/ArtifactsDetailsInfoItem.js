import React from 'react'
import ChipCell from '../ChipCell/ChipCell'

const ArtifactsDetailsInfoItem = ({
  header,
  chips,
  info,
  handleShowElements,
  target_path
}) => {
  return (
    <li className="table__item_details_item">
      <div className="table__item_details_item_header">{header}</div>
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
      {target_path && (
        <div className="table__item_details_item_data">
          <span>{target_path.path}</span>
        </div>
      )}
      {info && <div className="table__item_details_item_data">{info}</div>}
    </li>
  )
}

export default ArtifactsDetailsInfoItem
