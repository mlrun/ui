import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'

import { artifactInfoSourcesHeaders } from './artifactInfoSources.utils'

import './artifactInfoSources.scss'

import { ReactComponent as Arrow } from '../../images/arrow.svg'

const ArtifactInfoSources = ({ header, sources }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const sourcesLength = useMemo(() => {
    return Object.values(sources).length
  }, [sources])

  const sourcesClassNames = classnames(
    'info-sources',
    isExpanded && 'info-sources_expanded'
  )
  const sourcesRowClassNames = classnames(
    'info-sources-row',
    sourcesLength === 0 && 'info-sources-row_empty'
  )

  useEffect(() => {
    if (sourcesLength === 0) {
      setIsExpanded(false)
    }
  }, [sourcesLength, isExpanded])
  return (
    <div className={sourcesClassNames}>
      <div
        className={sourcesRowClassNames}
        onClick={() => {
          if (sourcesLength !== 0) setIsExpanded(prevState => !prevState)
        }}
      >
        {sourcesLength !== 0 && (
          <Arrow className={isExpanded ? 'expanded' : 'collapsed'} />
        )}

        <div className="info-sources-row__header">{header}</div>
        <div className="info-sources-row__data">
          {`${Object.values(sources).length} ${
            Object.values(sources).length <= 1 ? 'item' : 'items'
          }`}
        </div>
      </div>

      {isExpanded && (
        <div className="info-sources-table">
          <div className="info-sources-table__header">
            {artifactInfoSourcesHeaders.map(({ label, id, className }) => {
              const tableItemClassNames = classnames(
                'info-sources-table__header-item',
                className
              )

              return (
                <div key={id} className={tableItemClassNames}>
                  {label}
                </div>
              )
            })}
          </div>
          {Object.entries(sources).map(([key, value], index) => (
            <div
              key={`${key}-${index}`}
              className="info-sources-table__content"
            >
              <div className="info-sources-table__content-key">
                <Tooltip template={<TextTooltipTemplate text={key} />}>
                  {key}
                </Tooltip>
              </div>
              <div className="info-sources-table__content-value">{value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
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
