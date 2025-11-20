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
import React, { useMemo, memo } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'
import DetailsStatisticsTableRow from './DetailsStatisticsTableRow'

import {
  DETAILS_STATISTICS_TABLE_BODY_ID,
  DETAILS_STATISTICS_TABLE_ID,
  generateStatistics
} from './detailsStatistics.util'
import { getHistogramChartConfig } from '../../utils/getChartConfig'
import { isRowRendered, useVirtualization } from '../../hooks/useVirtualization.hook'
import { getScssVariableValue } from 'igz-controls/utils/common.util'

import './detailsStatistics.scss'

const DetailsStatistics = ({ selectedItem }) => {
  const itemInfoWithoutPadding = useMemo(() => getScssVariableValue('--itemInfoWithoutPadding'), [])
  const detailsStatisticsRowHeight = useMemo(
    () => getScssVariableValue('--detailsStatisticsRowHeight'),
    []
  )
  const detailsStatisticsHeaderRowHeight = useMemo(
    () => getScssVariableValue('--detailsStatisticsHeaderRowHeight'),
    []
  )
  const statistics = useMemo(() => generateStatistics(selectedItem), [selectedItem])
  const rowsSizes = useMemo(
    () => new Array(statistics.length).fill(parseInt(detailsStatisticsRowHeight)),
    [detailsStatisticsRowHeight, statistics.length]
  )
  const heightData = useMemo(
    () => ({
      headerRowHeight: detailsStatisticsHeaderRowHeight,
      rowHeight: detailsStatisticsRowHeight,
      rowHeightExtended: detailsStatisticsRowHeight
    }),
    [detailsStatisticsHeaderRowHeight, detailsStatisticsRowHeight]
  )
  const chartConfig = useMemo(() => getHistogramChartConfig, [])
  const headers = useMemo(
    () =>
      Object.entries(statistics[0]).map(([label, value]) => ({
        label,
        type: value.type,
        hidden: statistics.every(statisticsItem => statisticsItem[label].hidden)
      })),
    [statistics]
  )
  const virtualizationConfig = useVirtualization({
    heightData,
    ignoreHorizontalScroll: true,
    rowsSizes,
    tableBodyId: DETAILS_STATISTICS_TABLE_BODY_ID,
    tableId: DETAILS_STATISTICS_TABLE_ID
  })

  return (
    <div className={classnames('details-statistics', itemInfoWithoutPadding)}>
      <div className="details-statistics__table" id={DETAILS_STATISTICS_TABLE_ID}>
        <div className="details-statistics__table-wrapper">
          <div className="details-statistics__table-header">
            {headers.map(({ label, type, hidden }) => {
              const statisticsHeaderClassNames = classnames(
                'details-statistics__table-item',
                'header-item',
                `statistics-cell__${label}`,
                `statistics-cell__type_${type}`,
                hidden && 'statistics-cell_hidden'
              )

              return (
                <div className={statisticsHeaderClassNames} key={label}>
                  <Tooltip template={<TextTooltipTemplate text={label} />}>
                    {type !== 'icon' && label}
                  </Tooltip>
                </div>
              )
            })}
          </div>
          <div
            className="details-statistics__table-body"
            id={DETAILS_STATISTICS_TABLE_BODY_ID}
            style={{ paddingTop: virtualizationConfig.tableBodyPaddingTop || 0 }}
          >
            {statistics.map(
              (statisticsItem, statisticsItemIndex) =>
                isRowRendered(virtualizationConfig, statisticsItemIndex) && (
                  <DetailsStatisticsTableRow
                    key={statisticsItemIndex}
                    statisticsItem={statisticsItem}
                    chartConfig={chartConfig}
                    headers={headers}
                  />
                )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

DetailsStatistics.propTypes = {
  selectedItem: PropTypes.object.isRequired
}

export default memo(DetailsStatistics)
