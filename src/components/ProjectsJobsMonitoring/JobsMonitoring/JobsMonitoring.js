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
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'react-router-dom'

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
import { useFiltersFromSearchParams } from '../../../hooks/useFiltersFromSearchParams.hook'
import { getSavedSearchParams } from '../../../utils/filter.util'

const JobsMonitoring = () => {
  const [selectedJob, setSelectedJob] = useState({})
  const params = useParams()
  const { isStagingMode } = useMode()
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
    terminateAbortTasksPolling,
    tabData,
    paginatedJobs,
    searchParams
  } = React.useContext(ProjectJobsMonitoringContext)
  const jobsAreInitializedRef = useRef(false)

  const filters = useFiltersFromSearchParams(
    tabData[JOBS_MONITORING_JOBS_TAB]?.filtersConfig,
    tabData[JOBS_MONITORING_JOBS_TAB]?.parseQueryParamsCallback
  )

  const tableContent = useMemo(
    () => createJobsMonitoringContent(paginatedJobs, params.jobName, isStagingMode),
    [isStagingMode, paginatedJobs, params.jobName]
  )

  const getBackLink = useCallback(
    (useSavedParams = false) => {
      let queryParams = useSavedParams
        ? getSavedSearchParams(window.location.search)
        : `?${searchParams.toString()}`

      return `/projects/*/${JOBS_MONITORING_PAGE}/${JOBS_MONITORING_JOBS_TAB}${queryParams}`
    },
    [searchParams]
  )

  useEffect(() => {
    const abortController = abortControllerRef.current

    return () => {
      setJobs([])
      setJobRuns([])
      abortController.abort(REQUEST_CANCELED)
      jobsAreInitializedRef.current = false
      terminateAbortTasksPolling()
    }
  }, [terminateAbortTasksPolling, abortControllerRef, setJobs, setJobRuns])

  return (
    <>
      {params.jobName && <TableTop link={getBackLink(true)} text={params.jobName} />}
      <JobsTable
        abortingJobs={abortingJobs}
        ref={{ abortJobRef }}
        context={ProjectJobsMonitoringContext}
        filters={filters}
        filtersConfig={jobsFiltersConfig}
        jobRuns={jobRuns}
        jobs={jobs}
        paginatedJobs={paginatedJobs}
        requestErrorMessage={requestErrorMessage}
        navigateLink={getBackLink()}
        refreshJobs={() => refreshJobs(filters)}
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

export default JobsMonitoring
