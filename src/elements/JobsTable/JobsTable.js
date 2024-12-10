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
import Loader from '../../common/Loader/Loader'
import NoData from '../../common/NoData/NoData'
import Pagination from '../../common/Pagination/Pagination'
import Table from '../../components/Table/Table'

import { JOB_KIND_JOB, JOBS_PAGE, MONITOR_JOBS_TAB, PANEL_RERUN_MODE } from '../../constants'
import {
  enrichRunWithFunctionFields,
  handleAbortJob,
  handleDeleteJob,
  isJobKindLocal
} from '../../components/Jobs/jobs.util'
import detailsActions from '../../actions/details'
import getState from '../../utils/getState'
import { DANGER_BUTTON } from 'igz-controls/constants'
import { FILTERS_CONFIG } from '../../types'
import { checkForSelectedJob } from '../../utils/jobs.util'
import { generateActionsMenu } from '../../components/Jobs/MonitorJobs/monitorJobs.util'
import { generatePageData } from './jobsTable.util'
import { getCloseDetailsLink, isDetailsTabExists } from '../../utils/link-helper.util'
import { getJobLogs } from '../../utils/getJobLogs.util'
import { getNoDataMessage } from '../../utils/getNoDataMessage'
import { openPopUp } from 'igz-controls/utils/common.util'
import { setNotification } from '../../reducers/notificationReducer'
import { toggleYaml } from '../../reducers/appReducer'
import { usePods } from '../../hooks/usePods.hook'

const JobsTable = React.forwardRef(
  (
    {
      abortingJobs,
      context,
      filters,
      filtersConfig,
      jobRuns,
      jobs,
      navigateLink,
      paginatedJobs,
      refreshJobs,
      requestErrorMessage,
      searchParams,
      selectedJob,
      setAbortingJobs,
      setJobRuns,
      setJobs,
      setSelectedJob,
      tableContent,
      terminateAbortTasksPolling
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
      paginationConfigJobsRef,
      setConfirmData,
      setEditableItem,
      setJobWizardIsOpened,
      setJobWizardMode
    } = React.useContext(context)

    usePods(dispatch, detailsActions.fetchJobPods, detailsActions.removePods, selectedJob)

    const toggleConvertedYaml = useCallback(
      data => {
        return dispatch(toggleYaml(data))
      },
      [dispatch]
    )

    const handleFetchJobLogs = useCallback(
      (item, projectName, setDetailsLogs, streamLogsRef) => {
        return getJobLogs(item.uid, projectName, streamLogsRef, setDetailsLogs, dispatch)
      },
      [dispatch]
    )

    const handleRefreshWithFilters = useCallback(() => {
      refreshJobs(filters)
    }, [filters, refreshJobs])

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
      job => {
        handleDeleteJob(
          params.jobName || !isEmpty(selectedJob),
          job,
          refreshJobs,
          filters,
          dispatch
        ).then(() => {
          if (params.jobName) {
            navigate(getCloseDetailsLink(params.jobName, true))
          }
        })
      },
      [params.jobName, selectedJob, refreshJobs, filters, dispatch, navigate]
    )

    const handleConfirmDeleteJob = useCallback(
      job => {
        setConfirmData({
          item: job,
          header: 'Delete job?',
          message: `Are you sure you want to delete the job "${job.name}"? Deleted jobs can not be restored.`,
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
          onSuccessRequest: () => refreshJobs(filters)
        })

        setJobWizardIsOpened(true)
      }
    }, [
      editableItem?.rerun_object,
      jobWizardIsOpened,
      jobWizardMode,
      filters,
      params,
      refreshJobs,
      setEditableItem,
      setJobWizardIsOpened,
      setJobWizardMode
    ])

    useEffect(() => {
      checkForSelectedJob(
        paginatedJobs,
        params.jobName,
        params.jobId,
        navigate,
        setSelectedJob,
        modifyAndSelectRun,
        searchParams,
        paginationConfigJobsRef
      )
    }, [
      searchParams,
      paginationConfigJobsRef,
      paginatedJobs,
      navigate,
      params.jobId,
      params.jobName,
      params.projectName,
      setSelectedJob,
      modifyAndSelectRun
    ])

    return (
      <>
        {jobsStore.loading && <Loader />}
        {paginatedJobs.length === 0 && !jobsStore.loading && filters ? (
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
                getCloseDetailsLink={() => getCloseDetailsLink(params.jobName)}
                handleCancel={() => setSelectedJob({})}
                pageData={pageData}
                retryRequest={handleRefreshWithFilters}
                selectedItem={selectedJob}
                tab={MONITOR_JOBS_TAB}
                tableClassName="monitor-jobs-table"
                tableHeaders={tableContent[0]?.content ?? []}
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
                page={pageData.page}
                paginationConfig={paginationConfigJobsRef.current}
                selectedItemName={selectedJob.name}
              />
            </>
          )
        )}
      </>
    )
  }
)

JobsTable.propTypes = {
  abortingJobs: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  filtersConfig: FILTERS_CONFIG.isRequired,
  jobRuns: PropTypes.array.isRequired,
  jobs: PropTypes.array.isRequired,
  navigateLink: PropTypes.string.isRequired,
  paginatedJobs: PropTypes.array.isRequired,
  refreshJobs: PropTypes.func.isRequired,
  requestErrorMessage: PropTypes.string.isRequired,
  searchParams: PropTypes.object.isRequired,
  selectedJob: PropTypes.object.isRequired,
  setAbortingJobs: PropTypes.func.isRequired,
  setJobRuns: PropTypes.func.isRequired,
  setJobs: PropTypes.func.isRequired,
  setSelectedJob: PropTypes.func.isRequired,
  tableContent: PropTypes.array.isRequired,
  terminateAbortTasksPolling: PropTypes.func.isRequired
}
export default JobsTable
