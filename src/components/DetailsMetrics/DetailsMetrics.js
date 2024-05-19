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
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { isEmpty } from 'lodash'

import detailsActions from '../../actions/details'

const DetailsMetrics = ({ selectedItem }) => {
  const [metrics, setMetrics] = useState([])
  const detailsStore = useSelector(store => store.detailsStore)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(
      detailsActions.fetchModelEndpointMetrics(
        selectedItem.metadata.project,
        selectedItem.metadata.uid
      )
    )
  }, [dispatch, selectedItem])

  useEffect(() => {
    if (
      selectedItem.metadata?.uid &&
      !isEmpty(detailsStore.metricsOptions.selectedByEndpoint[selectedItem.metadata?.uid])
    ) {
      const selectedMetrics =
        detailsStore.metricsOptions.selectedByEndpoint[selectedItem.metadata?.uid]
      const params = { name: [] }

      if (detailsStore.dates.value[0]) {
        params.start = detailsStore.dates.value[0].getTime()
      }

      if (detailsStore.dates.value[1]) {
        params.end = detailsStore.dates.value[1].getTime()
      }

      // todo: metrics - remove mockNamesToFilter after test and when real API ready with all types (for now metrics type is not supported and it leads to error)
      const mockNamesToFilter = []

      selectedMetrics.forEach(metric => {
        // todo: metrics - remove 'if statement and mockNamesToFilter after test and when real API ready with all types (for now metrics type is not supported and it leads to error)
        mockNamesToFilter.push(metric.full_name)
        if (metric.type === 'metric') return

        params.name.push(metric.full_name)
      })

      // todo: metrics - remove if block after test and when real API ready with all types (for now metrics type is not supported and it leads to error)
      if (isEmpty(params.name))
        params.name.push('for-mock-only.histogram-data-drift.result.hellinger_mean')

      // todo: metrics - remove mockNamesToFilter after test and when real API ready with all types (for now metrics type is not supported and it leads to error)
      dispatch(
        detailsActions.fetchModelEndpointMetricsValues(
          selectedItem.metadata.project,
          selectedItem.metadata.uid,
          params,
          mockNamesToFilter
        )
      ).then(metricsList => {
        // todo: metrics - remove filter after test and when real API ready with all types (for now metrics type is not supported and it leads to error)
        setMetrics(
          metricsList.filter(
            metric =>
              metric.full_name !== 'for-mock-only.histogram-data-drift.result.hellinger_mean'
          )
        )
      })
    }
  }, [dispatch, selectedItem, detailsStore.dates, detailsStore.metricsOptions.selectedByEndpoint])

  // todo: metrics - - remove when merge charts
  /* eslint-disable-next-line no-console */
  console.log(metrics)

  return <div className="metrics">Home for Metrics</div>
}

export default DetailsMetrics
