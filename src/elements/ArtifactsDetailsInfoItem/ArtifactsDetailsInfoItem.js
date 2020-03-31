import React from 'react'
import PropTypes from 'prop-types'
import ChipCell from '../ChipCell/ChipCell'

const ArtifactsDetailsInfoItem = ({
  header,
  chips,
  info,
  chipsClassName,
  target_path
}) => {
  return (
    <li className="table__item_details_item">
      <div className="table__item_details_item_header">{header}</div>
      {chips && (
        <div className="table__item_details_item_data">
          <ChipCell
            elements={chips}
            className={`table__item_details_item_data__${chipsClassName}`}
          />
        </div>
      )}
      {target_path && (
        <div className="table__item_details_item_data">
          <span>{`${target_path.schema ? `${target_path.schema}://` : ''}${
            target_path.path
          }`}</span>
        </div>
      )}
      {info && <div className="table__item_details_item_data">{info}</div>}
    </li>
  )
}

ArtifactsDetailsInfoItem.propTypes = {
  header: PropTypes.string,
  chips: PropTypes.array,
  info: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  chipsClassName: PropTypes.string,
  target_path: PropTypes.shape({})
}

export default ArtifactsDetailsInfoItem
