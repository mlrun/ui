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
import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
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
import { useFiltersFromSearchParams } from '../../../hooks/useFiltersFromSearchParams.hook'
import { getSavedSearchParams } from '../../../utils/filter.util'

const JobsMonitoring = () => {
  const [selectedJob, setSelectedJob] = useState({})
  const [dataIsLoaded, setDataIsLoaded] = useState(false)
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
    tabData
  } = React.useContext(ProjectJobsMonitoringContext)
  const jobsAreInitializedRef = useRef(false)

  const filters = useFiltersFromSearchParams(
    tabData[JOBS_MONITORING_JOBS_TAB]?.filtersConfig,
    tabData[JOBS_MONITORING_JOBS_TAB]?.parseQueryParamsCallback
  )

  const tableContent = useMemo(
    () =>
      createJobsMonitoringContent(params.jobName ? jobRuns : jobs, params.jobName, isStagingMode),
    [isStagingMode, jobRuns, jobs, params.jobName]
  )

  useEffect(() => {
    if (isEmpty(selectedJob) && !params.jobId && !dataIsLoaded) {
      // TODO QP: check for double request after deleting job from details, after pagination will be merged

      refreshJobs(filters)
      setDataIsLoaded(true)
    }
  }, [params.jobId, params.jobName, refreshJobs, selectedJob, filters, dataIsLoaded])

  useEffect(() => {
    const abortController = abortControllerRef.current

    return () => {
      setDataIsLoaded(false)
      setJobs([])
      setJobRuns([])
      abortController.abort(REQUEST_CANCELED)
      jobsAreInitializedRef.current = false
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
          link={`/projects/*/${JOBS_MONITORING_PAGE}/${JOBS_MONITORING_JOBS_TAB}${getSavedSearchParams(window.location.search)}`}
          text={params.jobName}
        />
      )}
      <JobsTable
        abortingJobs={abortingJobs}
        ref={{ abortJobRef }}
        context={ProjectJobsMonitoringContext}
        filters={filters}
        filtersConfig={jobsFiltersConfig}
        jobRuns={jobRuns}
        jobs={jobs}
        requestErrorMessage={requestErrorMessage}
        navigateLink={`/projects/*/${JOBS_MONITORING_PAGE}/${JOBS_MONITORING_JOBS_TAB}${window.location.search}`}
        refreshJobs={() =>
          refreshJobs(filters)
        }
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
