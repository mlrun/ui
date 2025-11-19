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
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import PropTypes from 'prop-types'

import ProjectDataCard from '../ProjectDataCard/ProjectDataCard'

import { DATES_FILTER, MONITOR_JOBS_TAB, REQUEST_CANCELED } from '../../constants'
import { PAST_24_HOUR_DATE_OPTION } from '../../utils/datePicker.util'

import { getJobsStatistics, getJobsTableData, groupByName, sortByDate } from './projectJobs.utils'
import { fetchProjectJobs } from '../../reducers/projectReducer'

const ProjectJobs = ({ project }) => {
  const [groupedLatestItem, setGroupedLatestItem] = useState([])
  const params = useParams()
  const dispatch = useDispatch()
  const projectStore = useSelector(store => store.projectStore)

  useEffect(() => {
    if (projectStore.project?.jobs?.data) {
      setGroupedLatestItem(sortByDate(groupByName(projectStore.project.jobs.data)))
    }
  }, [projectStore.project?.jobs?.data])

  useEffect(() => {
    if (project?.data?.metadata?.name === params.projectName) {
      const abortController = new AbortController()
      const startTimeFrom = moment().add(-7, 'days').toISOString()

      dispatch(
        fetchProjectJobs({
          project: params.projectName,
          startTimeFrom,
          signal: abortController.signal
        })
      )

      return () => {
        abortController.abort(REQUEST_CANCELED)
      }
    }
  }, [dispatch, params.projectName, project?.data?.metadata?.name])

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
      footerLinkText={'All jobs'}
      headerLink={`/projects/${params.projectName}/jobs/${MONITOR_JOBS_TAB}?${new URLSearchParams({
        [DATES_FILTER]: PAST_24_HOUR_DATE_OPTION
      })}`}
      hasUpdateDate={true}
      link={`/projects/${params.projectName}/jobs/${MONITOR_JOBS_TAB}`}
      params={params}
      statistics={jobsData.statistics}
      subTitle="Recent jobs"
      table={jobsData.table}
      tip="Number of Job runs, clicking on the counters navigates to jobs screen."
      title="Runs"
    />
  )
}

ProjectJobs.propTypes = {
  project: PropTypes.object.isRequired
}

export default React.memo(ProjectJobs)
