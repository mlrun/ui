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
import { useCallback, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'

import { monitorJob, pollAbortingJobs, rerunJob } from '../components/Jobs/jobs.util'

import {
  BE_PAGE,
  BE_PAGE_SIZE,
  FILTER_ALL_ITEMS,
  GROUP_BY_WORKFLOW,
  JOB_KIND_LOCAL,
  JOBS_MONITORING_JOBS_TAB,
  MONITOR_JOBS_TAB,
  SCHEDULE_TAB
} from '../constants'
import { getJobKindFromLabels } from '../utils/jobs.util'
import { usePagination } from './usePagination.hook'
import { parseJob } from '../utils/parseJob'
import { fetchAllJobRuns, fetchJobs, fetchScheduledJobs } from '../reducers/jobReducer'
import { fetchWorkflows } from '../reducers/workflowReducer'
import { useFiltersFromSearchParams } from './useFiltersFromSearchParams.hook'

export const useJobsPageData = (
  setSelectedJob,
  initialTabData,
  selectedTab
) => {
  const [jobRuns, setJobRuns] = useState([])
  const [editableItem, setEditableItem] = useState(null)
  const [jobWizardMode, setJobWizardMode] = useState(null)
  const [jobWizardIsOpened, setJobWizardIsOpened] = useState(false)
  const [jobs, setJobs] = useState([])
  const [abortingJobs, setAbortingJobs] = useState({})
  const paginationConfigJobsRef = useRef({})
  const paginationConfigRunsRef = useRef({})
  const abortControllerRef = useRef(new AbortController())
  const abortJobRef = useRef(null)
  const fetchJobFunctionsPromiseRef = useRef()
  const params = useParams()
  const [requestErrorMessage, setRequestErrorMessage] = useState('')
  const [scheduledJobs, setScheduledJobs] = useState([])
  const dispatch = useDispatch()
  const appStore = useSelector(store => store.appStore)

  const filters = useFiltersFromSearchParams(
    initialTabData[selectedTab]?.filtersConfig,
    initialTabData[selectedTab]?.parseQueryParamsCallback
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
      const projectName = filters.project?.toLowerCase?.() || params.projectName || '*'
      const config = {
        ui: {
          controller: abortControllerRef.current,
          setRequestErrorMessage
        },
        params: {}
      }

      if (!params.jobName) {
        config.params['partition-by'] = 'project_and_name'
        config.params['partition-sort-by'] = 'updated'
      }

      if (!params.jobName && !isEmpty(paginationConfigJobsRef.current)) {
        config.params.page = paginationConfigJobsRef.current[BE_PAGE]
        config.params['page-size'] = paginationConfigJobsRef.current[BE_PAGE_SIZE]
      }

      if (params.jobName && !isEmpty(paginationConfigRunsRef.current)) {
        config.params.page = paginationConfigRunsRef.current[BE_PAGE]
        config.params['page-size'] = paginationConfigRunsRef.current[BE_PAGE_SIZE]
      }

      dispatch(
        fetchData({ project: projectName, filters, config, jobName: params.jobName ?? false })
      )
        .unwrap()
        .then(response => {
          if (response?.runs) {
            const parsedJobs = response.runs
              .map(job => parseJob(job))
              .filter(job => {
                const type = getJobKindFromLabels(job.labels) ?? JOB_KIND_LOCAL

                return (
                  (!filters.type ||
                    filters.type === FILTER_ALL_ITEMS ||
                    filters.type.split(',').includes(type)) &&
                  (!filters.project || job.project.includes(filters.project.toLowerCase()))
                )
              })
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
                filters.project?.toLowerCase?.() || params.projectName || '*',
                abortJobRef,
                responseAbortingJobs,
                () => refreshJobs(filters),
                dispatch
              )
            }

            if (params.jobName) {
              setJobRuns(parsedJobs)
              paginationConfigRunsRef.current.paginationResponse = response.pagination
            } else {
              setJobs(parsedJobs)
              paginationConfigJobsRef.current.paginationResponse = response.pagination
            }
          }
        })
    },
    [dispatch, params.jobName, params.projectName, terminateAbortTasksPolling]
  )

  const refreshScheduled = useCallback(
    filters => {
      setScheduledJobs([])
      abortControllerRef.current = new AbortController()

      dispatch(
        fetchScheduledJobs({
          project: filters.project ? filters.project.toLowerCase() : params.projectName || '*',
          filters,
          config: {
            ui: {
              controller: abortControllerRef.current,
              setRequestErrorMessage
            }
          }
        })
      )
        .unwrap()
        .then(jobs => {
          if (jobs) {
            const parsedJobs = jobs
              .map(job => parseJob(job, SCHEDULE_TAB))
              .filter(job => {
                let inDateRange = true

                if (filters.dates) {
                  const timeTo = filters.dates.value[1]?.getTime?.() || ''
                  const timeFrom = filters.dates.value[0]?.getTime?.() || ''
                  const nextRun = job.nextRun.getTime()

                  if (timeFrom) {
                    inDateRange = nextRun >= timeFrom
                  }

                  if (timeTo && inDateRange) {
                    inDateRange = nextRun <= timeTo
                  }
                }

                return (
                  inDateRange &&
                  (!filters.type ||
                    filters.type === FILTER_ALL_ITEMS ||
                    job.type === filters.type) &&
                  (!filters.project || job.project.includes(filters.project.toLowerCase()))
                )
              })

            setScheduledJobs(parsedJobs)
          }
        })
    },
    [dispatch, params.projectName]
  )

  const getWorkflows = useCallback(
    filters => {
      abortControllerRef.current = new AbortController()

      dispatch(
        fetchWorkflows({
          project: filters.project ? filters.project.toLowerCase() : params.projectName || '*',
          filter: { ...filters, groupBy: GROUP_BY_WORKFLOW },
          config: {
            ui: {
              controller: abortControllerRef.current,
              setRequestErrorMessage
            }
          },
          withPagination: !params.projectName
        })
      )
    },
    [dispatch, params.projectName]
  )

  const handleMonitoring = useCallback(
    item => {
      monitorJob(appStore.frontendSpec.jobs_dashboard_url, item, params.projectName)
    },
    [appStore.frontendSpec.jobs_dashboard_url, params.projectName]
  )

  const handleRerunJob = useCallback(
    async job => await rerunJob(job, setEditableItem, setJobWizardMode, dispatch),
    [dispatch]
  )

  const [handleRefreshJobs, paginatedJobs, searchJobsParams, setSearchJobsParams] = usePagination({
    hidden:
      ![MONITOR_JOBS_TAB, JOBS_MONITORING_JOBS_TAB].includes(selectedTab) ||
      Boolean(params.jobName),
    content: jobs,
    refreshContent: refreshJobs,
    filters,
    paginationConfigRef: paginationConfigJobsRef,
    resetPaginationTrigger: `${params.projectName}_${selectedTab}`
  })
  const [handleRefreshRuns, paginatedRuns, searchRunsParams, setSearchRunsParams] = usePagination({
    hidden: ![MONITOR_JOBS_TAB, JOBS_MONITORING_JOBS_TAB].includes(selectedTab) || !params.jobName,
    content: jobRuns,
    refreshContent: refreshJobs,
    filters,
    paginationConfigRef: paginationConfigRunsRef,
    resetPaginationTrigger: `${params.projectName}_${selectedTab}_${params.jobName}`
  })

  return {
    abortControllerRef,
    abortJobRef,
    abortingJobs,
    editableItem,
    fetchJobFunctionsPromiseRef,
    getWorkflows,
    handleMonitoring,
    handleRefreshJobs: params.jobName ? handleRefreshRuns : handleRefreshJobs,
    handleRerunJob,
    jobRuns,
    jobWizardIsOpened,
    jobWizardMode,
    jobs,
    paginatedJobs: params.jobName ? paginatedRuns : paginatedJobs,
    paginationConfigJobsRef: params.jobName ? paginationConfigRunsRef : paginationConfigJobsRef,
    refreshJobs,
    refreshScheduled,
    requestErrorMessage,
    scheduledJobs,
    searchParams: params.jobName ? searchRunsParams : searchJobsParams,
    setAbortingJobs,
    setEditableItem,
    setJobRuns,
    setJobWizardIsOpened,
    setJobWizardMode,
    setJobs,
    setScheduledJobs,
    setSearchParams: params.jobName ? setSearchRunsParams : setSearchJobsParams,
    terminateAbortTasksPolling
  }
}
