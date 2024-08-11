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
import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'

import JobsTable from '../../../elements/JobsTable/JobsTable'
import TableTop from '../../../elements/TableTop/TableTop'

import { ProjectJobsMonitoringContext } from '../ProjectsJobsMonitoring'
import { createJobsMonitoringContent } from '../../../utils/createJobsContent'
import { useMode } from '../../../hooks/mode.hook'
import {
  JOBS_MONITORING_JOBS_TAB,
  JOBS_MONITORING_PAGE,
  REQUEST_CANCELED
} from '../../../constants'

const JobsMonitoring = () => {
  const [selectedJob, setSelectedJob] = useState({})
  const [dataIsLoaded, setDataIsLoaded] = useState(false)
  const params = useParams()
  const dispatch = useDispatch()
  const { isStagingMode } = useMode()
  const [jobsFilterMenu, jobsFilterMenuModal] = useSelector(state => [
    state.filtersStore.filterMenu[JOBS_MONITORING_JOBS_TAB],
    state.filtersStore.filterMenuModal[JOBS_MONITORING_JOBS_TAB]
  ])
  const {
    abortControllerRef,
    abortJobRef,
    abortingJobs,
    jobRuns,
    jobs,
    jobsFiltersConfig,
    requestErrorMessage,
    refreshJobs,
    setAbortingJobs,
    setJobRuns,
    setJobs,
    setSelectedRunProject,
    terminateAbortTasksPolling
  } = React.useContext(ProjectJobsMonitoringContext)

  const tableContent = useMemo(
    () =>
      createJobsMonitoringContent(params.jobName ? jobRuns : jobs, params.jobName, isStagingMode),
    [isStagingMode, jobRuns, jobs, params.jobName]
  )

  const isJobDataEmpty = useCallback(
    () => jobs.length === 0 && ((!params.jobName && jobRuns.length === 0) || params.jobName),
    [jobRuns.length, jobs.length, params.jobName]
  )

  useEffect(() => {
    if (isEmpty(selectedJob) && !params.jobId && !dataIsLoaded) {
      let filters = {
        ...jobsFilterMenu,
        ...jobsFilterMenuModal.values
      }

      refreshJobs(filters)
      setDataIsLoaded(true)
    }
  }, [
    isJobDataEmpty,
    dataIsLoaded,
    dispatch,
    params.jobId,
    params.jobName,
    refreshJobs,
    selectedJob,
    jobsFilterMenu,
    jobsFilterMenuModal.values
  ])

  useEffect(() => {
    const abortController = abortControllerRef.current

    return () => {
      setDataIsLoaded(false)
      setJobs([])
      setJobRuns([])
      abortController.abort(REQUEST_CANCELED)
      terminateAbortTasksPolling()
    }
  }, [
    params.jobName,
    params.jobId,
    terminateAbortTasksPolling,
    abortControllerRef,
    setJobs,
    setJobRuns
  ])

  return (
    <>
      {params.jobName && (
        <TableTop
          link={`/projects/${JOBS_MONITORING_PAGE}/${JOBS_MONITORING_JOBS_TAB}`}
          text={params.jobName}
        />
      )}
      <JobsTable
        abortingJobs={abortingJobs}
        ref={{ abortJobRef }}
        context={ProjectJobsMonitoringContext}
        filterMenuName={JOBS_MONITORING_JOBS_TAB}
        filtersConfig={jobsFiltersConfig}
        jobRuns={jobRuns}
        jobs={jobs}
        requestErrorMessage={requestErrorMessage}
        navigateLink={`/projects/${JOBS_MONITORING_PAGE}/${JOBS_MONITORING_JOBS_TAB}`}
        refreshJobs={() =>
          refreshJobs({
            ...jobsFilterMenu,
            ...jobsFilterMenuModal.values
          })
        }
        selectedJob={selectedJob}
        setAbortingJobs={setAbortingJobs}
        setJobRuns={setJobRuns}
        setJobs={setJobs}
        setSelectedJob={setSelectedJob}
        setSelectedRunProject={setSelectedRunProject}
        tableContent={tableContent}
        terminateAbortTasksPolling={terminateAbortTasksPolling}
      />
    </>
  )
}

export default JobsMonitoring
