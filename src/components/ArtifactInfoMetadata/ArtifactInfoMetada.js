import React from 'react'
import PropTypes from 'prop-types'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'

import { ReactComponent as Primary } from '../../images/ic-key.svg'

import './artifactInfoMetadata.scss'

const ArtifactInfoMetadata = ({ selectedItem }) => {
  const { primaryKey } = selectedItem.schema
  const metadata = selectedItem.schema.fields.map(field => ({
    'primary-key': 'primary-key',
    name: field.name,
    type: field.type,
    count: selectedItem?.stats?.[field.name]?.count,
    mean: selectedItem?.stats?.[field.name]?.mean,
    std: selectedItem?.stats?.[field.name]?.std?.toFixed(8),
    min: selectedItem?.stats?.[field.name]?.min,
    '25%': selectedItem?.stats?.[field.name]?.['25%'],
    '50%': selectedItem?.stats?.[field.name]?.['50%'],
    '75%': selectedItem?.stats?.[field.name]?.['75%'],
    max: selectedItem?.stats?.[field.name]?.max
  }))
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
                {header !== 'primary-key' && header}
              </div>
            )
          })}
        </div>
        <div className="artifact-metadata__table-body">
          {metadata.map(metadataItem => {
            return (
              <div
                key={metadataItem.name}
                className="artifact-metadata__table-row"
              >
                {Object.keys(metadataItem).map((metadataKey, index) => {
                  return (
                    <div
                      key={metadataKey}
                      className={`artifact-metadata__table-item metadata-cell_${headers[index]}`}
                    >
                      {metadataKey === 'primary-key' &&
                      primaryKey.includes(metadataItem.name) ? (
                        <Tooltip
                          template={
                            <TextTooltipTemplate text={'Primary key'} />
                          }
                        >
                          <Primary />
                        </Tooltip>
                      ) : (
                        metadataKey !== 'primary-key' &&
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
