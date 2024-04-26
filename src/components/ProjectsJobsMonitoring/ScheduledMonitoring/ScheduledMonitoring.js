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
import React, { useEffect, useMemo, useState } from 'react'

import ScheduledJobsTable from '../../../elements/ScheduledJobsTable/ScheduledJobsTable'
import { ProjectJobsMonitoringContext } from '../ProjectsJobsMonitoring'

import { createJobsMonitoringScheduleTabContent } from '../../../utils/createJobsContent'

const ScheduledMonitoring = () => {
  const [dataIsLoaded, setDataIsLoaded] = useState(false)
  const { jobs, largeRequestErrorMessage, refreshScheduledTabJobs: refreshJobs } = React.useContext(
    ProjectJobsMonitoringContext)

  const tableContent = useMemo(() => {
    return createJobsMonitoringScheduleTabContent(jobs)
  }, [jobs])


  useEffect(() => {
    if (!dataIsLoaded) {
      refreshJobs({})
      setDataIsLoaded(true)
    }
  }, [
    dataIsLoaded,
    refreshJobs
  ])

  useEffect(() => {
    return () => {
      setDataIsLoaded(false)
    }
  }, [])

  return (
    <ScheduledJobsTable
      context={ProjectJobsMonitoringContext}
      jobs={jobs}
      largeRequestErrorMessage={largeRequestErrorMessage}
      refreshJobs={refreshJobs}
      tableContent={tableContent}
    />
  )
}

export default ScheduledMonitoring
