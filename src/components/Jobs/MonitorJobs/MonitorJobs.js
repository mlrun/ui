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
import classnames from 'classnames'
import { useParams } from 'react-router-dom'
import { connect, useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'

import FilterMenu from '../../FilterMenu/FilterMenu'
import JobsTable from '../../../elements/JobsTable/JobsTable'
import TableTop from '../../../elements/TableTop/TableTop'

import { GROUP_BY_NONE, JOBS_PAGE, MONITOR_JOBS_TAB, REQUEST_CANCELED } from '../../../constants'
import { JobsContext } from '../Jobs'
import { TERTIARY_BUTTON } from 'igz-controls/constants'
import { createJobsMonitorTabContent } from '../../../utils/createJobsContent'
import { datePickerPastOptions, PAST_WEEK_DATE_OPTION } from '../../../utils/datePicker.util'
import { generateFilters, monitorJobsActionCreator } from './monitorJobs.util'
import { parseJob } from '../../../utils/parseJob'
import { pollAbortingJobs } from '../jobs.util'
import { setFilters } from '../../../reducers/filtersReducer'
import { useMode } from '../../../hooks/mode.hook'

const MonitorJobs = ({ fetchAllJobRuns, fetchJobs }) => {
  const [abortingJobs, setAbortingJobs] = useState({})
  const [jobRuns, setJobRuns] = useState([])
  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState({})
  const [dateFilter, setDateFilter] = useState(['', ''])
  const [dataIsLoaded, setDataIsLoaded] = useState(false)
  const appStore = useSelector(store => store.appStore)
  const filtersStore = useSelector(store => store.filtersStore)
  const [largeRequestErrorMessage, setLargeRequestErrorMessage] = useState('')
  const params = useParams()
  const dispatch = useDispatch()
  const { isStagingMode } = useMode()
  const abortJobRef = useRef(null)
  const { handleMonitoring } = React.useContext(JobsContext)
  const abortControllerRef = useRef(new AbortController())

  const filters = useMemo(() => {
    return generateFilters(params.jobName)
  }, [params.jobName])

  const filterMenuClassNames = classnames(
    'content__action-bar-wrapper',
    params.jobId && 'content__action-bar-wrapper_hidden'
  )

  const tableContent = useMemo(
    () =>
      createJobsMonitorTabContent(params.jobName ? jobRuns : jobs, params.jobName, isStagingMode),
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

      if (filters.dates) {
        setDateFilter(filters.dates.value)
      }

      const fetchData = params.jobName ? fetchAllJobRuns : fetchJobs
      const newParams = !params.jobName && {
        'partition-by': 'name',
        'partition-sort-by': 'updated'
      }

      fetchData(
        params.projectName,
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
          const parsedJobs = jobs.map(job => parseJob(job, MONITOR_JOBS_TAB))
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
              params.projectName,
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
      params.projectName,
      terminateAbortTasksPolling
    ]
  )

  const isJobDataEmpty = useCallback(
    () => jobs.length === 0 && ((!params.jobName && jobRuns.length === 0) || params.jobName),
    [jobRuns.length, jobs.length, params.jobName]
  )

  useEffect(() => {
    if (isEmpty(selectedJob) && !params.jobId && !dataIsLoaded) {
      let filters = {}

      if (filtersStore.saveFilters) {
        filters = {
          saveFilters: false,
          state: filtersStore.state,
          dates: filtersStore.dates
        }
      } else if (isJobDataEmpty()) {
        const pastWeekOption = datePickerPastOptions.find(
          option => option.id === PAST_WEEK_DATE_OPTION
        )

        filters = {
          dates: {
            value: pastWeekOption.handler(),
            isPredefined: pastWeekOption.isPredefined,
            initialSelectedOptionId: pastWeekOption.id
          }
        }
      } else {
        filters = {
          name: filtersStore.name,
          state: filtersStore.state,
          labels: filtersStore.labels,
          dates: {
            value: dateFilter,
            isPredefined: false
          }
        }
      }

      refreshJobs(filters)
      dispatch(setFilters(filters))
      setDataIsLoaded(true)
    }
  }, [
    filtersStore,
    dataIsLoaded,
    dateFilter,
    dispatch,
    isJobDataEmpty,
    params.jobId,
    params.jobName,
    params.projectName,
    refreshJobs,
    selectedJob
  ])

  useEffect(() => {
    dispatch(setFilters({ groupBy: GROUP_BY_NONE }))
  }, [dispatch])

  useEffect(() => {
    return () => {
      setJobs([])
      setJobRuns([])
      abortControllerRef.current.abort(REQUEST_CANCELED)
      terminateAbortTasksPolling()
    }
  }, [params.projectName, terminateAbortTasksPolling])

  useEffect(() => {
    return () => {
      setDataIsLoaded(false)
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
      <div className={filterMenuClassNames}>
        <div className="action-bar">
          <FilterMenu
            actionButton={{
              label: 'Resource monitoring',
              tooltip: !appStore.frontendSpec.jobs_dashboard_url
                ? 'Grafana service unavailable'
                : '',
              variant: TERTIARY_BUTTON,
              disabled: !appStore.frontendSpec.jobs_dashboard_url,
              onClick: () => handleMonitoring()
            }}
            filters={filters}
            hidden={Boolean(params.jobId)}
            onChange={refreshJobs}
            page={JOBS_PAGE}
            tab={MONITOR_JOBS_TAB}
            withoutExpandButton
            enableAutoRefresh
          />
        </div>
      </div>
      <JobsTable
        abortingJobs={abortingJobs}
        ref={{ abortJobRef }}
        context={JobsContext}
        filters={filters}
        jobRuns={jobRuns}
        jobs={jobs}
        largeRequestErrorMessage={largeRequestErrorMessage}
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

export default connect(null, {
  ...monitorJobsActionCreator
})(React.memo(MonitorJobs))
