import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { ReactComponent as Arrow } from '../../images/arrow.svg'

import artifactData from '../Artifacts/artifactsData.json'

import './artifactInfoSources.scss'

const ArtifactInfoSources = ({ header, sources }) => {
  const [isShow, setIsShow] = useState(false)

  const sourcesLength = Object.values(sources).length

  useEffect(() => {
    if (sourcesLength === 0 && isShow === true) {
      setIsShow(false)
    }
  }, [sourcesLength, isShow])

  return (
    <li
      key={header}
      className={`${
        !isShow
          ? 'table__item_details_item sources'
          : 'table__item_details_item sources shadow'
      }`}
    >
      <div className="wrapper_sources">
        <div
          className="sources_header_container"
          onClick={() => {
            if (sourcesLength !== 0) setIsShow(!isShow)
          }}
        >
          {sourcesLength !== 0 && (
            <Arrow className={isShow ? 'open' : 'close'} />
          )}

          <div className="sources_header">{header}</div>
          <div className="sources_value">
            {`${Object.values(sources).length} ${
              Object.values(sources).length <= 1 ? 'item' : 'items'
            }`}
          </div>
        </div>

        {isShow && (
          <div className="source_table">
            <div className="source_item_header">
              {artifactData.sources.map(item => (
                <div key={item} className={`source_item_header_${item}`}>
                  {item}
                </div>
              ))}
            </div>
            {Object.entries(sources).map(([key, value], index) => (
              <div key={`${key}-${index}`} className="source_item">
                <div className="source_item_header">{key}</div>
                <div className="source_item_value">{value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </li>
  )
}

ArtifactInfoSources.defaultProps = {
  sources: {}
}

ArtifactInfoSources.propTypes = {
  header: PropTypes.string.isRequired,
  sources: PropTypes.shape({})
}

export default ArtifactInfoSources
