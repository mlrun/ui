import React from 'react'
import PropTypes from 'prop-types'

import { generateStatistics } from './detailsStatistics.util'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'

import './detailsStatistics.scss'

const DetailsStatistics = ({ selectedItem }) => {
  const statistics = generateStatistics(selectedItem)
  const headers = Object.keys(statistics[0])

  return (
    <div className="details-statistics">
      <div className="details-statistics__table">
        <div className="details-statistics__table-header">
          {headers.map(header => (
            <div
              className={`details-statistics__table-item header-item statistics-cell_${header}`}
              key={header}
            >
              <Tooltip template={<TextTooltipTemplate text={header} />}>
                {header}
              </Tooltip>
            </div>
          ))}
        </div>
        <div className="details-statistics__table-body">
          {statistics.map((statisticsItem, statisticsItemIndex) => (
            <div
              key={statisticsItem.name.value + statisticsItemIndex}
              className="details-statistics__table-row"
            >
              {Object.values(statisticsItem).map((statisticsValue, index) => (
                <div
                  key={Date.now() + index}
                  className={`details-statistics__table-item statistics-cell_${headers[index]}`}
                >
                  <Tooltip
                    className="data-ellipsis"
                    template={
                      <TextTooltipTemplate text={`${statisticsValue.value}`} />
                    }
                  >
                    {statisticsValue.value}
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

DetailsStatistics.propTypes = {
  selectedItem: PropTypes.shape({}).isRequired
}

export default DetailsStatistics
