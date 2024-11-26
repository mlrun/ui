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

import { monitorJob, pollAbortingJobs, rerunJob } from '../components/Jobs/jobs.util'

import { getJobKindFromLabels } from '../utils/jobs.util'
import { parseJob } from '../utils/parseJob'
import jobsActions from '../actions/jobs'
import workflowActions from '../actions/workflow'
import { FILTER_ALL_ITEMS, GROUP_BY_WORKFLOW, JOB_KIND_LOCAL, SCHEDULE_TAB } from '../constants'

export const useJobsPageData = (fetchAllJobRuns, fetchJobFunction, fetchJobs) => {
  const [jobRuns, setJobRuns] = useState([])
  const [editableItem, setEditableItem] = useState(null)
  const [jobWizardMode, setJobWizardMode] = useState(null)
  const [jobWizardIsOpened, setJobWizardIsOpened] = useState(false)
  const [jobs, setJobs] = useState([])
  const [abortingJobs, setAbortingJobs] = useState({})
  const abortControllerRef = useRef(new AbortController())
  const abortJobRef = useRef(null)
  const params = useParams()
  const [requestErrorMessage, setRequestErrorMessage] = useState('')
  const [scheduledJobs, setScheduledJobs] = useState([])
  const dispatch = useDispatch()
  const appStore = useSelector(store => store.appStore)

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
        'partition-by': 'project_and_name',
        'partition-sort-by': 'updated'
      }

      fetchData(
        filters.project?.toLowerCase?.() || params.projectName || '*',
        filters,
        {
          ui: {
            controller: abortControllerRef.current,
            setRequestErrorMessage
          },
          params: { ...newParams }
        },
        params.jobName ?? false
      ).then(jobs => {
        if (jobs) {
          const parsedJobs = jobs
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

  const refreshScheduled = useCallback(
    filters => {
      setScheduledJobs([])
      abortControllerRef.current = new AbortController()

      dispatch(
        jobsActions.fetchScheduledJobs(
          filters.project ? filters.project.toLowerCase() : params.projectName || '*',
          filters,
          {
            ui: {
              controller: abortControllerRef.current,
              setRequestErrorMessage
            }
          }
        )
      ).then(jobs => {
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
                (!filters.type || filters.type === FILTER_ALL_ITEMS || job.type === filters.type) &&
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
        workflowActions.fetchWorkflows(
          filters.project ? filters.project.toLowerCase() : params.projectName || '*',
          { ...filters, groupBy: GROUP_BY_WORKFLOW },
          {
            ui: {
              controller: abortControllerRef.current,
              setRequestErrorMessage
            }
          },
          !params.projectName
        )
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
    async job => await rerunJob(job, fetchJobFunction, setEditableItem, setJobWizardMode, dispatch),
    [fetchJobFunction, dispatch]
  )

  return {
    abortControllerRef,
    abortJobRef,
    abortingJobs,
    editableItem,
    getWorkflows,
    handleMonitoring,
    handleRerunJob,
    jobRuns,
    jobs,
    jobWizardIsOpened,
    jobWizardMode,
    refreshJobs,
    refreshScheduled,
    requestErrorMessage,
    scheduledJobs,
    setAbortingJobs,
    setEditableItem,
    setJobRuns,
    setJobWizardIsOpened,
    setJobWizardMode,
    setJobs,
    setScheduledJobs,
    terminateAbortTasksPolling
  }
}
