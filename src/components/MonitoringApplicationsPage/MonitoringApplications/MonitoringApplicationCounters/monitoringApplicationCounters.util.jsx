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
          title:
            monitoringApplications.operatingFunctions.length +
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
          status: 'running'
        },
        {
          id: 'failed',
          title: applicationsSummary.failed_model_monitoring_functions,
          subtitle: 'Failed',
          status: 'failed'
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
      title: 'Running frequency',
      counterData: [
        {
          title: `Every ${formatMinutesToString(monitoringApplications.applications?.[0]?.base_period)}`
        }
      ]
    }
  ]

  const applicationCountersContent = [
    {
      id: 'appStatus',
      title: 'App Status',
      tip: 'Some tip',
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
      counterData: [{ id: 'detections', title: monitoringApplication?.stats?.detections }]
    },
    {
      id: 'possibleDetections',
      title: 'Possible Detections',
      counterData: [
        { id: 'possibleDetections', title: monitoringApplication?.stats?.potential_detections }
      ]
    },
    {
      id: 'lag',
      title: 'Lag',
      tip: "Number of messages currently waiting in the app's queue",
      counterData: [{ id: 'lag', title: monitoringApplication?.stats?.lag }]
    },
    {
      id: 'commitedOffset',
      title: 'Commited Offset',
      tip: 'Total number of messages handled by the app',
      counterData: [{ id: 'commitedOffset', title: monitoringApplication?.stats?.committed_offset }]
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
