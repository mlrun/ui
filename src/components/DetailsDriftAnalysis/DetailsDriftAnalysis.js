import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { generateDriftAnalysis } from './detailsDriftAnalysis.util'

import Loader from '../../common/Loader/Loader'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'

import './detailsDriftAnalysis.scss'

const DetailsDriftAnalysis = ({ detailsStore }) => {
  const table = generateDriftAnalysis(
    detailsStore.modelEndpoint.data.status?.drift_measures
  )

  return (
    <div className="drift-analysis">
      {detailsStore.modelEndpoint.loading && <Loader />}
      {detailsStore.modelEndpoint.error ? (
        <div className="drift-analysis__error">
          Failed fetched data from model endpoint analysis. Please, try again
          later.
        </div>
      ) : (
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
      )}
    </div>
  )
}

DetailsDriftAnalysis.propTypes = {
  detailsStore: PropTypes.shape({}).isRequired
}

export default connect(({ detailsStore }) => ({
  detailsStore
}))(DetailsDriftAnalysis)
