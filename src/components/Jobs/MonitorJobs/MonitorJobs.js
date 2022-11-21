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
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { isEmpty } from 'lodash'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { connect, useDispatch, useSelector } from 'react-redux'

import MonitorJobsView from './MonitorJobsView'

import { GROUP_BY_NONE, MONITOR_JOBS_TAB } from '../../../constants'
import { DANGER_BUTTON } from 'igz-controls/constants'
import { handleAbortJob } from '../jobs.util'
import { parseJob } from '../../../utils/parseJob'
import { useYaml } from '../../../hooks/yaml.hook'
import { isDetailsTabExists } from '../../../utils/isDetailsTabExists'
import { datePickerOptions, PAST_WEEK_DATE_OPTION } from '../../../utils/datePicker.util'
import { JobsContext } from '../Jobs'
import {
  generateActionsMenu,
  generateFilters,
  generatePageData,
  monitorJobsActionCreator
} from './monitorJobs.util'
import { setNotification } from '../../../reducers/notificationReducer'
import { usePods } from '../../../hooks/usePods.hook'
import { useMode } from '../../../hooks/mode.hook'
import { createJobsMonitorTabContent } from '../../../utils/createJobsContent'

const MonitorJobs = ({
  abortJob,
  fetchAllJobRuns,
  fetchJob,
  fetchJobLogs,
  fetchJobPods,
  fetchJobs,
  removeJobLogs,
  removeNewJob,
  removePods,
  setFilters
}) => {
  const [dataIsLoaded, setDataIsLoaded] = useState(false)
  const [jobs, setJobs] = useState([])
  const [jobRuns, setJobRuns] = useState([])
  const [selectedJob, setSelectedJob] = useState({})
  const [convertedYaml, toggleConvertedYaml] = useYaml('')
  const [dateFilter, setDateFilter] = useState(['', ''])
  const appStore = useSelector(store => store.appStore)
  const jobsStore = useSelector(store => store.jobsStore)
  const filtersStore = useSelector(store => store.filtersStore)
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { isStagingMode } = useMode()
  const { editableItem, handleMonitoring, handleRerunJob, setConfirmData, setEditableItem } =
    React.useContext(JobsContext)
  const filters = useMemo(() => {
    return generateFilters(params.jobName)
  }, [params.jobName])

  usePods(fetchJobPods, removePods, selectedJob)

  const tableContent = useMemo(
    () =>
      createJobsMonitorTabContent(params.jobName ? jobRuns : jobs, params.jobName, isStagingMode),
    [isStagingMode, jobRuns, jobs, params.jobName]
  )

  const pageData = useMemo(
    () => generatePageData(fetchJobLogs, removeJobLogs, selectedJob),
    [fetchJobLogs, removeJobLogs, selectedJob]
  )

  const refreshJobs = useCallback(
    filters => {
      if (filters.dates) {
        setDateFilter(filters.dates.value)
      }

      const fetchData = params.jobName ? fetchAllJobRuns : fetchJobs

      fetchData(params.projectName, filters, params.jobName ?? false)
        .then(jobs => {
          const parsedJobs = jobs.map(job => parseJob(job, MONITOR_JOBS_TAB))

          if (params.jobName) {
            setJobRuns(parsedJobs)
          } else {
            setJobs(parsedJobs)
          }
        })
        .catch(error => {
          dispatch(
            setNotification({
              status: error?.response?.status || 400,
              id: Math.random(),
              message: 'Failed to fetch jobs',
              retry: () => refreshJobs(filters)
            })
          )
        })
    },
    [dispatch, fetchAllJobRuns, fetchJobs, params.jobName, params.projectName]
  )

  const onAbortJob = useCallback(
    job => {
      handleAbortJob(
        abortJob,
        params.projectName,
        job,
        filtersStore,
        setNotification,
        refreshJobs,
        setConfirmData,
        dispatch
      )
    },
    [abortJob, dispatch, filtersStore, params.projectName, refreshJobs, setConfirmData]
  )

  const handleConfirmAbortJob = useCallback(
    job => {
      setConfirmData({
        item: job,
        header: 'Abort job?',
        message: `You try to abort job "${job.name}".`,
        btnConfirmLabel: 'Abort',
        btnConfirmType: DANGER_BUTTON,
        rejectHandler: () => {
          setConfirmData(null)
        },
        confirmHandler: () => {
          onAbortJob(job)
        }
      })
    },
    [onAbortJob, setConfirmData]
  )

  const actionsMenu = useMemo(() => {
    return job =>
      generateActionsMenu(
        job,
        handleRerunJob,
        appStore.frontendSpec.jobs_dashboard_url,
        handleMonitoring,
        appStore.frontendSpec.abortable_function_kinds,
        handleConfirmAbortJob,
        toggleConvertedYaml
      )
  }, [
    appStore.frontendSpec.abortable_function_kinds,
    appStore.frontendSpec.jobs_dashboard_url,
    handleMonitoring,
    handleRerunJob,
    handleConfirmAbortJob,
    toggleConvertedYaml
  ])

  const handleSelectJob = useCallback(
    item => {
      if (params.jobName) {
        if (document.getElementsByClassName('view')[0]) {
          document.getElementsByClassName('view')[0].classList.remove('view')
        }

        setSelectedJob(item)
      }
    },
    [params.jobName]
  )

  const fetchCurrentJob = useCallback(() => {
    return fetchJob(params.projectName, params.jobId)
      .then(job => {
        setSelectedJob(parseJob(job))

        return job
      })
      .catch(() =>
        navigate(`/projects/${params.projectName}/jobs/${MONITOR_JOBS_TAB}`, { replace: true })
      )
  }, [fetchJob, navigate, params.jobId, params.projectName])

  const isJobDataEmpty = useCallback(
    () => jobs.length === 0 && ((!params.jobName && jobRuns.length === 0) || params.jobName),
    [jobRuns.length, jobs.length, params.jobName]
  )

  const handleSuccessRerunJob = useCallback(
    tab => {
      if (tab === MONITOR_JOBS_TAB) {
        refreshJobs(filtersStore)
      }

      setEditableItem(null)
      dispatch(
        setNotification({
          status: 200,
          id: Math.random(),
          message: 'Job started successfully'
        })
      )
    },
    [dispatch, filtersStore, refreshJobs, setEditableItem]
  )

  useEffect(() => {
    if (params.jobId && pageData.details.menu.length > 0) {
      isDetailsTabExists(params.tab, pageData.details.menu, navigate, location)
    }
  }, [navigate, pageData.details.menu, location, params.jobId, params.tab])

  useEffect(() => {
    if (params.jobId && (isEmpty(selectedJob) || params.jobId !== selectedJob.uid)) {
      fetchCurrentJob()
    }
  }, [fetchCurrentJob, params.jobId, selectedJob])

  useEffect(() => {
    if (!params.jobId && !isEmpty(selectedJob)) {
      setSelectedJob({})
    }
  }, [params.jobId, selectedJob])

  useEffect(() => {
    if (isEmpty(selectedJob) && !params.jobId && !dataIsLoaded) {
      let filters = {}

      if (isJobDataEmpty()) {
        const pastWeekOption = datePickerOptions.find(option => option.id === PAST_WEEK_DATE_OPTION)

        filters = {
          dates: {
            value: pastWeekOption.handler(),
            isPredefined: pastWeekOption.isPredefined
          }
        }
      } else {
        filters = {
          dates: {
            value: dateFilter,
            isPredefined: false
          }
        }
      }

      refreshJobs(filters)
      setFilters(filters)
      setDataIsLoaded(true)
    }
  }, [
    dataIsLoaded,
    dateFilter,
    isJobDataEmpty,
    params.jobId,
    params.jobName,
    params.projectName,
    refreshJobs,
    selectedJob,
    setFilters
  ])

  useEffect(() => {
    setFilters({ groupBy: GROUP_BY_NONE })
  }, [setFilters])

  useEffect(() => {
    return () => {
      setJobs([])
      setJobRuns([])
    }
  }, [params.projectName])

  useEffect(() => {
    return () => {
      setDataIsLoaded(false)
    }
  }, [params.projectName, params.jobName])

  return (
    <MonitorJobsView
      actionsMenu={actionsMenu}
      appStore={appStore}
      convertedYaml={convertedYaml}
      editableItem={editableItem}
      fetchCurrentJob={fetchCurrentJob}
      filters={filters}
      filtersStore={filtersStore}
      handleMonitoring={handleMonitoring}
      handleSelectJob={handleSelectJob}
      handleSuccessRerunJob={handleSuccessRerunJob}
      jobRuns={jobRuns}
      jobs={jobs}
      jobsStore={jobsStore}
      pageData={pageData}
      refreshJobs={refreshJobs}
      removeNewJob={removeNewJob}
      selectedJob={selectedJob}
      setEditableItem={setEditableItem}
      setSelectedJob={setSelectedJob}
      tableContent={tableContent}
      toggleConvertedYaml={toggleConvertedYaml}
    />
  )
}

export default connect(null, {
  ...monitorJobsActionCreator
})(React.memo(MonitorJobs))
