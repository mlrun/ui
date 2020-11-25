import React from 'react'
import PropTypes from 'prop-types'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'

import { ReactComponent as Primary } from '../../images/ic-key.svg'

import { generateMetadata } from './artifactInfoMetadata.util'

import './artifactInfoMetadata.scss'

const ArtifactInfoMetadata = ({ selectedItem }) => {
  const { primaryKey } = selectedItem.schema || {}
  const metadata = generateMetadata(selectedItem)
  const headers = Object.keys(metadata[0])

  return (
    <div className="artifact-metadata">
      <div className="artifact-metadata__table">
        <div className="artifact-metadata__table-header">
          {headers.map(header => {
            return (
              <div
                className={`artifact-metadata__table-item header-item metadata-cell_${header}`}
                key={header}
              >
                {header !== 'primary-key' && header !== 'entity' && header}
              </div>
            )
          })}
        </div>
        <div className="artifact-metadata__table-body">
          {metadata.map((metadataItem, metadataItemIndex) => {
            return (
              <div
                key={metadataItem.name + metadataItemIndex}
                className="artifact-metadata__table-row"
              >
                {Object.keys(metadataItem).map((metadataKey, index) => {
                  return (
                    <div
                      key={metadataKey + index}
                      className={`artifact-metadata__table-item metadata-cell_${headers[index]}`}
                    >
                      {(metadataKey === 'primary-key' &&
                        primaryKey.includes(metadataItem.name)) ||
                      metadataItem[metadataKey] === 'entity' ? (
                        <Tooltip
                          template={
                            metadataItem[metadataKey] !== 'entity' ? (
                              <TextTooltipTemplate text={'Primary key'} />
                            ) : null
                          }
                        >
                          <Primary />
                        </Tooltip>
                      ) : (
                        metadataKey !== 'primary-key' &&
                        metadataKey !== 'entity' &&
                        metadataItem[metadataKey] && (
                          <Tooltip
                            className="data-ellipsis"
                            template={
                              <TextTooltipTemplate
                                text={`${metadataItem[metadataKey]}`}
                              />
                            }
                          >
                            {metadataItem[metadataKey]}
                          </Tooltip>
                        )
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

ArtifactInfoMetadata.propTypes = {
  selectedItem: PropTypes.shape({}).isRequired
}

export default ArtifactInfoMetadata
