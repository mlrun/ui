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
import React, { useEffect } from 'react'
// import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

import detailsActions from '../../actions/details'

const metricsMock = Array(100)
  .fill(1)
  .map((metric, index) => ({
    id: 'someId' + index,
    label: 'labelName' + index,
    application: 'application' + Math.floor(Math.random() * 30)
  }))


const DetailsMetrics = () => {
  // const detailsStore = useSelector(store => store.detailsStore)
  const dispatch = useDispatch()

  useEffect(() => {
    // just mocked data
    const endNum = (Math.random() * 10).toFixed()
    dispatch(detailsActions.setMetricsOptions(metricsMock))
    dispatch(detailsActions.setInitiallySelectedMetricsOptions(metricsMock.filter(metric => metric.label.endsWith(endNum))))
  }, [dispatch])
  

  return (
    <div className="metrics">
      Home for Metrics
    </div>
  )
}

export default DetailsMetrics
