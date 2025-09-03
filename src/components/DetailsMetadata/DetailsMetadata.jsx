/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import NoData from '../../common/NoData/NoData'
import { Tooltip, TextTooltipTemplate, ChipCell } from 'igz-controls/components'

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
                    <div key={Date.now() + index} className={metadataItemClassNames}>
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
                              text={`${metadataValue.tooltip ?? metadataValue.value}`}
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
  selectedItem: PropTypes.object.isRequired
}

export default DetailsMetadata
