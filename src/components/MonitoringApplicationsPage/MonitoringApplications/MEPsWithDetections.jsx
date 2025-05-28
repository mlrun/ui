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
import React, { memo, useMemo } from 'react'
import moment from 'moment'

import MlChart from '../../../common/MlChart/MlChart'
import { Tip } from 'igz-controls/components'
import PropTypes from 'prop-types'
import NoData from '../../../common/NoData/NoData'
import { MONITORING_APPLICATIONS_NO_DATA_MESSAGE } from '../MonitoringApplicationsPage.util'
import { getMEPsWithDetectionChartConfig } from '../../../utils/getChartConfig'
import { groupDataToBins } from './monitoringApplications.util'

const generateDummyData = (startTime, endTime) => {
  const data = []
  const endDate = moment(endTime)

  for (const startDate = moment(startTime); startDate < endDate; startDate.add(30, 'minute')) {
    data.push([
      startDate.utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
      Math.floor(Math.random() * 11)
    ])
  }

  return data
}



const MEPsWithDetections = ({
  // data,
  startTime = '2025-05-22T13:32:26.685Z',
  endTime = '2025-05-23T13:22:26.685Z'
}) => {
  const barConfig = useMemo(() => getMEPsWithDetectionChartConfig(), [])
  const data = generateDummyData(startTime, endTime) // todo remove and use real data

  const barChartConfig = useMemo(() => {
    const datasets = groupDataToBins(data, startTime, endTime)

    return {
      ...barConfig,
      data: {
        datasets: [
          {
            data: datasets,
            chartType: 'bar',
            tension: 0.2,
            borderWidth: 2,
            backgroundColor: '#13bbb1',
            borderColor: '#13bbb1'
          }
        ]
      }
    }
  }, [barConfig, data, endTime, startTime])

  return data?.length ? (
    <div className="monitoring-app__section-item">
      <div className="section-item_title">
        <span>Model Endpoint with detections</span>
        <Tip text="This chart displays the number of model endpoints that had at least one detected issue, in any monitoring application, in the relevant time period" />
      </div>
      <div className="section-item_chart-wrapper">
        <div className="section-item_chart">
          <MlChart config={barChartConfig} />
        </div>
      </div>
    </div>
  ) : (
    <NoData message={MONITORING_APPLICATIONS_NO_DATA_MESSAGE} />
  )
}

MEPsWithDetections.propTypes = {
  // data: PropTypes.array,
  startTime: PropTypes.string,
  endTime: PropTypes.string
}

export default memo(MEPsWithDetections)
