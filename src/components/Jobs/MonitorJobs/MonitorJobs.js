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
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import JobsTable from '../../../elements/JobsTable/JobsTable'
import TableTop from '../../../elements/TableTop/TableTop'

import { GROUP_BY_NONE, MONITOR_JOBS_TAB, REQUEST_CANCELED } from '../../../constants'
import { JobsContext } from '../Jobs'
import { createJobsMonitorTabContent } from '../../../utils/createJobsContent'
import { setFilters } from '../../../reducers/filtersReducer'
import { useMode } from '../../../hooks/mode.hook'
import { useFiltersFromSearchParams } from '../../../hooks/useFiltersFromSearchParams.hook'
import { getSavedSearchParams } from '../../../utils/filter.util'

const MonitorJobs = () => {
  const params = useParams()
  const dispatch = useDispatch()
  const { isStagingMode } = useMode()
  const {
    abortControllerRef,
    abortJobRef,
    abortingJobs,
    fetchJobFunctionsPromiseRef,
    autoRefreshPrevValue,
    jobRuns,
    jobs,
    jobsFiltersConfig,
    paginatedJobs,
    refreshJobs,
    requestErrorMessage,
    searchParams,
    selectedJob,
    setAbortingJobs,
    setJobRuns,
    setJobs,
    setSelectedJob,
    tabData,
    terminateAbortTasksPolling
  } = React.useContext(JobsContext)
  const jobsAreInitializedRef = useRef(false)

  const filters = useFiltersFromSearchParams(
    tabData[MONITOR_JOBS_TAB]?.filtersConfig,
    tabData[MONITOR_JOBS_TAB]?.parseQueryParamsCallback
  )

  const tableContent = useMemo(
    () => createJobsMonitorTabContent(paginatedJobs, params.jobName, isStagingMode),
    [isStagingMode, paginatedJobs, params.jobName]
  )

  const getBackLink = useCallback(
    useSavedParams => {
      let queryParams = useSavedParams
        ? getSavedSearchParams(window.location.search)
        : `?${searchParams.toString()}`

      return `/projects/${params.projectName}/jobs/${MONITOR_JOBS_TAB}${queryParams}`
    },
    [params.projectName, searchParams]
  )

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
  }, [params.projectName, params.jobName, terminateAbortTasksPolling])

  return (
    <>
      {params.jobName && <TableTop link={getBackLink(true)} text={params.jobName} />}
      <JobsTable
        abortingJobs={abortingJobs}
        context={JobsContext}
        filters={filters}
        filtersConfig={jobsFiltersConfig}
        autoRefreshPrevValue={autoRefreshPrevValue}
        jobRuns={jobRuns}
        jobs={jobs}
        navigateLink={getBackLink()}
        paginatedJobs={paginatedJobs}
        ref={{ abortJobRef, fetchJobFunctionsPromiseRef }}
        refreshJobs={refreshJobs}
        requestErrorMessage={requestErrorMessage}
        searchParams={searchParams}
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
