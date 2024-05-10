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
import React, { useEffect, useMemo } from 'react'
// import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

import detailsActions from '../../actions/details'
import { generateMetricsItems } from './detailsMetrics.utils'

const getMetricsMock = selectedItem => {
  if (getMetricsMock[selectedItem.metadata.uid]) return getMetricsMock[selectedItem.metadata.uid]
  const mock = Array(100)
    .fill(1)
    .map((metric, index) => {
      const app = 'application' + Math.floor(Math.random() * 10)
      const name = 'metric' + index
      const type = index % 6 === 0 ? 'result' : 'metric'
      return {
        full_name: `${selectedItem.metadata.project}.${app}.${type}.${name}`,
        name,
        type,
        project: selectedItem.metadata.project,
        app
      }
    })
    getMetricsMock[selectedItem.metadata.uid] = mock
    return mock
}

const DetailsMetrics = ({ selectedItem }) => {
  // const detailsStore = useSelector(store => store.detailsStore)
  const dispatch = useDispatch()

  const generatedMetrics = useMemo(() => {
    return generateMetricsItems(getMetricsMock(selectedItem))
  }, [selectedItem])

  useEffect(() => {
    // dispatch(
    //   detailsActions.fetchModelEndPointMetricsList(
    //     selectedItem.metadata.project,
    //     selectedItem.metadata.uid,
    //     generateMetricsItems
    //   )

    dispatch(
      detailsActions.fetchEndpointMetricsListSuccess({
        endpointUid: selectedItem.metadata.uid,
        metrics: generatedMetrics
      })
    )
  }, [dispatch, selectedItem, generatedMetrics])

  return <div className="metrics">Home for Metrics</div>
}

export default DetailsMetrics
