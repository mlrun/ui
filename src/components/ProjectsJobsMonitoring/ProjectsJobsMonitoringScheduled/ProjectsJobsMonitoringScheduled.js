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
import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// import JobsMonitoringStatsCard from '../../../elements/JobsMonitoringStatsCard/JobsMonitoringStatsCard'

import jobsActions from '../../../actions/jobs'
import projectsAction from '../../../actions/projects'

import { useFetchData } from '../../../hooks/useFetchData.hook'
// import { generateStatsData } from '../projectsJobsMotinoring.util'
import { isEveryObjectValueEmpty } from '../../../utils/isEveryObjectValueEmpty'
import { generateScheduledMonitoringGroupedData } from '../../../utils/generateMonitoringData'
// import { JOBS_MONITORING_SCHEDULED_TAB } from '../../../constants'

import { ProjectJobsMonitoringContext } from '../ProjectsJobsMonitoring'

const ProjectsJobsMonitoringScheduled = () => {
  const { filters, jobsMonitoringData } = useContext(ProjectJobsMonitoringContext)
  const dispatch = useDispatch()
  const { scheduled: scheduledJobs } = useSelector(store => store.jobsStore)
  const [groupedScheduled, setGroupedScheduled] = useState({
    all: [],
    jobs: [],
    workflows: []
  })
  const { loading } = useFetchData({
    filter: filters,
    action: jobsActions.fetchScheduledJobs,
    skipFetching: !isEveryObjectValueEmpty(jobsMonitoringData.scheduled)
  })

  useEffect(() => {
    if (scheduledJobs.length > 0) {
      if (isEveryObjectValueEmpty(jobsMonitoringData.scheduled)) {
        generateScheduledMonitoringGroupedData(scheduledJobs, filters, setGroupedScheduled, data =>
          dispatch(projectsAction.setJobsMonitoringData({ scheduled: data }))
        )
      } else {
        setGroupedScheduled(jobsMonitoringData.scheduled)
      }
    }
  }, [dispatch, groupedScheduled, scheduledJobs, jobsMonitoringData.scheduled, filters])

  return (
    <div>
      {loading ? 'loading' : ''}
      {/* Todo: Use in future phase
      <JobsMonitoringStatsCard
        loading={loading}
        selectedCard={selectedCard}
        setSelectedCard={setSelectedCard}
        statsData={generateStatsData(groupedScheduled, JOBS_MONITORING_SCHEDULED_TAB)}
      /> */}
    </div>
  )
}

export default ProjectsJobsMonitoringScheduled
