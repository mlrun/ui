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
import { useDispatch } from 'react-redux'

import ScheduledJobsTable from '../../../elements/ScheduledJobsTable/ScheduledJobsTable'
import { ProjectJobsMonitoringContext } from '../ProjectsJobsMonitoring'

import { createScheduleJobsMonitoringContent } from '../../../utils/createJobsContent'
import { JOBS_MONITORING_SCHEDULED_TAB } from '../../../constants'
import { useFiltersFromSearchParams } from '../../../hooks/useFiltersFromSearchParams.hook'

const ScheduledMonitoring = () => {
  const [dataIsLoaded, setDataIsLoaded] = useState(false)
  const dispatch = useDispatch()
  const {
    requestErrorMessage,
    refreshScheduled,
    scheduledFiltersConfig,
    scheduledJobs,
    setScheduledJobs,
    tabData
  } = React.useContext(ProjectJobsMonitoringContext)

  const filters = useFiltersFromSearchParams(
    tabData[JOBS_MONITORING_SCHEDULED_TAB]?.filtersConfig,
    tabData[JOBS_MONITORING_SCHEDULED_TAB]?.parseQueryParamsCallback
  )

  useEffect(() => {
    if (!dataIsLoaded) {
      refreshScheduled(filters)
      setDataIsLoaded(true)
    }
  }, [
    dataIsLoaded,
    dispatch,
    refreshScheduled,
    filters
  ])

  useEffect(() => {
    return () => {
      setDataIsLoaded(false)
      setScheduledJobs([])
    }
  }, [setScheduledJobs])

  return (
    <ScheduledJobsTable
      context={ProjectJobsMonitoringContext}
      createTableContent={() => createScheduleJobsMonitoringContent(scheduledJobs)}
      filtersConfig={scheduledFiltersConfig}
      filters={filters}
      jobs={scheduledJobs}
      requestErrorMessage={requestErrorMessage}
      refreshJobs={() =>
        refreshScheduled(filters)
      }
    />
  )
}

export default ScheduledMonitoring
