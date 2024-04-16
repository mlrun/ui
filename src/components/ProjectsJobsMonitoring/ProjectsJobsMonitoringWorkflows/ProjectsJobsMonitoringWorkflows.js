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

import workflowActions from '../../../actions/workflow'
import projectsAction from '../../../actions/projects'

import { useFetchData } from '../../../hooks/useFetchData.hook'
// import { generateStatsData } from '../projectsJobsMotinoring.util'
import { isEveryObjectValueEmpty } from '../../../utils/isEveryObjectValueEmpty'
import { generateMonitoringGroupedData } from '../../../utils/generateMonitoringData'
// import { JOBS_MONITORING_WORKFLOWS_TAB } from '../../../constants'

import { ProjectJobsMonitoringContext } from '../ProjectsJobsMonitoring'

const ProjectsJobsMonitoringWorkflows = () => {
  const { filters, jobsMonitoringData } = useContext(ProjectJobsMonitoringContext)
  const dispatch = useDispatch()
  const { data: workflows } = useSelector(store => store.workflowsStore.workflows)
  const [groupedWorkflows, setGroupedWorkflows] = useState({
    all: [],
    running: [],
    failed: [],
    completed: []
  })
  const { loading } = useFetchData({
    filter: filters,
    action: workflowActions.fetchWorkflows,
    skipFetching: !isEveryObjectValueEmpty(jobsMonitoringData.workflows)
  })

  useEffect(() => {
    if (workflows.length > 0) {
      if (isEveryObjectValueEmpty(jobsMonitoringData.workflows)) {
        generateMonitoringGroupedData(workflows, setGroupedWorkflows, data =>
          dispatch(projectsAction.setJobsMonitoringData({ workflows: data }))
        )
      } else {
        setGroupedWorkflows(jobsMonitoringData.workflows)
      }
    }
  }, [dispatch, groupedWorkflows, workflows, jobsMonitoringData.workflows])

  return (
    <div>
      {loading ? 'loading' : ''}
      {/* Todo: Use in future phase
      <JobsMonitoringStatsCard
        loading={loading}
        selectedCard={selectedCard}
        setSelectedCard={setSelectedCard}
        statsData={generateStatsData(groupedWorkflows, JOBS_MONITORING_WORKFLOWS_TAB)}
      /> */}
    </div>
  )
}

export default ProjectsJobsMonitoringWorkflows
