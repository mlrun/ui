import React, { useState } from 'react'

import arrowIcon from '../../images/arrow.png'

import artifactData from '../Artifacts/artifactsData.json'

import './artifactinfosources.scss'

const ArtifactInfoSources = ({ header, sources }) => {
  const [isShow, setIsShow] = useState(false)

  const sourcesLength = Object.values(sources).length

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
            <img
              className={isShow ? 'open' : 'close'}
              src={arrowIcon}
              alt="arrow"
            />
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

export default ArtifactInfoSources
