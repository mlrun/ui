import React from 'react'
import PropTypes from 'prop-types'

import { generateDriftAnalysis } from './detailsDriftAnalysis.util'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'

import './detailsDriftAnalysis.scss'

const DetailsDriftAnalysis = ({ detailsStore }) => {
  const table = generateDriftAnalysis(detailsStore)

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
  detailsStore: PropTypes.shape({}).isRequired
}

export default DetailsDriftAnalysis
