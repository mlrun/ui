import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import ChipCell from '../../common/ChipCell/ChipCell'
import NoData from '../../common/NoData/NoData'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { generateMetadata } from './detailsMetadata.util'

import './detailsMetadata.scss'

const DetailsMetadata = ({ selectedItem }) => {
  const { primaryKey } = selectedItem.schema ?? { primaryKey: '' }
  const metadata = generateMetadata(selectedItem, primaryKey)
  const headers = Object.entries(metadata[0] ?? {}).map(([label, value]) => ({
    label,
    type: value.type,
    hidden: metadata.every(statisticsItem => statisticsItem[label].hidden)
  }))

  return metadata.length === 0 ? (
    <NoData />
  ) : (
    <div className="details-metadata">
      <div className="details-metadata__table">
        <div className="details-metadata__table-wrapper">
          <div className="details-metadata__table-header">
            {headers.map(({ label, type, hidden }) => {
              const metadataHeaderClassNames = classnames(
                'details-metadata__table-item',
                'header-item',
                `metadata-cell__${label}`,
                `metadata-cell__type_${type}`,
                hidden && 'metadata-cell_hidden'
              )

              return (
                <div className={metadataHeaderClassNames} key={label}>
                  <Tooltip template={<TextTooltipTemplate text={label} />}>
                    {type !== 'icon' && label}
                  </Tooltip>
                </div>
              )
            })}
          </div>
          <div className="details-metadata__table-body">
            {metadata.map((metadataItem, metadataItemIndex) => (
              <div
                key={metadataItem.name.value + metadataItemIndex}
                className="details-metadata__table-row"
              >
                {Object.values(metadataItem).map((metadataValue, index) => {
                  const metadataItemClassNames = classnames(
                    'details-metadata__table-item',
                    `metadata-cell__${headers[index].label}`,
                    `metadata-cell__type_${headers[index].type}`,
                    headers[index].hidden && 'metadata-cell_hidden'
                  )

                  return (
                    <div
                      key={Date.now() + index}
                      className={metadataItemClassNames}
                    >
                      {metadataValue.type.match(/icon|html/) &&
                        !metadataValue.hidden &&
                        metadataValue.value}
                      {metadataValue.type === 'chip' && (
                        <ChipCell
                          elements={metadataValue.value}
                          className={metadataValue.className}
                        />
                      )}
                      {!metadataValue.type.match(/icon|chip|html/) && (
                        <Tooltip
                          className="data-ellipsis"
                          template={
                            <TextTooltipTemplate
                              text={`${metadataValue.tooltip ??
                                metadataValue.value}`}
                            />
                          }
                        >
                          {metadataValue.value}
                        </Tooltip>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

DetailsMetadata.propTypes = {
  selectedItem: PropTypes.shape({}).isRequired
}

export default DetailsMetadata
