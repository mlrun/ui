import React from 'react'
import PropTypes from 'prop-types'

import arrow from '../../images/arrow.png'
import Download from '../../common/Download/Download'
import ArtifactsPreview from '../ArtifactsPreview/ArtifactsPreview'

const DetailsArtifactsView = ({ items, handleClick }) => (
  <div className="table__item_artifacts">
    {items.map((item, i) => {
      return (
        <div key={i} className="table__item_artifacts_wrapper">
          <div className="table__item_artifacts__row">
            <div
              className="table__item_artifacts__row_item"
              onClick={handleClick}
            >
              <img src={arrow} alt="Arrow icon" className="arrow" />
              {item.key}
            </div>
            <div className="table__item_artifacts__row_item table__item_artifacts__row_item_long">
              {item.target_path.schema && (
                <p>schema: {item.target_path.schema}</p>
              )}
              path: {item.target_path.path}
            </div>
            <div className="table__item_artifacts__row_item">
              size: {item.size}
            </div>
            <div className="table__item_artifacts__row_item">{item.date}</div>
            <div className="table__item_artifacts__row_item table__item_artifacts__row_item_short">
              <Download
                path={item.target_path.path}
                schema={item.target_path.schema}
              />
            </div>
          </div>
          <div className="table__item_artifacts__preview" key={i + 1}>
            <ArtifactsPreview artifact={item} />
          </div>
        </div>
      )
    })}
  </div>
)

DetailsArtifactsView.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleClick: PropTypes.func.isRequired,
  artifacts: PropTypes.shape({}).isRequired
}

export default DetailsArtifactsView
