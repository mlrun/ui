import React from 'react'
import PropTypes from 'prop-types'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'

import { ReactComponent as Primary } from '../../images/ic-key.svg'
import { ReactComponent as Partition } from '../../images/partition.svg'

import { generateMetadata } from './detailsMetadata.util'

import './detailsMetadata.scss'

const DetailsMetada = ({ selectedItem }) => {
  const { primaryKey } = selectedItem.schema || { primaryKey: '' }
  const metadata = generateMetadata(selectedItem)
  const headers = Object.keys(metadata[0])

  return (
    <div className="artifact-metadata">
      <div className="artifact-metadata__table">
        <div className="artifact-metadata__table-header">
          {headers.map(header => {
            return (
              <div
                className={`artifact-metadata__table-item header-item metadata-cell_${
                  !/icon/.test(header.toLowerCase()) ? header : 'icon'
                }`}
                key={header}
              >
                {!/icon/.test(header.toLowerCase()) && header}
              </div>
            )
          })}
        </div>
        <div className="artifact-metadata__table-body">
          {metadata.map((metadataItem, metadataItemIndex) => {
            return (
              <div
                key={metadataItem.name.value + metadataItemIndex}
                className="artifact-metadata__table-row"
              >
                {Object.keys(metadataItem).map((metadataKey, index) => {
                  return (
                    <div
                      key={Date.now() + index}
                      className={`artifact-metadata__table-item metadata-cell_${
                        metadataItem[metadataKey].type.match('icon')
                          ? 'icon'
                          : headers[index]
                      }`}
                    >
                      {metadataItem[metadataKey].type.match('icon-key') &&
                        (primaryKey.includes(metadataItem.name.value) ||
                          metadataItem[metadataKey].value === 'entity') && (
                          <Tooltip
                            template={
                              <TextTooltipTemplate
                                text={metadataKey.iconTooltip}
                              />
                            }
                          >
                            <Primary />
                          </Tooltip>
                        )}
                      {metadataItem[metadataKey].type.match('icon-partition') &&
                        metadataItem[metadataKey].value && (
                          <Tooltip
                            template={
                              <TextTooltipTemplate
                                text={metadataKey.iconTooltip}
                              />
                            }
                          >
                            <Partition />
                          </Tooltip>
                        )}
                      {!metadataItem[metadataKey].type.match('icon') && (
                        <Tooltip
                          className="data-ellipsis"
                          template={
                            <TextTooltipTemplate
                              text={`${metadataItem[metadataKey].value}`}
                            />
                          }
                        >
                          {metadataItem[metadataKey].value}
                        </Tooltip>
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

DetailsMetada.propTypes = {
  selectedItem: PropTypes.shape({}).isRequired
}

export default DetailsMetada
