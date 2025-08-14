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
import React, { useMemo, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import JobWizard from '../../components/JobWizard/JobWizard'
import JobsTableRow from '../JobsTableRow/JobsTableRow'
import NoData from '../../common/NoData/NoData'
import Pagination from '../../common/Pagination/Pagination'
import Table from '../../components/Table/Table'
import { Loader } from 'igz-controls/components'

import {
  JOB_KIND_JOB,
  JOBS_MONITORING_JOBS_TAB,
  JOBS_PAGE,
  MONITOR_JOBS_TAB,
  PANEL_RERUN_MODE
} from '../../constants'
import {
  enrichRunWithFunctionFields,
  handleAbortJob,
  handleDeleteJob,
  isJobKindLocal
} from '../../components/Jobs/jobs.util'
import getState from '../../utils/getState'
import { DANGER_BUTTON } from 'igz-controls/constants'
import { FILTERS_CONFIG } from '../../types'
import { checkForSelectedJob } from '../../utils/jobs.util'
import { generateActionsMenu } from '../../components/Jobs/MonitorJobs/monitorJobs.util'
import { generatePageData, getConfirmDeleteJobMessage } from './jobsTable.util'
import { getCloseDetailsLink, isDetailsTabExists } from '../../utils/link-helper.util'
import { getJobLogs } from '../../utils/getJobLogs.util'
import { getNoDataMessage } from '../../utils/getNoDataMessage'
import { openPopUp } from 'igz-controls/utils/common.util'
import { setNotification } from 'igz-controls/reducers/notificationReducer'
import { toggleYaml } from '../../reducers/appReducer'
import { usePods } from '../../hooks/usePods.hook'
import { getInitialFiltersByConfig } from '../../hooks/useFiltersFromSearchParams.hook'

import './jobsTable.scss'

const JobsTable = React.forwardRef(
  (
    {
      abortingJobs,
      autoRefreshPrevValue,
      context,
      filters,
      filtersConfig,
      jobs = null,
      jobRuns = null,
      paginatedJobs,
      refreshJobs,
      requestErrorMessage,
      searchParams,
      selectedJob,
      setAbortingJobs,
      setJobRuns,
      setJobs,
      setSearchParams,
      setSelectedJob,
      tableContent
    },
    { abortJobRef, fetchJobFunctionsPromiseRef }
  ) => {
    const appStore = useSelector(store => store.appStore)
    const filtersStore = useSelector(store => store.filtersStore)
    const jobsStore = useSelector(store => store.jobsStore)
    const params = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const {
      editableItem,
      handleMonitoring,
      handleRerunJob,
      jobWizardIsOpened,
      jobWizardMode,
      lastCheckedJobIdRef,
      paginationConfigJobsRef,
      refreshAfterDeleteCallback,
      setConfirmData,
      setEditableItem,
      setJobWizardIsOpened,
      setJobWizardMode
    } = React.useContext(context)

    usePods(dispatch, selectedJob)

    const toggleConvertedYaml = useCallback(
      data => {
        return dispatch(toggleYaml(data))
      },
      [dispatch]
    )

    const handleFetchJobLogs = useCallback(
      (item, projectName, setDetailsLogs, streamLogsRef, runAttempt, signal) => {
        return getJobLogs(
          item.uid,
          projectName,
          streamLogsRef,
          setDetailsLogs,
          dispatch,
          runAttempt,
          signal
        )
      },
      [dispatch]
    )

    const pageData = useMemo(
      () => generatePageData(handleFetchJobLogs, selectedJob),
      [handleFetchJobLogs, selectedJob]
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
      [params.jobName, selectedJob, setJobRuns, setJobs, setSelectedJob]
    )

    const modifyAndSelectRun = useCallback(
      jobRun => {
        return enrichRunWithFunctionFields(dispatch, jobRun, fetchJobFunctionsPromiseRef).then(
          jobRun => {
            setSelectedJob(jobRun)
            fetchJobFunctionsPromiseRef.current = null
          }
        )
      },
      [dispatch, fetchJobFunctionsPromiseRef, setSelectedJob]
    )

    const onAbortJob = useCallback(
      job => {
        const refresh = () => refreshJobs(filters)

        handleAbortJob(
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
        abortJobRef,
        abortingJobs,
        dispatch,
        filters,
        refreshJobs,
        setAbortingJobs,
        setConfirmData,
        setJobStatusAborting
      ]
    )

    useEffect(() => {
      if (params.jobId && pageData.details.menu.length > 0) {
        isDetailsTabExists(params.tab, pageData.details.menu, navigate, location)
      }
    }, [navigate, pageData.details.menu, location, params.jobId, params.tab])

    const handleConfirmAbortJob = useCallback(
      job => {
        setConfirmData({
          item: job,
          header: 'Abort job?',
          message: (
            <div>
              Are you sure you want to abort the job "{job.name}"? <br />
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
      (job, isDeleteAll) => {
        handleDeleteJob(
          isDeleteAll,
          job,
          refreshJobs,
          refreshAfterDeleteCallback,
          filters,
          dispatch
        ).then(() => {
          if (params.jobName) {
            navigate(getCloseDetailsLink(params.jobName, true))
          }
        })
      },
      [refreshJobs, refreshAfterDeleteCallback, filters, dispatch, params.jobName, navigate]
    )

    const handleConfirmDeleteJob = useCallback(
      (job, isDeleteAll) => {
        setConfirmData({
          item: job,
          header: 'Delete job?',
          message: getConfirmDeleteJobMessage(job, isDeleteAll),
          btnConfirmLabel: 'Delete',
          btnConfirmType: DANGER_BUTTON,
          rejectHandler: () => {
            setConfirmData(null)
          },
          confirmHandler: () => {
            onDeleteJob(job, isDeleteAll)
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
          handleConfirmDeleteJob,
          false,
          params.jobName
        )
    }, [
      handleRerunJob,
      appStore.frontendSpec.jobs_dashboard_url,
      appStore.frontendSpec.abortable_function_kinds,
      handleMonitoring,
      handleConfirmAbortJob,
      toggleConvertedYaml,
      selectedJob,
      handleConfirmDeleteJob,
      params.jobName
    ])

    const refreshJobsWithFilters = useCallback(
      (useInitialFilter, isSchedule) => {
        if (!isSchedule) {
          const initialJobFilters = getInitialFiltersByConfig(filtersConfig)
          refreshJobs(useInitialFilter ? initialJobFilters : filters, { forceFetchJobs: true })
        }
      },
      [filters, refreshJobs, filtersConfig]
    )

    useEffect(() => {
      if (
        jobWizardMode &&
        !jobWizardIsOpened &&
        ((jobWizardMode === PANEL_RERUN_MODE && editableItem?.rerun_object) ||
          jobWizardMode !== PANEL_RERUN_MODE)
      ) {
        openPopUp(JobWizard, {
          params: {
            ...params,
            projectName: editableItem?.rerun_object?.task?.metadata?.project || params.projectName
          },
          onWizardClose: () => {
            setEditableItem(null)
            setJobWizardMode(null)
            setJobWizardIsOpened(false)
          },
          defaultData: jobWizardMode === PANEL_RERUN_MODE ? editableItem?.rerun_object : {},
          mode: jobWizardMode,
          wizardTitle: jobWizardMode === PANEL_RERUN_MODE ? 'Batch re-run' : undefined,
          onSuccessRequest: refreshJobsWithFilters,
          isCrossProjects: !params.projectName
        })

        setJobWizardIsOpened(true)
      }
    }, [
      editableItem?.rerun_object,
      jobWizardIsOpened,
      jobWizardMode,
      params,
      refreshJobsWithFilters,
      setEditableItem,
      setJobWizardIsOpened,
      setJobWizardMode
    ])

    useEffect(() => {
      checkForSelectedJob(
        paginatedJobs,
        jobRuns,
        jobs,
        params.jobName,
        params.jobId,
        params.projectName,
        navigate,
        setSelectedJob,
        modifyAndSelectRun,
        searchParams,
        paginationConfigJobsRef,
        dispatch,
        setSearchParams,
        lastCheckedJobIdRef
      )
    }, [
      searchParams,
      jobRuns,
      paginationConfigJobsRef,
      paginatedJobs,
      navigate,
      params.jobId,
      params.jobName,
      params.projectName,
      setSelectedJob,
      modifyAndSelectRun,
      dispatch,
      setSearchParams,
      lastCheckedJobIdRef,
      jobs
    ])

    useEffect(() => {
      if (isEmpty(selectedJob)) {
        lastCheckedJobIdRef.current = null
      }
    }, [lastCheckedJobIdRef, selectedJob])

    return (
      <>
        {jobsStore.loading && <Loader />}
        {paginatedJobs.length === 0 && !jobsStore.loading && filters && isEmpty(selectedJob) ? (
          <NoData
            message={getNoDataMessage(
              filters,
              filtersConfig,
              requestErrorMessage,
              JOBS_PAGE,
              MONITOR_JOBS_TAB,
              filtersStore
            )}
          />
        ) : (
          !jobsStore.loading && (
            <>
              <Table
                actionsMenu={actionsMenu}
                getCloseDetailsLink={() =>
                  getCloseDetailsLink(
                    params.jobName ||
                      (params.projectName ? MONITOR_JOBS_TAB : JOBS_MONITORING_JOBS_TAB)
                  )
                }
                handleCancel={() => setSelectedJob({})}
                pageData={pageData}
                selectedItem={selectedJob}
                tab={MONITOR_JOBS_TAB}
                tableClassName="monitor-jobs-table"
                tableHeaders={
                  tableContent[0]?.content ?? [
                    {
                      headerId: 'uid',
                      headerLabel: 'UID',
                      className: 'table-cell-name'
                    }
                  ]
                }
              >
                {tableContent.map((tableItem, index) => (
                  <JobsTableRow
                    actionsMenu={actionsMenu}
                    key={index}
                    rowItem={tableItem}
                    selectedJob={selectedJob}
                  />
                ))}
              </Table>
              <Pagination
                paginationConfig={paginationConfigJobsRef.current}
                closeParamName={selectedJob?.name}
                disabledNextDoubleBtnTooltip={
                  paginationConfigJobsRef.current?.paginationResponse?.['page-token'] &&
                  ((filtersStore.autoRefresh && !params.jobName) ||
                    (params.jobName && filtersStore.internalAutoRefresh))
                    ? 'Uncheck Auto Refresh to view more results'
                    : autoRefreshPrevValue &&
                        paginationConfigJobsRef.current?.paginationResponse?.['page-token']
                      ? 'Close detailed view and uncheck Auto Refresh to view more results'
                      : ''
                }
                disableNextDoubleBtn={
                  (filtersStore.autoRefresh && !params.jobName) ||
                  (params.jobName && filtersStore.internalAutoRefresh) ||
                  autoRefreshPrevValue
                }
              />
            </>
          )
        )}
      </>
    )
  }
)

JobsTable.displayName = 'JobsTable'

JobsTable.propTypes = {
  abortingJobs: PropTypes.object.isRequired,
  autoRefreshPrevValue: PropTypes.bool.isRequired,
  context: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  filtersConfig: FILTERS_CONFIG.isRequired,
  jobRuns: PropTypes.array,
  jobs: PropTypes.array,
  paginatedJobs: PropTypes.array.isRequired,
  refreshJobs: PropTypes.func.isRequired,
  requestErrorMessage: PropTypes.string.isRequired,
  searchParams: PropTypes.object.isRequired,
  selectedJob: PropTypes.object.isRequired,
  setAbortingJobs: PropTypes.func.isRequired,
  setJobRuns: PropTypes.func.isRequired,
  setJobs: PropTypes.func.isRequired,
  setSearchParams: PropTypes.func.isRequired,
  setSelectedJob: PropTypes.func.isRequired,
  tableContent: PropTypes.array.isRequired,
  terminateAbortTasksPolling: PropTypes.func.isRequired
}
export default JobsTable
