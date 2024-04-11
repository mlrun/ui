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
import React, { useMemo, useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import Table from '../../components/Table/Table'
import JobsTableRow from '../JobsTableRow/JobsTableRow'
import YamlModal from '../../common/YamlModal/YamlModal'
import Loader from '../../common/Loader/Loader'

import {
  JOB_KIND_JOB,
  JOBS_MONITORING_PAGE,
  JOBS_PAGE,
  MONITOR_JOBS_TAB,
  PANEL_RERUN_MODE
} from '../../constants'
import { DANGER_BUTTON } from 'igz-controls/constants'
import { openPopUp } from 'igz-controls/utils/common.util'
import {
  generateActionsMenu,
  generatePageData
} from '../../components/Jobs/MonitorJobs/monitorJobs.util'
import { isJobKindLocal, pollAbortingJobs } from '../../components/Jobs/jobs.util'
import { setNotification } from '../../reducers/notificationReducer'
import getState from '../../utils/getState'
import { usePods } from '../../hooks/usePods.hook'
import jobsActions from '../../actions/jobs'
import detailsActions from '../../actions/details'
import { enrichRunWithFunctionFields, handleAbortJob, handleDeleteJob } from './jobsTable.util'
import { useYaml } from '../../hooks/yaml.hook'
import { getJobLogs } from '../../utils/getJobLogs.util'
import NoData from '../../common/NoData/NoData'
import { getNoDataMessage } from '../../utils/getNoDataMessage'
import Details from '../../components/Details/Details'
import { getCloseDetailsLink } from '../../utils/getCloseDetailsLink'
import { isDetailsTabExists } from '../../utils/isDetailsTabExists'
import JobWizard from '../../components/JobWizard/JobWizard'
import { parseJob } from '../../utils/parseJob'
import { showErrorNotification } from '../../utils/notifications.util'
import PropTypes from 'prop-types'

const JobsTable = React.forwardRef(
  (
    {
      abortingJobs,
      context,
      filters,
      jobRuns,
      jobs,
      largeRequestErrorMessage,
      navigateLink,
      refreshJobs,
      selectedJob,
      setAbortingJobs,
      setJobRuns,
      setJobs,
      setSelectedJob,
      setSelectedRunProject,
      tableContent,
      terminateAbortTasksPolling
    },
    { abortJobRef }
  ) => {
    const [convertedYaml, toggleConvertedYaml] = useYaml('')
    const appStore = useSelector(store => store.appStore)
    const filtersStore = useSelector(store => store.filtersStore)
    const jobsStore = useSelector(store => store.jobsStore)
    const params = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const fetchJobFunctionsPromiseRef = useRef()
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
    } = React.useContext(context)

    usePods(dispatch, detailsActions.fetchJobPods, detailsActions.removePods, selectedJob)

    const handleFetchJobLogs = useCallback(
      (item, projectName, setDetailsLogs, streamLogsRef) => {
        return getJobLogs(
          item.uid,
          projectName,
          streamLogsRef,
          setDetailsLogs,
          jobsActions.fetchJobLogs,
          dispatch
        )
      },
      [dispatch]
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
        return enrichRunWithFunctionFields(
          dispatch,
          jobRun,
          jobsActions.fetchJobFunctions,
          fetchJobFunctionsPromiseRef
        ).then(jobRun => {
          setSelectedJob(jobRun)
        })
      },
      [dispatch, setSelectedJob]
    )

    const handleSelectRun = useCallback(
      item => {
        if (params.jobName) {
          if (document.getElementsByClassName('view')[0]) {
            document.getElementsByClassName('view')[0].classList.remove('view')
          }

          modifyAndSelectRun(item)
        }

        if (!params.jobName && setSelectedRunProject) {
          setSelectedRunProject(item.project)
        }
      },
      [modifyAndSelectRun, params.jobName, setSelectedRunProject]
    )

    const fetchRun = useCallback(
      project => {
        dispatch(jobsActions.fetchJob(project, params.jobId))
          .then(job => {
            return modifyAndSelectRun(parseJob(job))
          })
          .catch(() => {
            showErrorNotification(dispatch, {}, 'This job either does not exist or was deleted')
            navigate(navigateLink, { replace: true })
            // navigate(`/projects/${params.projectName}/jobs/${MONITOR_JOBS_TAB}`, { replace: true })
          })
          .finally(() => {
            fetchJobFunctionsPromiseRef.current = null
          })
      },
      [dispatch, modifyAndSelectRun, navigate, navigateLink, params.jobId]
    )

    const onAbortJob = useCallback(
      job => {
        const refresh = !isEmpty(selectedJob)
          ? () => fetchRun(job.project)
          : () => refreshJobs(filtersStore)

        handleAbortJob(
          jobsActions.abortJob,
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
        fetchRun,
        filtersStore,
        refreshJobs,
        selectedJob,
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
          params.jobName || !isEmpty(selectedJob)
            ? jobsActions.deleteJob
            : jobsActions.deleteAllJobRuns,
          job,
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
        selectedJob,
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

    useEffect(() => {
      if (selectedJob.name) {
        const urlPathArray = location.pathname.split('/')
        const jobIdIndex = urlPathArray.indexOf(selectedJob.uid)
        const jobNameIndex = urlPathArray.includes(JOBS_MONITORING_PAGE)
          ? jobIdIndex - 2
          : jobIdIndex - 1

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

          pollAbortingJobs(selectedJob.project, abortJobRef, abortingJob, fetchRun, dispatch)
        }
      }
    }, [
      dispatch,
      filters,
      params.jobName,
      fetchRun,
      selectedJob,
      params.jobId,
      terminateAbortTasksPolling,
      abortJobRef
    ])

    useEffect(() => {
      if (
        !fetchJobFunctionsPromiseRef.current &&
        params.jobId &&
        (isEmpty(selectedJob) || params.jobId !== selectedJob.uid)
      ) {
        fetchRun(params.jobProjectName || params.projectName)
      }
    }, [fetchRun, params.jobId, params.jobProjectName, params.projectName, selectedJob])

    useEffect(() => {
      if (!params.jobId && !isEmpty(selectedJob)) {
        setSelectedJob({})
        fetchJobFunctionsPromiseRef.current = null
      }
    }, [params.jobId, selectedJob, setSelectedJob])

    return (
      <>
        {jobsStore.loading && <Loader />}
        {((params.jobName && jobRuns.length === 0) || (jobs.length === 0 && !params.jobName)) &&
        !jobsStore.loading ? (
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
)

JobsTable.defaultProps = {
  setSelectedRunProject: null
}

JobsTable.propTypes = {
  abortingJobs: PropTypes.object.isRequired,
  context: PropTypes.object.isRequired,
  filters: PropTypes.array.isRequired,
  jobRuns: PropTypes.array.isRequired,
  jobs: PropTypes.array.isRequired,
  largeRequestErrorMessage: PropTypes.string.isRequired,
  navigateLink: PropTypes.string.isRequired,
  refreshJobs: PropTypes.func.isRequired,
  selectedJob: PropTypes.object.isRequired,
  setAbortingJobs: PropTypes.func.isRequired,
  setJobRuns: PropTypes.func.isRequired,
  setJobs: PropTypes.func.isRequired,
  setSelectedJob: PropTypes.func.isRequired,
  setSelectedRunProject: PropTypes.func,
  tableContent: PropTypes.array.isRequired,
  terminateAbortTasksPolling: PropTypes.func.isRequired
}
export default JobsTable
