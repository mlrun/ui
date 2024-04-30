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
import { find, isEmpty } from 'lodash'

import NoData from '../../common/NoData/NoData'
import Workflow from '../../components/Workflow/Workflow'
import Table from '../../components/Table/Table'
import JobsTableRow from '../JobsTableRow/JobsTableRow'
import YamlModal from '../../common/YamlModal/YamlModal'
import Loader from '../../common/Loader/Loader'
import JobWizard from '../../components/JobWizard/JobWizard'

import { getNoDataMessage } from '../../utils/getNoDataMessage'
import {
  JOB_KIND_JOB,
  JOBS_PAGE,
  MONITOR_JOBS_TAB,
  MONITOR_WORKFLOWS_TAB,
  PANEL_RERUN_MODE,
  WORKFLOW_GRAPH_VIEW
} from '../../constants'
import { isRowRendered, useVirtualization } from '../../hooks/useVirtualization.hook'
import {
  generateActionsMenu,
  generatePageData
} from '../../components/Jobs/MonitorWorkflows/monitorWorkflows.util'
import { handleDeleteJob, isJobKindLocal, pollAbortingJobs } from '../../components/Jobs/jobs.util'
import { DANGER_BUTTON } from 'igz-controls/constants'
import { setNotification } from '../../reducers/notificationReducer'
import { enrichRunWithFunctionFields, handleAbortJob } from '../../utils/jobs.util'
import jobsActions from '../../actions/jobs'
import workflowsActions from '../../actions/workflow'
import { parseJob } from '../../utils/parseJob'
import getState from '../../utils/getState'
import { useYaml } from '../../hooks/yaml.hook'
import { getFunctionLogs } from '../../utils/getFunctionLogs'
import { getJobLogs } from '../../utils/getJobLogs.util'
import cssVariables from '../../components/Jobs/MonitorWorkflows/monitorWorkflows.scss'
import { isWorkflowStepExecutable } from '../../components/Workflow/workflow.util'
import { parseFunction } from '../../utils/parseFunction'
import functionsActions from '../../actions/functions'
import { showErrorNotification } from '../../utils/notifications.util'
import { isDetailsTabExists } from '../../utils/isDetailsTabExists'
import { openPopUp } from 'igz-controls/utils/common.util'
import { useSortTable } from '../../hooks/useSortTable.hook'
import PropTypes from 'prop-types'

const WorkflowsTable = React.forwardRef(
  (
    {
      backLink,
      context,
      fetchFunctionLogs,
      filters,
      getWorkflows,
      itemIsSelected,
      largeRequestErrorMessage,
      selectedFunction,
      selectedJob,
      setItemIsSelected,
      setSelectedFunction,
      setSelectedJob,
      setWorkflowIsLoaded,
      tableContent,
      workflowIsLoaded
    },
    abortJobRef
  ) => {
    const [convertedYaml, toggleConvertedYaml] = useYaml('')
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
    const tableBodyRef = useRef(null)
    const tableRef = useRef(null)

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
      sortConfig: { defaultSortBy: 'startedAt' }
    })

    const handleFetchFunctionLogs = useCallback(
      (item, projectName, setDetailsLogs) => {
        return getFunctionLogs(
          fetchFunctionLogs,
          fetchFunctionLogsTimeout,
          projectName,
          item.name,
          item.tag,
          setDetailsLogs
        )
      },
      [fetchFunctionLogs, fetchFunctionLogsTimeout]
    )

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
          selectedJob?.labels
        ),
      [
        handleFetchJobLogs,
        handleFetchFunctionLogs,
        handleRemoveFunctionLogs,
        selectedFunction,
        selectedJob
      ]
    )

    const refreshJobs = useCallback(() => {
      dispatch(
        workflowsActions.fetchWorkflow(
          params.workflowProjectName || params.projectName,
          params.workflowId
        )
      )
    }, [dispatch, params.projectName, params.workflowId, params.workflowProjectName])

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
        return enrichRunWithFunctionFields(
          dispatch,
          jobRun,
          jobsActions.fetchJobFunctions,
          fetchJobFunctionsPromiseRef
        ).then(jobRun => {
          setSelectedJob(jobRun)
          setSelectedFunction({})
          setItemIsSelected(true)

          if (refresh) {
            handlePollAbortingJob(jobRun, refresh)
          }
        })
      },
      [dispatch, handlePollAbortingJob, setItemIsSelected, setSelectedFunction, setSelectedJob]
    )

    const fetchRun = useCallback(() => {
      return dispatch(
        jobsActions.fetchJob(params.workflowProjectName || params.projectName, params.jobId)
      )
        .then(job => modifyAndSelectRun(parseJob(job), fetchRun))
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
      modifyAndSelectRun,
      navigate,
      params.jobId,
      params.projectName,
      params.workflowProjectName
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
          refreshJobs()
          fetchRun()
        }

        handleAbortJob(
          jobsActions.abortJob,
          job,
          setNotification,
          refresh,
          setConfirmData,
          dispatch,
          abortJobRef,
          setJobStatusAborting
        )
      },
      [abortJobRef, dispatch, fetchRun, refreshJobs, setConfirmData, setJobStatusAborting]
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
            setConfirmData(null)
          }
        })
      },
      [onAbortJob, setConfirmData]
    )

    const onDeleteJob = useCallback(
      job => {
        handleDeleteJob(jobsActions.deleteJob, job, refreshJobs, filtersStore, dispatch).then(
          () => {
            //check
            navigate(
              location.pathname
                .split('/')
                .splice(0, location.pathname.split('/').indexOf(params.workflowId) + 1)
                .join('/')
            )
          }
        )
      },
      [dispatch, filtersStore, location.pathname, navigate, params.workflowId, refreshJobs]
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
          handleConfirmDeleteJob,
          toggleConvertedYaml
        )
    }, [
      handleRerunJob,
      appStore.frontendSpec.jobs_dashboard_url,
      appStore.frontendSpec.abortable_function_kinds,
      handleMonitoring,
      handleConfirmAbortJob,
      handleConfirmDeleteJob,
      toggleConvertedYaml
    ])

    const handleCancel = useCallback(() => {
      setSelectedJob({})
      setSelectedFunction({})
      setItemIsSelected(false)
    }, [setItemIsSelected, setSelectedFunction, setSelectedJob])

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

    const findSelectedWorkflowFunction = useCallback(() => {
      if (workflowsStore.activeWorkflow?.data) {
        const workflow = { ...workflowsStore.activeWorkflow.data }

        return find(workflow.graph, workflowItem => {
          return (
            workflowItem.function?.includes(`${params.functionName}@${params.functionHash}`) ||
            workflowItem.function?.includes(params.functionName) ||
            workflowItem.function?.includes(params.jobId)
          )
        })
      }
    }, [params.functionName, params.functionHash, params.jobId, workflowsStore.activeWorkflow.data])

    const checkIfWorkflowItemIsJob = useCallback(() => {
      if (workflowsStore.activeWorkflow?.data?.graph) {
        return !['deploy', 'build'].includes(findSelectedWorkflowFunction()?.run_type)
      }
    }, [workflowsStore.activeWorkflow.data.graph, findSelectedWorkflowFunction])

    const virtualizationConfig = useVirtualization({
      tableRef,
      tableBodyRef,
      rowsData: {
        content: tableContent
      },
      heightData: {
        headerRowHeight: cssVariables.monitorWorkflowsHeaderRowHeight,
        rowHeight: cssVariables.monitorWorkflowsRowHeight,
        rowHeightExtended: cssVariables.monitorWorkflowsRowHeightExtended
      }
    })

    const handleCatchRequest = useCallback(
      (error, message) => {
        showErrorNotification(dispatch, error, message, '')
        navigate(
          location.pathname
            .split('/')
            .splice(0, location.pathname.split('/').indexOf(params.workflowId) + 1)
            .join('/')
        )
      },
      [dispatch, location.pathname, navigate, params.workflowId]
    )

    useEffect(() => {
      if (
        !fetchJobFunctionsPromiseRef.current &&
        params.jobId &&
        (isEmpty(selectedJob) || params.jobId !== selectedJob.uid) &&
        checkIfWorkflowItemIsJob()
      ) {
        fetchRun()
      }
    }, [fetchRun, params.jobId, selectedJob, checkIfWorkflowItemIsJob])

    useEffect(() => {
      const functionToBeSelected = findSelectedWorkflowFunction()

      if (isWorkflowStepExecutable(functionToBeSelected)) {
        const workflow = { ...workflowsStore.activeWorkflow?.data }

        if (
          workflow.graph &&
          params.functionHash &&
          (isEmpty(selectedFunction) || params.functionHash !== selectedFunction.hash)
        ) {
          const customFunctionState = functionToBeSelected?.phase?.toLowerCase()

          if (params.functionName !== selectedFunction.name) {
            dispatch(
              functionsActions.getFunction(
                params.workflowProjectName || params.projectName,
                params.functionName,
                params.functionHash === 'latest' ? '' : params.functionHash
              )
            )
              .then(func => {
                setSelectedFunction(
                  parseFunction(
                    func,
                    params.workflowProjectName || params.projectName,
                    customFunctionState
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
          isEmpty(selectedFunction) &&
          !checkIfWorkflowItemIsJob()
        ) {
          const customFunctionState = functionToBeSelected?.phase?.toLowerCase()

          dispatch(
            functionsActions.getFunction(
              params.workflowProjectName || params.projectName,
              params.jobId
            )
          )
            .then(func => {
              setSelectedFunction(
                parseFunction(
                  func,
                  params.workflowProjectName || params.projectName,
                  customFunctionState
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
      params.workflowProjectName
    ])

    useEffect(() => {
      if ((params.jobId || params.functionHash) && pageData.details.menu.length > 0) {
        isDetailsTabExists(params.tab, pageData.details.menu, navigate, location)
      }
    }, [navigate, pageData.details.menu, location, params.jobId, params.functionHash, params.tab])

    useEffect(() => {
      const workflow = { ...workflowsStore.activeWorkflow?.data }
      const getWorkflow = () => {
        dispatch(
          workflowsActions.fetchWorkflow(
            params.workflowProjectName || params.projectName,
            params.workflowId
          )
        ).catch(error => {
          showErrorNotification(dispatch, error, 'Failed to fetch workflow')
          navigate(backLink, {
            replace: true
          })
        })
      }

      if (!params.workflowId && workflow.graph) {
        dispatch(workflowsActions.resetWorkflow())
      }

      if (!workflow.graph && params.workflowId && !workflowIsLoaded) {
        getWorkflow()
        setWorkflowIsLoaded(true)
      }

      if (
        ['Running', 'None'].includes(workflow?.run?.status) &&
        params.workflowId &&
        workflow.graph
      ) {
        const timeout = setTimeout(getWorkflow, 10000)

        return () => clearTimeout(timeout)
      }
    }, [
      dispatch,
      workflowIsLoaded,
      navigate,
      params.projectName,
      params.workflowId,
      workflowsStore.activeWorkflow,
      setWorkflowIsLoaded,
      params.workflowProjectName,
      backLink
    ])

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
          wizardTitle: jobWizardMode === PANEL_RERUN_MODE ? 'Batch re-run' : undefined
        })

        setJobWizardIsOpened(true)
      }
    }, [
      editableItem?.rerun_object,
      filtersStore,
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

    return (
      <>
        {workflowsStore.workflows.loading && <Loader />}
        {(!workflowsStore.workflows.loading &&
          !params.workflowId &&
          workflowsStore.workflows.data.length === 0) ||
        largeRequestErrorMessage ? (
          <NoData
            message={getNoDataMessage(
              filtersStore,
              filters,
              largeRequestErrorMessage,
              JOBS_PAGE,
              MONITOR_WORKFLOWS_TAB
            )}
          />
        ) : (
          <>
            {params.workflowId ? (
              <Workflow
                actionsMenu={actionsMenu}
                backLink={backLink}
                handleCancel={handleCancel}
                handleSelectItem={handleSelectRun}
                itemIsSelected={itemIsSelected}
                pageData={pageData}
                refresh={getWorkflows}
                refreshJobs={refreshJobs}
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
                handleSelectItem={handleSelectRun}
                pageData={pageData}
                ref={{ tableRef, tableBodyRef }}
                retryRequest={getWorkflows}
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
                        handleSelectJob={handleSelectRun}
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
        {convertedYaml.length > 0 && (
          <YamlModal convertedYaml={convertedYaml} toggleConvertToYaml={toggleConvertedYaml} />
        )}
      </>
    )
  }
)

WorkflowsTable.propTypes = {
  backLink: PropTypes.string.isRequired,
  context: PropTypes.object.isRequired,
  fetchFunctionLogs: PropTypes.func.isRequired,
  filters: PropTypes.arrayOf(PropTypes.shape({})),
  getWorkflows: PropTypes.func.isRequired,
  itemIsSelected: PropTypes.bool.isRequired,
  largeRequestErrorMessage: PropTypes.string.isRequired,
  selectedFunction: PropTypes.object.isRequired,
  selectedJob: PropTypes.object.isRequired,
  setItemIsSelected: PropTypes.func.isRequired,
  setSelectedFunction: PropTypes.func.isRequired,
  setSelectedJob: PropTypes.func.isRequired,
  setWorkflowIsLoaded: PropTypes.func.isRequired,
  tableContent: PropTypes.arrayOf(PropTypes.shape({})),
  workflowIsLoaded: PropTypes.bool.isRequired
}

export default WorkflowsTable
