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
import { map } from 'lodash'
import cronstrue from 'cronstrue'

import Accordion from '../../../common/Accordion/Accordion'
import { Tooltip, TextTooltipTemplate, ChipCell } from 'igz-controls/components'

import Arrow from 'igz-controls/images/arrow.svg?react'

const ConfigSource = ({ selectedItem }) => {
  return (
    <Accordion accordionClassName="config-item" icon={<Arrow />} iconClassName="expand-icon">
      <div className="config-item__title">Source</div>
      <div className="config-item__content">
        <div className="row">
          <div className="row-label">Kind:</div>
          <div className="row-value data-ellipsis">
            <Tooltip template={<TextTooltipTemplate text={selectedItem.source?.kind} />}>
              {selectedItem.source?.kind}
            </Tooltip>
          </div>
        </div>
        <div className="row">
          <div className="row-label">URL:</div>
          <div className="row-value data-ellipsis">
            <Tooltip template={<TextTooltipTemplate text={selectedItem.source?.path} />}>
              {selectedItem.source?.path}
            </Tooltip>
          </div>
        </div>
        <div className="row">
          <div className="row-label">Attributes:</div>
          <div className="row-value">
            <ChipCell
              elements={map(selectedItem.source?.attributes, (value, key) => `${key}: ${value}`)}
              tooltip
            />
          </div>
        </div>
        <div className="row">
          <div className="row-label">Workers:</div>
          <div className="row-value data-ellipsis">
            <Tooltip template={<TextTooltipTemplate text={selectedItem.source?.workers} />}>
              {selectedItem.source?.workers}
            </Tooltip>
          </div>
        </div>
        <div className="row">
          <div className="row-label">Schedule:</div>
          <div className="row-value data-ellipsis">
            <Tooltip
              template={
                <TextTooltipTemplate
                  text={
                    selectedItem.source?.schedule &&
                    cronstrue.toString(selectedItem.source?.schedule)
                  }
                />
              }
            >
              {selectedItem.source?.schedule && cronstrue.toString(selectedItem.source?.schedule)}
            </Tooltip>
          </div>
        </div>
        <div className="row">
          <div className="row-label">Key column:</div>
          <div className="row-value data-ellipsis">
            <Tooltip template={<TextTooltipTemplate text={selectedItem.source?.key_column} />}>
              {selectedItem.source?.key_column}
            </Tooltip>
          </div>
        </div>
        <div className="row">
          <div className="row-label">Time column:</div>
          <div className="row-value data-ellipsis">
            <Tooltip template={<TextTooltipTemplate text={selectedItem.source?.time_column} />}>
              {selectedItem.source?.time_column}
            </Tooltip>
          </div>
        </div>
      </div>
    </Accordion>
  )
}

ConfigSource.propTypes = {
  selectedItem: PropTypes.object.isRequired
}

export default ConfigSource
