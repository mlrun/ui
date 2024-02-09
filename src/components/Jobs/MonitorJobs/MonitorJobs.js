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
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { connect, useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'

import JobWizard from '../../JobWizard/JobWizard'
import Details from '../../Details/Details'
import FilterMenu from '../../FilterMenu/FilterMenu'
import JobsTableRow from '../../../elements/JobsTableRow/JobsTableRow'
import NoData from '../../../common/NoData/NoData'
import Table from '../../Table/Table'
import TableTop from '../../../elements/TableTop/TableTop'
import YamlModal from '../../../common/YamlModal/YamlModal'

import { DANGER_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'
import {
  GROUP_BY_NONE,
  JOB_KIND_JOB,
  JOBS_PAGE,
  MONITOR_JOBS_TAB,
  PANEL_RERUN_MODE,
  REQUEST_CANCELED
} from '../../../constants'
import {
  generateActionsMenu,
  generateFilters,
  generatePageData,
  monitorJobsActionCreator
} from './monitorJobs.util'
import { JobsContext } from '../Jobs'
import { createJobsMonitorTabContent } from '../../../utils/createJobsContent'
import { datePickerOptions, PAST_WEEK_DATE_OPTION } from '../../../utils/datePicker.util'
import {
  enrichRunWithFunctionFields,
  handleAbortJob,
  handleDeleteJob,
  isJobKindLocal,
  pollAbortingJobs
} from '../jobs.util'
import getState from '../../../utils/getState'
import { getCloseDetailsLink } from '../../../utils/getCloseDetailsLink'
import { getJobLogs } from '../../../utils/getJobLogs.util'
import { getNoDataMessage } from '../../../utils/getNoDataMessage'
import { isDetailsTabExists } from '../../../utils/isDetailsTabExists'
import { openPopUp } from 'igz-controls/utils/common.util'
import { parseJob } from '../../../utils/parseJob'
import { setFilters } from '../../../reducers/filtersReducer'
import { setNotification } from '../../../reducers/notificationReducer'
import { showErrorNotification } from '../../../utils/notifications.util'
import { useMode } from '../../../hooks/mode.hook'
import { usePods } from '../../../hooks/usePods.hook'
import { useYaml } from '../../../hooks/yaml.hook'

const MonitorJobs = ({
  abortJob,
  deleteAllJobRuns,
  deleteJob,
  fetchAllJobRuns,
  fetchJob,
  fetchJobFunctions,
  fetchJobLogs,
  fetchJobPods,
  fetchJobs,
  removePods
}) => {
  const [abortingJobs, setAbortingJobs] = useState({})
  const [dataIsLoaded, setDataIsLoaded] = useState(false)
  const [jobRuns, setJobRuns] = useState([])
  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState({})
  const [convertedYaml, toggleConvertedYaml] = useYaml('')
  const [dateFilter, setDateFilter] = useState(['', ''])
  const appStore = useSelector(store => store.appStore)
  const jobsStore = useSelector(store => store.jobsStore)
  const filtersStore = useSelector(store => store.filtersStore)
  const [largeRequestErrorMessage, setLargeRequestErrorMessage] = useState('')
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { isStagingMode } = useMode()
  const abortJobRef = useRef(null)
  const fetchJobFunctionsPromiseRef = useRef()
  const abortControllerRef = useRef(new AbortController())
  const {
    editableItem,
    handleMonitoring,
    handleRerunJob,
    jobWizardIsOpened,
    jobWizardMode,
    setConfirmData,
    setEditableItem,
    setJobWizardIsOpened,
    setJobWizardMode
  } = React.useContext(JobsContext)
  const filters = useMemo(() => {
    return generateFilters(params.jobName)
  }, [params.jobName])
  const filterMenuClassNames = classnames(
    'content__action-bar-wrapper',
    params.jobId && 'content__action-bar-wrapper_hidden'
  )

  usePods(fetchJobPods, removePods, selectedJob)

  const tableContent = useMemo(
    () =>
      createJobsMonitorTabContent(params.jobName ? jobRuns : jobs, params.jobName, isStagingMode),
    [isStagingMode, jobRuns, jobs, params.jobName]
  )

  const handleFetchJobLogs = useCallback(
    (item, projectName, setDetailsLogs, streamLogsRef) => {
      return getJobLogs(item.uid, projectName, streamLogsRef, setDetailsLogs, fetchJobLogs)
    },
    [fetchJobLogs]
  )

  const pageData = useMemo(
    () =>
      generatePageData(
        handleFetchJobLogs,
        selectedJob,
        appStore.frontendSpec.jobs_dashboard_url,
        handleMonitoring
      ),
    [handleFetchJobLogs, selectedJob, appStore.frontendSpec.jobs_dashboard_url, handleMonitoring]
  )

  const terminateAbortTasksPolling = () => {
    abortJobRef?.current?.()
    setAbortingJobs({})
  }

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

      fetchData(
        params.projectName,
        filters,
        {
          ui: {
            controller: abortControllerRef.current,
            setLargeRequestErrorMessage
          }
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
    [dispatch, fetchAllJobRuns, fetchJobs, params.jobName, params.projectName]
  )

  const setJobStatusAborting = useCallback(
    (job, task) => {
      const setData = params.jobName ? setJobRuns : setJobs

      if (!isEmpty(selectedJob)) {
        setSelectedJob(state => ({
          ...state,
          abortTaskId: task,
          state: getState('aborting', JOBS_PAGE, JOB_KIND_JOB)
        }))
      }

      setData(state =>
        state.map(aJob => {
          if (aJob.uid === job.uid) {
            aJob.abortTaskId = task
            aJob.state = getState('aborting', JOBS_PAGE, JOB_KIND_JOB)
          }

          return aJob
        })
      )
    },
    [params.jobName, selectedJob]
  )

  const modifyAndSelectRun = useCallback(
    jobRun => {
      return enrichRunWithFunctionFields(
        dispatch,
        jobRun,
        fetchJobFunctions,
        fetchJobFunctionsPromiseRef
      ).then(jobRun => {
        setSelectedJob(jobRun)
      })
    },
    [dispatch, fetchJobFunctions]
  )

  const fetchRun = useCallback(() => {
    fetchJob(params.projectName, params.jobId)
      .then(job => {
        return modifyAndSelectRun(parseJob(job))
      })
      .catch(() => {
        showErrorNotification(dispatch, {}, 'This job either does not exist or was deleted')
        navigate(`/projects/${params.projectName}/jobs/${MONITOR_JOBS_TAB}`, { replace: true })
      })
      .finally(() => {
        fetchJobFunctionsPromiseRef.current = null
      })
  }, [dispatch, fetchJob, modifyAndSelectRun, navigate, params.jobId, params.projectName])

  const onAbortJob = useCallback(
    job => {
      const refresh = !isEmpty(selectedJob) ? fetchRun : () => refreshJobs(filtersStore)

      handleAbortJob(
        abortJob,
        params.projectName,
        job,
        setNotification,
        refresh,
        setConfirmData,
        dispatch,
        abortJobRef,
        task => setJobStatusAborting(job, task),
        abortingJobs,
        setAbortingJobs
      )
    },
    [
      abortJob,
      abortingJobs,
      dispatch,
      fetchRun,
      filtersStore,
      params.projectName,
      refreshJobs,
      selectedJob,
      setConfirmData,
      setJobStatusAborting
    ]
  )

  const handleConfirmAbortJob = useCallback(
    job => {
      setConfirmData({
        item: job,
        header: 'Abort job?',
        message: (
          <div>
            You try to abort job "{job.name}". <br />
            {isJobKindLocal(job) &&
              'This is a local run. You can abort the run, though the actual process will continue.'}
          </div>
        ),
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

  const onDeleteJob = useCallback(
    job => {
      handleDeleteJob(
        params.jobName || !isEmpty(selectedJob) ? deleteJob : deleteAllJobRuns,
        job,
        params.projectName,
        refreshJobs,
        filtersStore,
        dispatch
      ).then(() => {
        if (params.jobName)
          navigate(
            location.pathname
              .split('/')
              .splice(0, location.pathname.split('/').indexOf(params.jobName) + 1)
              .join('/')
          )
      })
    },
    [
      params.jobName,
      params.projectName,
      selectedJob,
      deleteJob,
      deleteAllJobRuns,
      refreshJobs,
      filtersStore,
      dispatch,
      navigate,
      location.pathname
    ]
  )

  const handleConfirmDeleteJob = useCallback(
    job => {
      setConfirmData({
        item: job,
        header: 'Delete job?',
        message: `Do you want to delete the job "${job.name}"? Deleted jobs can not be restored.`,
        btnConfirmLabel: 'Delete',
        btnConfirmType: DANGER_BUTTON,
        rejectHandler: () => {
          setConfirmData(null)
        },
        confirmHandler: () => {
          onDeleteJob(job)
          setConfirmData(null)
        }
      })
    },
    [onDeleteJob, setConfirmData]
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
        toggleConvertedYaml,
        selectedJob,
        handleConfirmDeleteJob
      )
  }, [
    handleRerunJob,
    appStore.frontendSpec.jobs_dashboard_url,
    appStore.frontendSpec.abortable_function_kinds,
    handleMonitoring,
    handleConfirmAbortJob,
    toggleConvertedYaml,
    selectedJob,
    handleConfirmDeleteJob
  ])

  const handleSelectRun = useCallback(
    item => {
      if (params.jobName) {
        if (document.getElementsByClassName('view')[0]) {
          document.getElementsByClassName('view')[0].classList.remove('view')
        }

        modifyAndSelectRun(item)
      }
    },
    [modifyAndSelectRun, params.jobName]
  )

  const isJobDataEmpty = useCallback(
    () => jobs.length === 0 && ((!params.jobName && jobRuns.length === 0) || params.jobName),
    [jobRuns.length, jobs.length, params.jobName]
  )

  useEffect(() => {
    if (selectedJob.name) {
      const urlPathArray = location.pathname.split('/')
      const jobNameIndex = urlPathArray.indexOf(selectedJob.uid) - 1

      if (urlPathArray[jobNameIndex] !== selectedJob.name && jobNameIndex > 0) {
        navigate(
          [
            ...urlPathArray.slice(0, jobNameIndex + 1),
            selectedJob.name,
            ...urlPathArray.slice(jobNameIndex + 1)
          ].join('/'),
          { replace: true }
        )
      }
    }
  }, [navigate, selectedJob.name, selectedJob.uid, location])

  useEffect(() => {
    if (params.jobId && pageData.details.menu.length > 0) {
      isDetailsTabExists(params.tab, pageData.details.menu, navigate, location)
    }
  }, [navigate, pageData.details.menu, location, params.jobId, params.tab])

  useEffect(() => {
    if (
      !fetchJobFunctionsPromiseRef.current &&
      params.jobId &&
      (isEmpty(selectedJob) || params.jobId !== selectedJob.uid)
    ) {
      fetchRun()
    }
  }, [fetchRun, params.jobId, selectedJob])

  useEffect(() => {
    if (!params.jobId && !isEmpty(selectedJob)) {
      setSelectedJob({})
    }
  }, [params.jobId, selectedJob])

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
  }, [params.projectName])

  useEffect(() => {
    return () => {
      setDataIsLoaded(false)
      terminateAbortTasksPolling()
    }
  }, [params.projectName, params.jobName, params.jobId])

  useEffect(() => {
    if (!isEmpty(selectedJob)) {
      // stop polling on entering Details panel.
      terminateAbortTasksPolling()

      if (selectedJob.state.value === 'aborting' && selectedJob.abortTaskId) {
        // start polling a single task.

        const abortingJob = {
          [selectedJob.abortTaskId]: {
            uid: selectedJob.uid,
            name: selectedJob.name
          }
        }

        pollAbortingJobs(params.projectName, abortJobRef, abortingJob, fetchRun, dispatch)
      }
    }
  }, [dispatch, filters, params.jobName, params.projectName, fetchRun, selectedJob, params.jobId])

  useEffect(() => {
    if (
      jobWizardMode &&
      !jobWizardIsOpened &&
      ((jobWizardMode === PANEL_RERUN_MODE && editableItem?.rerun_object) ||
        jobWizardMode !== PANEL_RERUN_MODE)
    ) {
      openPopUp(JobWizard, {
        params,
        onWizardClose: () => {
          setEditableItem(null)
          setJobWizardMode(null)
          setJobWizardIsOpened(false)
        },
        defaultData: jobWizardMode === PANEL_RERUN_MODE ? editableItem?.rerun_object : {},
        mode: jobWizardMode,
        wizardTitle: jobWizardMode === PANEL_RERUN_MODE ? 'Batch re-run' : undefined,
        onSuccessRequest: () => refreshJobs(filtersStore)
      })

      setJobWizardIsOpened(true)
    }
  }, [
    editableItem?.rerun_object,
    filtersStore,
    jobWizardIsOpened,
    jobWizardMode,
    params,
    refreshJobs,
    setEditableItem,
    setJobWizardIsOpened,
    setJobWizardMode
  ])

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
            withoutExpandButton
            enableAutoRefresh
          />
        </div>
      </div>

      {jobsStore.loading ? null : (params.jobName && jobRuns.length === 0) ||
        (jobs.length === 0 && !params.jobName) ? (
        <NoData
          message={getNoDataMessage(
            filtersStore,
            filters,
            largeRequestErrorMessage,
            JOBS_PAGE,
            MONITOR_JOBS_TAB
          )}
        />
      ) : (
        isEmpty(selectedJob) && (
          <Table
            actionsMenu={actionsMenu}
            handleCancel={() => setSelectedJob({})}
            handleSelectItem={handleSelectRun}
            pageData={pageData}
            retryRequest={refreshJobs}
            selectedItem={selectedJob}
            tab={MONITOR_JOBS_TAB}
            tableHeaders={tableContent[0]?.content ?? []}
          >
            {tableContent.map((tableItem, index) => (
              <JobsTableRow
                actionsMenu={actionsMenu}
                handleSelectJob={handleSelectRun}
                key={index}
                rowItem={tableItem}
                selectedJob={selectedJob}
              />
            ))}
          </Table>
        )
      )}
      {!isEmpty(selectedJob) && (
        <Details
          actionsMenu={actionsMenu}
          detailsMenu={pageData.details.menu}
          getCloseDetailsLink={() => getCloseDetailsLink(location, params.jobName)}
          handleCancel={() => setSelectedJob({})}
          handleRefresh={fetchRun}
          isDetailsScreen
          pageData={pageData}
          selectedItem={selectedJob}
          tab={MONITOR_JOBS_TAB}
        />
      )}
      {convertedYaml.length > 0 && (
        <YamlModal convertedYaml={convertedYaml} toggleConvertToYaml={toggleConvertedYaml} />
      )}
    </>
  )
}

export default connect(null, {
  ...monitorJobsActionCreator
})(React.memo(MonitorJobs))
