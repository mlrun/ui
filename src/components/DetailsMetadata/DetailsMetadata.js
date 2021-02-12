import React from 'react'
import PropTypes from 'prop-types'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import ChipCell from '../../common/ChipCell/ChipCell'

import { generateMetadata } from './detailsMetadata.util'

import './detailsMetadata.scss'

const DetailsMetadata = ({ selectedItem }) => {
  const { primaryKey } = selectedItem.schema ?? { primaryKey: '' }
  const metadata = generateMetadata(selectedItem, primaryKey)
  const headers = Object.keys(metadata[0]).map(key => ({
    value: key,
    visible: metadata.some(metadataItem => metadataItem[key].visible)
  }))

  return (
    <div className="artifact-metadata">
      <div className="artifact-metadata__table">
        <div className="artifact-metadata__table-header">
          {headers.map(header => {
            return header.visible ? (
              <div
                className={`artifact-metadata__table-item header-item metadata-cell_${
                  !/icon/.test(header.value.toLowerCase())
                    ? header.value
                    : 'icon'
                }`}
                key={header.value}
              >
                <Tooltip template={<TextTooltipTemplate text={header.value} />}>
                  {!/icon/.test(header.value.toLowerCase()) && header.value}
                </Tooltip>
              </div>
            ) : null
          })}
        </div>
        <div className="artifact-metadata__table-body">
          {metadata.map((metadataItem, metadataItemIndex) => (
            <div
              key={metadataItem.name.value + metadataItemIndex}
              className="artifact-metadata__table-row"
            >
              {Object.values(metadataItem).map((metadataValue, index) =>
                headers[index].visible ? (
                  <div
                    key={Date.now() + index}
                    className={`artifact-metadata__table-item metadata-cell_${
                      metadataValue.type.match('icon')
                        ? 'icon'
                        : headers[index].value
                    }`}
                  >
                    {metadataValue.type.match(/icon|html/) &&
                      metadataValue.visible &&
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
                ) : null
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

DetailsMetadata.propTypes = {
  selectedItem: PropTypes.shape({}).isRequired
}

export default DetailsMetadata
