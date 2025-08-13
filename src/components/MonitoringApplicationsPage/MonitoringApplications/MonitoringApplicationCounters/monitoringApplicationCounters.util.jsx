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

import { formatMinutesToString } from '../../../../utils/measureTime'

export const generateCountersContent = (params, monitoringApplicationsStore) => {
  const {
    applicationsSummary,
    monitoringApplication,
    monitoringApplications,
    loading: monitoringApplicationIsLoading,
    error: monitoringApplicationError
  } = monitoringApplicationsStore

  const applicationsCountersContent = [
    {
      id: 'applications',
      title: 'Applications',
      counterData: [
        {
          title: monitoringApplicationError
            ? null
            : monitoringApplications.operatingFunctions.length +
              monitoringApplications.applications.length
        }
      ]
    },
    {
      id: 'appsStatus',
      title: 'Apps Status',
      counterData: [
        {
          id: 'running',
          title: applicationsSummary.running_model_monitoring_functions,
          subtitle: 'Running',
          subtitleStatus: 'running'
        },
        {
          id: 'failed',
          title: applicationsSummary.failed_model_monitoring_functions,
          subtitle: 'Failed',
          subtitleStatus: 'failed'
        }
      ]
    },
    {
      id: 'endpoints',
      title: 'Endpoints',
      counterData: [
        {
          id: 'batch',
          title: applicationsSummary.batch_model_endpoint_count,
          subtitle: 'Batch'
        },
        {
          id: 'realTime',
          title: applicationsSummary.real_time_model_endpoint_count,
          subtitle: 'Real-time'
        }
      ]
    },
    {
      id: 'runningFrequency',
      title: 'Running interval',
      counterData: [
        {
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
        loading: applicationsSummary.loading,
        error: applicationsSummary.error
      }
}
