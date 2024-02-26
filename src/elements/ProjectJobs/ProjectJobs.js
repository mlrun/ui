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
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import moment from 'moment'

import ProjectDataCard from '../ProjectDataCard/ProjectDataCard'

import { MONITOR_JOBS_TAB } from '../../constants'
import { getJobsStatistics, getJobsTableData, groupByName, sortByDate } from './projectJobs.utils'
import projectsAction from '../../actions/projects'

const ProjectJobs = ({ fetchProjectJobs, projectStore }) => {
  const [groupedLatestItem, setGroupedLatestItem] = useState([])
  const params = useParams()

  useEffect(() => {
    if (projectStore.project.jobs.data) {
      setGroupedLatestItem(sortByDate(groupByName(projectStore.project.jobs.data)))
    }
  }, [projectStore.project.jobs.data])

  useEffect(() => {
    const startTimeFrom = moment().add(-2, 'days').toISOString()

    fetchProjectJobs(params.projectName, startTimeFrom)
  }, [fetchProjectJobs, params.projectName])

  const jobsData = useMemo(() => {
    const statistics = getJobsStatistics(projectStore.projectSummary, params.projectName)
    const table = getJobsTableData(groupedLatestItem, params.projectName)

    return {
      statistics,
      table
    }
  }, [groupedLatestItem, params.projectName, projectStore.projectSummary])

  return (
    <ProjectDataCard
      content={projectStore.project.jobs}
      headerLink={`/projects/${params.projectName}/jobs/${MONITOR_JOBS_TAB}`}
      link={`/projects/${params.projectName}/jobs/${MONITOR_JOBS_TAB}`}
      params={params}
      statistics={jobsData.statistics}
      table={jobsData.table}
      tip="Each job and workflow can have multiple versions, produced by multiple runs and given multiple tags.
           You can browse them in the Jobs and workflows page."
      title="Jobs and workflows"
    />
  )
}

export default connect(
  projectStore => ({
    ...projectStore
  }),
  {
    ...projectsAction
  }
)(React.memo(ProjectJobs))
