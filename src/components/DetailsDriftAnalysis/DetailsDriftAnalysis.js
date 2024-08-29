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

import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { generateDriftAnalysis } from './detailsDriftAnalysis.util'


import './detailsDriftAnalysis.scss'

const DetailsDriftAnalysis = ({ selectedItem }) => {
  const table = generateDriftAnalysis(selectedItem.status?.drift_measures)

  return (
    <div className="drift-analysis">
      <div className="drift-analysis__table">
        <div className="drift-analysis__table-header">
          {Object.values(table.header).map((cell, index) => (
            <div
              className={`drift-analysis__table-cell ${cell.className}`}
              key={index}
            >
              <Tooltip template={<TextTooltipTemplate text={cell.value} />}>
                {cell.value}
              </Tooltip>
            </div>
          ))}
        </div>
        <div className="drift-analysis__table-body">
          {table.body.map((row, rowIndex) => (
            <div key={rowIndex} className="drift-analysis__table-row">
              {Object.values(row).map((cell, index) => (
                <div
                  className={`drift-analysis__table-cell ${cell.className}`}
                  key={index}
                >
                  <Tooltip
                    className="data-ellipsis"
                    template={<TextTooltipTemplate text={cell.value} />}
                  >
                    {cell.value}
                  </Tooltip>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

DetailsDriftAnalysis.propTypes = {
  selectedItem: PropTypes.object.isRequired
}

export default DetailsDriftAnalysis
