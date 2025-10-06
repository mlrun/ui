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
import { capitalize } from 'lodash'

import { aggregateApplicationStatuses } from '../../../../utils/applications.utils'
import { formatMinutesToString } from '../../../../utils/measureTime'
import {
  BATCH_FILTER,
  ME_MODE_FILTER,
  MODEL_ENDPOINTS_TAB,
  MODELS_PAGE,
  REAL_TIME_FILTER
} from '../../../../constants'

export const generateCountersContent = (params, monitoringApplicationsStore) => {
  const {
    applicationsSummary,
    monitoringApplication,
    monitoringApplications,
    loading: monitoringApplicationIsLoading,
    error: monitoringApplicationError
  } = monitoringApplicationsStore
  const { ready: appReady, error: appError } = aggregateApplicationStatuses(
    monitoringApplications.applications
  )

  const applicationsCountersContent = [
    {
      id: 'applicationsStatus',
      title: 'Applications',
      counterData: [
        {
          id: 'applications',
          title: monitoringApplicationError ? null : monitoringApplications.applications.length
        }
      ]
    },
    {
      id: 'appsStatus',
      title: 'Apps Status',
      counterData: [
        {
          id: 'running',
          title: appReady,
          tooltipText: 'Running',
          subtitle: 'Running',
          subtitleStatus: 'running'
        },
        {
          id: 'failed',
          title: appError,
          tooltipText: 'Failed, Error, Unhealthy',
          subtitle: 'Failed',
          subtitleStatus: 'failed'
        }
      ]
    },
    {
      id: 'endpointsStatus',
      title: 'Endpoints',
      counterData: [
        {
          id: BATCH_FILTER,
          title: applicationsSummary.batch_model_endpoint_count,
          link: `/projects/${params.projectName}/${MODELS_PAGE}/${MODEL_ENDPOINTS_TAB}?${ME_MODE_FILTER}=${BATCH_FILTER}`,
          subtitle: 'Batch'
        },
        {
          id: REAL_TIME_FILTER,
          title: applicationsSummary.real_time_model_endpoint_count,
          link: `/projects/${params.projectName}/${MODELS_PAGE}/${MODEL_ENDPOINTS_TAB}?${ME_MODE_FILTER}=${REAL_TIME_FILTER}`,
          subtitle: 'Real-time'
        }
      ]
    },
    {
      id: 'runningFrequencyStatus',
      title: 'Running interval',
      counterData: [
        {
          id: 'interval',
          title: monitoringApplicationError
            ? null
            : `Every ${formatMinutesToString(monitoringApplications.applications?.[0]?.base_period)}`
        }
      ]
    }
  ]

  const aggregatedStreamStats = Object.values(
    monitoringApplication?.stats?.stream_stats || {}
  ).reduce(
    (acc, { committed, lag }) => {
      acc.committed += committed
      acc.lag += lag

      return acc
    },
    { committed: 0, lag: 0 }
  )
  const applicationCountersContent = [
    {
      id: 'appStatus',
      title: 'App Status',
      counterData: [
        {
          id: 'appStatus',
          title: capitalize(monitoringApplication.status),
          status: monitoringApplication.status
        }
      ]
    },
    {
      id: 'endpoints',
      title: 'Endpoints',
      tip: 'Model endpoints processed by the monitoring app during the selected time frame',
      counterData: [
        { id: 'endpoints', title: monitoringApplication?.stats?.processed_model_endpoints }
      ]
    },
    {
      id: 'detections',
      title: 'Detections',
      counterData: [{ id: 'detections', title: monitoringApplication?.stats?.detected }]
    },
    {
      id: 'possibleDetections',
      title: 'Possible Detections',
      counterData: [
        { id: 'possibleDetections', title: monitoringApplication?.stats?.potential_detection }
      ]
    },
    {
      id: 'lag',
      title: 'Lag',
      tip: "Number of messages currently waiting in the app's queue",
      counterData: [{ id: 'lag', title: aggregatedStreamStats.lag }]
    },
    {
      id: 'commitedOffset',
      title: 'Commited Offset',
      tip: 'Total number of messages handled by the app',
      counterData: [{ id: 'commitedOffset', title: aggregatedStreamStats.committed }]
    }
  ]

  return params.name
    ? {
        content: applicationCountersContent,
        loading: monitoringApplicationIsLoading,
        error: monitoringApplicationError
      }
    : {
        content: applicationsCountersContent,
        loading: applicationsSummary.loading || monitoringApplicationIsLoading,
        error: applicationsSummary.error
      }
}
