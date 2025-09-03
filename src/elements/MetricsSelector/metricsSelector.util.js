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
import { chain, isEmpty } from 'lodash'
import { ML_RUN_INFRA } from '../../components/DetailsMetrics/detailsMetrics.util'
import { METRIC_TYPE, RESULT_TYPE } from '../../constants'

export const metricsTypes = {
  metric: METRIC_TYPE,
  result: RESULT_TYPE
}

export const filterMetrics = (metricsByApplication, nameFilter) => {
  return metricsByApplication.reduce((metricsList, [app, metrics]) => {
    const filteredMetrics = metrics.filter(metric => {
      return metric.name.toLowerCase().includes(nameFilter.toLowerCase())
    })

    if (!isEmpty(filteredMetrics)) metricsList.push({ app, metrics: filteredMetrics })

    return metricsList
  }, [])
}

export const groupMetricByApplication = (metrics, includeInfra = false) => {
  return chain(metrics)
    .filter(metric => (includeInfra ? metric.app : metric.app !== ML_RUN_INFRA))
    .groupBy(metric => metric.app)
    .toPairs()
    .sort(([appA], [appB]) => {
      if (includeInfra) {
        if (appA === ML_RUN_INFRA) return -1
        if (appB === ML_RUN_INFRA) return 1
      }
      return appA.localeCompare(appB)
    })
    .value()
}
