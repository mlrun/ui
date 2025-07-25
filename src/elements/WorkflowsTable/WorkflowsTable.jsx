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
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { find, isEmpty } from 'lodash'

import JobWizard from '../../components/JobWizard/JobWizard'
import JobsTableRow from '../JobsTableRow/JobsTableRow'
import NoData from '../../common/NoData/NoData'
import Table from '../../components/Table/Table'
import Workflow from '../../components/Workflow/Workflow'
import { Loader } from 'igz-controls/components'

import {
  ERROR_STATE,
  FAILED_STATE,
  JOB_KIND_JOB,
  JOBS_PAGE,
  MONITOR_JOBS_TAB,
  MONITOR_WORKFLOWS_TAB,
  PANEL_RERUN_MODE,
  WORKFLOW_GRAPH_VIEW
} from '../../constants'
import {
  generateActionsMenu,
  generatePageData
} from '../../components/Jobs/MonitorWorkflows/monitorWorkflows.util'
import {
  enrichRunWithFunctionFields,
  handleAbortJob,
  handleDeleteJob,
  isJobKindLocal,
  pollAbortingJobs
} from '../../components/Jobs/jobs.util'
import getState from '../../utils/getState'
import { DANGER_BUTTON } from 'igz-controls/constants'
import { FILTERS_CONFIG } from '../../types'
import { fetchFunction } from '../../reducers/functionReducer'
import { fetchJob } from '../../reducers/jobReducer'
import { fetchWorkflow, rerunWorkflow, resetWorkflow } from '../../reducers/workflowReducer'
import { getFunctionLogs } from '../../utils/getFunctionLogs'
import { getJobLogs } from '../../utils/getJobLogs.util'
import { getNoDataMessage } from '../../utils/getNoDataMessage'
import { isDetailsTabExists } from '../../utils/link-helper.util'
import { isRowRendered, useVirtualization } from '../../hooks/useVirtualization.hook'
import {
  isWorkflowStepExecutable,
  handleTerminateWorkflow,
  fetchMissingProjectsPermissions
} from '../../components/Workflow/workflow.util'
import { openPopUp, getScssVariableValue } from 'igz-controls/utils/common.util'
import { parseFunction } from '../../utils/parseFunction'
import { parseJob } from '../../utils/parseJob'
import { setNotification } from 'igz-controls/reducers/notificationReducer'
import { showErrorNotification } from 'igz-controls/utils/notification.util'
import { toggleYaml } from '../../reducers/appReducer'
import { useSortTable } from '../../hooks/useSortTable.hook'

import './workflowsTable.scss'

const WorkflowsTable = React.forwardRef(
  (
    {
      backLink,
      context,
      filters,
      filtersConfig,
      getWorkflows,
      itemIsSelected,
      requestErrorMessage,
      selectedFunction,
      selectedJob,
      setItemIsSelected,
      setSelectedFunction,
      setSelectedJob,
      setWorkflowIsLoaded,
      tableContent = [],
      workflowIsLoaded
    },
    abortJobRef
  ) => {
    const [dataIsLoading, setDataIsLoading] = useState(false)
    const [rerunIsDisabled, setRerunIsDisabled] = useState(false)
    const [workflowsViewMode, setWorkflowsViewMode] = useState(WORKFLOW_GRAPH_VIEW)
    const workflowsStore = useSelector(state => state.workflowsStore)
    const filtersStore = useSelector(state => state.filtersStore)
    const appStore = useSelector(store => store.appStore)
    const params = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const fetchJobFunctionsPromiseRef = useRef()
    let fetchFunctionLogsTimeout = useRef(null)
    const accessibleProjectsMap = useSelector(state => state.projectStore.accessibleProjectsMap)
    const [permissionsLoading, setPermissionsLoading] = useState(false)

    useEffect(() => {
      const projectNames = workflowsStore.workflows.data.map(workflow => workflow.project)
      setPermissionsLoading(true)
      projectNames &&
        fetchMissingProjectsPermissions(projectNames, accessibleProjectsMap, dispatch).finally(
          () => {
            setPermissionsLoading(false)
          }
        )
    }, [dispatch, workflowsStore.workflows.data, accessibleProjectsMap])

    const monitorWorkflowsRowHeight = useMemo(
      () => getScssVariableValue('--monitorWorkflowsRowHeight'),
      []
    )
    const monitorWorkflowsRowHeightExtended = useMemo(
      () => getScssVariableValue('--monitorWorkflowsRowHeightExtended'),
      []
    )
    const monitorWorkflowsHeaderRowHeight = useMemo(
      () => getScssVariableValue('--monitorWorkflowsHeaderRowHeight'),
      []
    )

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

    const { sortedTableContent } = useSortTable({
      headers: tableContent[0]?.content,
      content: tableContent,
      sortConfig: { defaultSortBy: 'createdat', defaultDirection: 'desc' }
    })

    const handleRetry = useCallback(() => {
      getWorkflows(filters)
    }, [filters, getWorkflows])

    const handleFetchFunctionLogs = useCallback(
      (item, projectName, setDetailsLogs) => {
        return getFunctionLogs(
          dispatch,
          fetchFunctionLogsTimeout,
          projectName,
          item.name,
          item.tag,
          setDetailsLogs
        )
      },
      [fetchFunctionLogsTimeout, dispatch]
    )

    const handleFetchJobLogs = useCallback(
      (item, projectName, setDetailsLogs, streamLogsRef) => {
        return getJobLogs(item.uid, projectName, streamLogsRef, setDetailsLogs, dispatch)
      },
      [dispatch]
    )

    const toggleConvertedYaml = useCallback(
      data => {
        return dispatch(toggleYaml(data))
      },
      [dispatch]
    )

    const handleRemoveFunctionLogs = useCallback(() => {
      clearTimeout(fetchFunctionLogsTimeout.current)
    }, [fetchFunctionLogsTimeout])

    const pageData = useMemo(
      () =>
        generatePageData(
          selectedFunction,
          handleFetchFunctionLogs,
          handleFetchJobLogs,
          handleRemoveFunctionLogs,
          selectedJob
        ),
      [
        handleFetchJobLogs,
        handleFetchFunctionLogs,
        handleRemoveFunctionLogs,
        selectedFunction,
        selectedJob
      ]
    )

    const refreshWorkflow = useCallback(() => {
      return dispatch(
        fetchWorkflow({
          project: params.workflowProjectName || params.projectName,
          workflowId: params.workflowId
        })
      )
        .unwrap()
        .catch(error => {
          showErrorNotification(dispatch, error, 'Failed to fetch workflow')
          navigate(backLink, {
            replace: true
          })
        })
    }, [
      backLink,
      dispatch,
      navigate,
      params.projectName,
      params.workflowId,
      params.workflowProjectName
    ])

    const handlePollAbortingJob = useCallback(
      (jobRun, refresh) => {
        if (jobRun.abortTaskId && jobRun.state.value === 'aborting') {
          const abortingJob = {
            [jobRun.abortTaskId]: {
              uid: jobRun.uid,
              name: jobRun.name
            }
          }

          pollAbortingJobs(
            params.workflowProjectName || params.projectName,
            abortJobRef,
            abortingJob,
            refresh,
            dispatch
          )
        }
      },
      [abortJobRef, dispatch, params.projectName, params.workflowProjectName]
    )

    const modifyAndSelectRun = useCallback(
      (jobRun, refresh) => {
        return enrichRunWithFunctionFields(dispatch, jobRun, fetchJobFunctionsPromiseRef).then(
          jobRun => {
            setSelectedJob(jobRun)
            setSelectedFunction({})
            setItemIsSelected(true)

            if (refresh) {
              handlePollAbortingJob(jobRun, refresh)
            }
          }
        )
      },
      [dispatch, handlePollAbortingJob, setItemIsSelected, setSelectedFunction, setSelectedJob]
    )

    const findSelectedWorkflowJob = useCallback(() => {
      if (workflowsStore.activeWorkflow?.data) {
        const workflow = { ...workflowsStore.activeWorkflow.data }

        return find(
          workflow.graph,
          workflowItem => workflowItem.run_type === 'run' && workflowItem.run_uid === params.jobId
        )
      }
    }, [params.jobId, workflowsStore.activeWorkflow.data])

    const getPipelineError = useCallback(
      isErrorState => {
        return isErrorState &&
          workflowsStore.activeWorkflow?.data?.run?.error &&
          workflowsStore.activeWorkflow.data.run.error !== 'None'
          ? {
              title: 'Pipeline error - ',
              message: workflowsStore.activeWorkflow.data.run.error
            }
          : {}
      },
      [workflowsStore.activeWorkflow.data]
    )

    const fetchRun = useCallback(() => {
      return dispatch(
        fetchJob({ project: params.workflowProjectName || params.projectName, jobId: params.jobId })
      )
        .unwrap()
        .then(job => {
          const selectedJob = findSelectedWorkflowJob()
          const graphJobState = selectedJob?.phase?.toLowerCase()
          const isErrorState = [FAILED_STATE, ERROR_STATE].includes(graphJobState)
          const customJobState = isErrorState ? graphJobState : ''

          return modifyAndSelectRun(
            parseJob(job, MONITOR_WORKFLOWS_TAB, customJobState, getPipelineError(isErrorState)),
            fetchRun
          )
        })
        .catch(() =>
          navigate(backLink, {
            replace: true
          })
        )
        .finally(() => {
          fetchJobFunctionsPromiseRef.current = null
        })
    }, [
      backLink,
      dispatch,
      findSelectedWorkflowJob,
      modifyAndSelectRun,
      navigate,
      params.jobId,
      params.projectName,
      params.workflowProjectName,
      getPipelineError
    ])

    const setJobStatusAborting = useCallback(
      task => {
        setSelectedJob(state => ({
          ...state,
          abortTaskId: task,
          state: getState('aborting', JOBS_PAGE, JOB_KIND_JOB)
        }))
      },
      [setSelectedJob]
    )

    const onAbortJob = useCallback(
      job => {
        const refresh = () => {
          refreshWorkflow()
          fetchRun()
        }

        handleAbortJob(
          job,
          setNotification,
          refresh,
          setConfirmData,
          dispatch,
          abortJobRef,
          setJobStatusAborting
        )
      },
      [abortJobRef, dispatch, fetchRun, refreshWorkflow, setConfirmData, setJobStatusAborting]
    )

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
            setConfirmData(null)
          }
        })
      },
      [onAbortJob, setConfirmData]
    )

    const onTerminateWorkflow = useCallback(
      job => {
        handleTerminateWorkflow(job, dispatch)
      },
      [dispatch]
    )

    const onDeleteJob = useCallback(
      job => {
        handleDeleteJob(false, job, refreshWorkflow, null, filters, dispatch).then(() => {
          navigate(
            location.pathname
              .split('/')
              .splice(0, location.pathname.split('/').indexOf(params.workflowId) + 1)
              .join('/') + window.location.search
          )
        })
      },
      [dispatch, filters, location.pathname, navigate, params.workflowId, refreshWorkflow]
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

    const handleConfirmTerminateWorkflow = useCallback(
      job => {
        setConfirmData({
          item: job,
          header: 'Terminate workflow',
          message: `Are you sure you want to terminate the workflow "${job.name}" (stop its execution)? Workflows termination cannot be undone.`,
          btnConfirmLabel: 'Terminate',
          btnConfirmType: DANGER_BUTTON,
          rejectHandler: () => {
            setConfirmData(null)
          },
          confirmHandler: () => {
            onTerminateWorkflow(job)
            setConfirmData(null)
          }
        })
      },
      [onTerminateWorkflow, setConfirmData]
    )

    const handleRerun = useCallback(
      workflow => {
        dispatch(rerunWorkflow({ project: workflow.project, workflowId: workflow.id }))
          .unwrap()
          .then(() => {
            handleRetry()
            dispatch(
              setNotification({
                status: 200,
                id: Math.random(),
                message: 'Workflow run successfully.'
              })
            )
          })
          .catch(error => {
            showErrorNotification(dispatch, error, 'Workflow did not run successfully', '', () =>
              handleRerun(workflow)
            )
          })
      },
      [dispatch, handleRetry]
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
          handleConfirmDeleteJob,
          handleConfirmTerminateWorkflow,
          accessibleProjectsMap,
          toggleConvertedYaml,
          handleRerun,
          rerunIsDisabled
        )
    }, [
      handleRerunJob,
      appStore.frontendSpec.jobs_dashboard_url,
      appStore.frontendSpec.abortable_function_kinds,
      handleMonitoring,
      handleConfirmAbortJob,
      handleConfirmDeleteJob,
      handleConfirmTerminateWorkflow,
      accessibleProjectsMap,
      toggleConvertedYaml,
      handleRerun,
      rerunIsDisabled
    ])

    const handleCancel = useCallback(() => {
      setSelectedJob({})
      setSelectedFunction({})
      setItemIsSelected(false)
    }, [setItemIsSelected, setSelectedFunction, setSelectedJob])

    const findSelectedWorkflowFunction = useCallback(
      withoutRunType => {
        if (workflowsStore.activeWorkflow?.data) {
          const workflow = { ...workflowsStore.activeWorkflow.data }

          return find(workflow.graph, workflowItem => {
            let workflowItemIsFound =
              workflowItem.function?.includes(`${params.functionName}@${params.functionHash}`) ||
              workflowItem.function?.includes(params.functionName) ||
              workflowItem.function?.includes(params.jobId)

            if (withoutRunType) {
              workflowItemIsFound = workflowItemIsFound && workflowItem.run_type !== 'run'
            }

            return workflowItemIsFound
          })
        }
      },
      [params.functionName, params.functionHash, params.jobId, workflowsStore.activeWorkflow.data]
    )

    const checkIfWorkflowItemIsJob = useCallback(() => {
      if (workflowsStore.activeWorkflow?.data?.graph) {
        let selectedWorkflowItem = findSelectedWorkflowFunction(true)

        if (isEmpty(selectedWorkflowItem)) {
          selectedWorkflowItem = findSelectedWorkflowFunction(false)
        }

        return !['deploy', 'build'].includes(selectedWorkflowItem?.run_type)
      }
    }, [workflowsStore.activeWorkflow.data.graph, findSelectedWorkflowFunction])

    const handleCatchRequest = useCallback(
      (error, message) => {
        showErrorNotification(dispatch, error, message, '')
        navigate(
          location.pathname
            .split('/')
            .splice(0, location.pathname.split('/').indexOf(params.workflowId) + 1)
            .join('/') + window.location.search
        )
      },
      [dispatch, location.pathname, navigate, params.workflowId]
    )

    useEffect(() => {
      if (
        !fetchJobFunctionsPromiseRef.current &&
        params.jobId &&
        (isEmpty(selectedJob) || params.jobId !== selectedJob.uid) &&
        checkIfWorkflowItemIsJob() &&
        !dataIsLoading
      ) {
        setDataIsLoading(true)
        fetchRun().finally(() => setDataIsLoading(false))
      }
    }, [fetchRun, params.jobId, selectedJob, checkIfWorkflowItemIsJob, dataIsLoading])

    useEffect(() => {
      const functionToBeSelected = findSelectedWorkflowFunction(true)

      if (isWorkflowStepExecutable(functionToBeSelected)) {
        const workflow = { ...workflowsStore.activeWorkflow?.data }
        const graphFunctionState = functionToBeSelected?.phase?.toLowerCase()
        const isErrorState = [FAILED_STATE, ERROR_STATE].includes(graphFunctionState)
        const customFunctionState = isErrorState ? graphFunctionState : ''
        const pipelineError = getPipelineError(isErrorState)

        if (
          workflow.graph &&
          params.functionHash &&
          (isEmpty(selectedFunction) || params.functionHash !== selectedFunction.hash)
        ) {
          if (params.functionName !== selectedFunction.name) {
            dispatch(
              fetchFunction({
                project: params.workflowProjectName || params.projectName,
                name: params.functionName,
                hash: params.functionHash === 'latest' ? '' : params.functionHash
              })
            )
              .unwrap()
              .then(func => {
                setSelectedFunction(
                  parseFunction(
                    func,
                    params.workflowProjectName || params.projectName,
                    customFunctionState,
                    pipelineError
                  )
                )
                setItemIsSelected(true)
                setSelectedJob({})
              })
              .catch(error => handleCatchRequest(error, 'Failed to fetch function'))
          }
        } else if (
          workflow.graph &&
          params.jobId &&
          (isEmpty(selectedFunction) || params.jobId !== selectedFunction.name) &&
          !checkIfWorkflowItemIsJob()
        ) {
          dispatch(
            fetchFunction({
              project: params.workflowProjectName || params.projectName,
              name: params.jobId
            })
          )
            .unwrap()
            .then(func => {
              setSelectedFunction(
                parseFunction(
                  func,
                  params.workflowProjectName || params.projectName,
                  customFunctionState,
                  pipelineError
                )
              )
              setItemIsSelected(true)
              setSelectedJob({})
            })
            .catch(error => handleCatchRequest(error, 'Failed to fetch function'))
        }
      }
    }, [
      findSelectedWorkflowFunction,
      handleCatchRequest,
      params.functionHash,
      params.functionName,
      params.projectName,
      selectedFunction,
      workflowsStore.activeWorkflow,
      checkIfWorkflowItemIsJob,
      params.jobId,
      dispatch,
      setSelectedFunction,
      setItemIsSelected,
      setSelectedJob,
      params.workflowProjectName,
      getPipelineError
    ])

    useEffect(() => {
      if ((params.jobId || params.functionHash) && pageData.details.menu.length > 0) {
        isDetailsTabExists(params.tab, pageData.details.menu, navigate, location)
      }
    }, [navigate, pageData.details.menu, location, params.jobId, params.functionHash, params.tab])

    useEffect(() => {
      const workflow = { ...workflowsStore.activeWorkflow?.data }

      if (!params.workflowId && workflow.graph) {
        dispatch(resetWorkflow())
      }

      if (!workflow.graph && params.workflowId && !workflowIsLoaded) {
        refreshWorkflow()
        setWorkflowIsLoaded(true)
      }

      if (
        ['Running', 'None'].includes(workflow?.run?.status) &&
        params.workflowId &&
        workflow.graph
      ) {
        const timeout = setTimeout(refreshWorkflow, 10000)

        return () => clearTimeout(timeout)
      }
    }, [
      refreshWorkflow,
      dispatch,
      workflowIsLoaded,
      params.workflowId,
      workflowsStore.activeWorkflow,
      setWorkflowIsLoaded
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
          wizardTitle: jobWizardMode === PANEL_RERUN_MODE ? 'Batch re-run' : undefined
        })

        setJobWizardIsOpened(true)
      }
    }, [
      editableItem?.rerun_object,
      filters,
      jobWizardIsOpened,
      jobWizardMode,
      params,
      setEditableItem,
      setJobWizardIsOpened,
      setJobWizardMode
    ])

    useEffect(() => {
      abortJobRef.current?.()
    }, [abortJobRef, params.jobId])

    useEffect(() => {
      if (!params.functionHash && !params.jobId) {
        setItemIsSelected(false)
        setSelectedJob({})
        setSelectedFunction({})
      }
    }, [params.functionHash, params.jobId, setItemIsSelected, setSelectedFunction, setSelectedJob])

    useEffect(() => {
      if (workflowsStore.workflows.rerunInProgress) {
        setRerunIsDisabled(true)
        setTimeout(() => {
          setRerunIsDisabled(false)
        }, 5000)
      }
    }, [workflowsStore.workflows.rerunInProgress])

    const virtualizationConfig = useVirtualization({
      rowsData: {
        content: tableContent
      },
      heightData: {
        headerRowHeight: monitorWorkflowsHeaderRowHeight,
        rowHeight: monitorWorkflowsRowHeight,
        rowHeightExtended: monitorWorkflowsRowHeightExtended
      }
    })

    return (
      <>
        {(workflowsStore.workflows.loading || permissionsLoading) && <Loader />}
        {workflowsStore.workflows.loading ? null : (!workflowsStore.workflows.loading &&
            !params.workflowId &&
            workflowsStore.workflows.data.length === 0) ||
          requestErrorMessage ? (
          <NoData
            message={getNoDataMessage(
              filters,
              filtersConfig,
              requestErrorMessage,
              JOBS_PAGE,
              MONITOR_WORKFLOWS_TAB,
              filtersStore
            )}
          />
        ) : (
          <>
            {params.workflowId ? (
              <Workflow
                actionsMenu={actionsMenu}
                backLink={backLink}
                handleCancel={handleCancel}
                handleConfirmTerminateWorkflow={handleConfirmTerminateWorkflow}
                itemIsSelected={itemIsSelected}
                pageData={pageData}
                selectedFunction={selectedFunction}
                selectedJob={selectedJob}
                setWorkflowsViewMode={setWorkflowsViewMode}
                workflow={workflowsStore.activeWorkflow?.data}
                workflowsViewMode={workflowsViewMode}
              />
            ) : (
              <Table
                actionsMenu={actionsMenu}
                handleCancel={handleCancel}
                pageData={pageData}
                selectedItem={selectedJob}
                tab={MONITOR_JOBS_TAB}
                tableClassName="monitor-workflows-table"
                tableHeaders={sortedTableContent[0]?.content ?? []}
                virtualizationConfig={virtualizationConfig}
              >
                {sortedTableContent.map(
                  (tableItem, index) =>
                    isRowRendered(virtualizationConfig, index) && (
                      <JobsTableRow
                        actionsMenu={actionsMenu}
                        key={index}
                        rowItem={tableItem}
                        selectedJob={selectedJob}
                      />
                    )
                )}
              </Table>
            )}
          </>
        )}
      </>
    )
  }
)

WorkflowsTable.displayName = 'WorkflowsTable'

WorkflowsTable.propTypes = {
  backLink: PropTypes.string.isRequired,
  context: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  filtersConfig: FILTERS_CONFIG.isRequired,
  getWorkflows: PropTypes.func.isRequired,
  itemIsSelected: PropTypes.bool.isRequired,
  requestErrorMessage: PropTypes.string.isRequired,
  selectedFunction: PropTypes.object.isRequired,
  selectedJob: PropTypes.object.isRequired,
  setItemIsSelected: PropTypes.func.isRequired,
  setSelectedFunction: PropTypes.func.isRequired,
  setSelectedJob: PropTypes.func.isRequired,
  setWorkflowIsLoaded: PropTypes.func.isRequired,
  tableContent: PropTypes.arrayOf(PropTypes.object),
  workflowIsLoaded: PropTypes.bool.isRequired
}

export default WorkflowsTable
