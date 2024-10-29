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
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import JobsTable from '../../../elements/JobsTable/JobsTable'
import TableTop from '../../../elements/TableTop/TableTop'

import { GROUP_BY_NONE, MONITOR_JOBS_TAB, REQUEST_CANCELED } from '../../../constants'
import { JobsContext } from '../Jobs'
import { createJobsMonitorTabContent } from '../../../utils/createJobsContent'
import { fetchInitialJobs, generateFilters } from './monitorJobs.util'
import { setFilters } from '../../../reducers/filtersReducer'
import { useMode } from '../../../hooks/mode.hook'

const MonitorJobs = () => {
  const [selectedJob, setSelectedJob] = useState({})
  const [jobsFilterMenu, jobsFilterMenuModal, saveFilters] = useSelector(state => [
    state.filtersStore.filterMenu[MONITOR_JOBS_TAB],
    state.filtersStore.filterMenuModal[MONITOR_JOBS_TAB],
    state.filtersStore.saveFilters
  ])
  const params = useParams()
  const dispatch = useDispatch()
  const { isStagingMode } = useMode()
  const {
    abortControllerRef,
    abortJobRef,
    abortingJobs,
    dateFilter,
    jobRuns,
    jobs,
    refreshJobs,
    requestErrorMessage,
    setAbortingJobs,
    setJobRuns,
    setJobs,
    terminateAbortTasksPolling
  } = React.useContext(JobsContext)
  const jobsAreInitializedRef = useRef(false)

  const filters = useMemo(() => {
    return generateFilters(params.jobName)
  }, [params.jobName])

  const tableContent = useMemo(
    () =>
      createJobsMonitorTabContent(params.jobName ? jobRuns : jobs, params.jobName, isStagingMode),
    [isStagingMode, jobRuns, jobs, params.jobName]
  )

  const isJobDataEmpty = useCallback(
    () => jobs.length === 0 && ((!params.jobName && jobRuns.length === 0) || params.jobName),
    [jobRuns.length, jobs.length, params.jobName]
  )

  useEffect(() => {
    fetchInitialJobs(
      {
        saveFilters,
        ...jobsFilterMenu,
        ...jobsFilterMenuModal.values
      },
      selectedJob,
      dateFilter,
      params,
      refreshJobs,
      setFilters,
      dispatch,
      isJobDataEmpty,
      jobsAreInitializedRef
    )
  }, [
    dateFilter,
    dispatch,
    isJobDataEmpty,
    jobsFilterMenu,
    jobsFilterMenuModal.values,
    params,
    refreshJobs,
    saveFilters,
    selectedJob
  ])

  useEffect(() => {
    dispatch(setFilters({ groupBy: GROUP_BY_NONE }))
  }, [dispatch])

  useEffect(() => {
    const abortControllerRefCurrent = abortControllerRef.current

    return () => {
      setJobs([])
      setJobRuns([])
      abortControllerRefCurrent?.abort(REQUEST_CANCELED)
      terminateAbortTasksPolling()
    }
  }, [abortControllerRef, params.projectName, setJobRuns, setJobs, terminateAbortTasksPolling])

  useEffect(() => {
    return () => {
      jobsAreInitializedRef.current = false
      terminateAbortTasksPolling()
    }
  }, [params.projectName, params.jobName, params.jobId, terminateAbortTasksPolling])

  return (
    <>
      {params.jobName && (
        <TableTop
          link={`/projects/${params.projectName}/jobs/${MONITOR_JOBS_TAB}`}
          text={params.jobName}
        />
      )}
      <JobsTable
        abortingJobs={abortingJobs}
        ref={{ abortJobRef }}
        context={JobsContext}
        filterMenuName={MONITOR_JOBS_TAB}
        filters={filters}
        jobRuns={jobRuns}
        jobs={jobs}
        requestErrorMessage={requestErrorMessage}
        navigateLink={`/projects/${params.projectName}/jobs/${MONITOR_JOBS_TAB}`}
        refreshJobs={refreshJobs}
        selectedJob={selectedJob}
        setAbortingJobs={setAbortingJobs}
        setJobRuns={setJobRuns}
        setJobs={setJobs}
        setSelectedJob={setSelectedJob}
        tableContent={tableContent}
        terminateAbortTasksPolling={terminateAbortTasksPolling}
      />
    </>
  )
}

export default React.memo(MonitorJobs)
