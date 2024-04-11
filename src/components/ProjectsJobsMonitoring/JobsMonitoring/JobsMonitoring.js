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
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { connect, useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'

import JobsTable from '../../../elements/JobsTable/JobsTable'
import TableTop from '../../../elements/TableTop/TableTop'

import { ProjectJobsMonitoringContext } from '../ProjectsJobsMonitoring'
import { parseJob } from '../../../utils/parseJob'
import { pollAbortingJobs } from '../../Jobs/jobs.util'
import { createJobsMonitoringContent } from '../../../utils/createJobsContent'
import { useMode } from '../../../hooks/mode.hook'
import { datePickerPastOptions, PAST_24_HOUR_DATE_OPTION } from '../../../utils/datePicker.util'
import { JOBS_MONITORING_JOBS_TAB, JOBS_MONITORING_PAGE } from '../../../constants'
import { jobsMonitoringActionCreator } from './jobsMonitoring.util'

const JobsMonitoring = ({ fetchAllJobRuns, fetchJobs }) => {
  const [abortingJobs, setAbortingJobs] = useState({})
  const [jobRuns, setJobRuns] = useState([])
  const [selectedJob, setSelectedJob] = useState({})
  const [selectedRunProject, setSelectedRunProject] = useState('')
  const [dataIsLoaded, setDataIsLoaded] = useState(false)
  const [jobs, setJobs] = useState([])
  const [largeRequestErrorMessage, setLargeRequestErrorMessage] = useState('')
  const abortJobRef = useRef(null)
  const abortControllerRef = useRef(new AbortController())
  const params = useParams()
  const dispatch = useDispatch()
  const { isStagingMode } = useMode()
  const filtersStore = useSelector(store => store.filtersStore)

  const filters = useMemo(() => [], [])

  const tableContent = useMemo(
    () =>
      createJobsMonitoringContent(params.jobName ? jobRuns : jobs, params.jobName, isStagingMode),
    [isStagingMode, jobRuns, jobs, params.jobName]
  )

  const terminateAbortTasksPolling = useCallback(() => {
    abortJobRef?.current?.()
    setAbortingJobs({})
  }, [])

  const refreshJobs = useCallback(
    filters => {
      if (params.jobName) {
        setJobRuns([])
      } else {
        setJobs([])
      }
      abortControllerRef.current = new AbortController()

      terminateAbortTasksPolling()

      const fetchData = params.jobName ? fetchAllJobRuns : fetchJobs
      const newParams = !params.jobName && {
        'partition-by': 'name',
        'partition-sort-by': 'updated'
      }

      fetchData(
        params.jobName ? selectedRunProject || '*' : '*',
        filters,
        {
          ui: {
            controller: abortControllerRef.current,
            setLargeRequestErrorMessage
          },
          params: { ...newParams }
        },
        params.jobName ?? false
      ).then(jobs => {
        if (jobs) {
          const parsedJobs = jobs.map(job => parseJob(job))
          const responseAbortingJobs = parsedJobs.reduce((acc, job) => {
            if (job.state.value === 'aborting' && job.abortTaskId) {
              acc[job.abortTaskId] = {
                uid: job.uid,
                name: job.name
              }
            }

            return acc
          }, {})

          if (Object.keys(responseAbortingJobs).length > 0) {
            setAbortingJobs(responseAbortingJobs)
            pollAbortingJobs(
              '*',
              abortJobRef,
              responseAbortingJobs,
              () => refreshJobs(filters),
              dispatch
            )
          }

          if (params.jobName) {
            setJobRuns(parsedJobs)
          } else {
            setJobs(parsedJobs)
          }
        }
      })
    },
    [
      dispatch,
      fetchAllJobRuns,
      fetchJobs,
      params.jobName,
      selectedRunProject,
      terminateAbortTasksPolling
    ]
  )

  const isJobDataEmpty = useCallback(
    () => jobs.length === 0 && ((!params.jobName && jobRuns.length === 0) || params.jobName),
    [jobRuns.length, jobs.length, params.jobName]
  )

  useEffect(() => {
    if (isEmpty(selectedJob) && !params.jobId && !dataIsLoaded) {
      const past24HourOption = datePickerPastOptions.find(
        option => option.id === PAST_24_HOUR_DATE_OPTION
      )
      refreshJobs({
        dates: {
          value: past24HourOption.handler(),
          isPredefined: past24HourOption.isPredefined
        },
        state: filtersStore.state
      })
      setDataIsLoaded(true)
    }
  }, [
    dataIsLoaded,
    dispatch,
    filtersStore.state,
    isJobDataEmpty,
    params.jobId,
    params.jobName,
    refreshJobs,
    selectedJob
  ])

  useEffect(() => {
    return () => {
      setDataIsLoaded(false)
      terminateAbortTasksPolling()
    }
  }, [params.jobName, params.jobId, terminateAbortTasksPolling])

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
        filters={filters}
        jobRuns={jobRuns}
        jobs={jobs}
        largeRequestErrorMessage={largeRequestErrorMessage}
        navigateLink={`/projects/${JOBS_MONITORING_PAGE}/${JOBS_MONITORING_JOBS_TAB}`}
        refreshJobs={refreshJobs}
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

export default connect(null, {
  ...jobsMonitoringActionCreator
})(JobsMonitoring)
