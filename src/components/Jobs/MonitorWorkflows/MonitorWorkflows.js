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
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { connect, useDispatch, useSelector } from 'react-redux'
import { find, isEmpty } from 'lodash'
import classnames from 'classnames'

import FilterMenu from '../../FilterMenu/FilterMenu'
import JobWizard from '../../JobWizard/JobWizard'
import JobsTableRow from '../../../elements/JobsTableRow/JobsTableRow'
import NoData from '../../../common/NoData/NoData'
import Table from '../../Table/Table'
import Workflow from '../../Workflow/Workflow'
import YamlModal from '../../../common/YamlModal/YamlModal'

import {
  GROUP_BY_NONE,
  GROUP_BY_WORKFLOW,
  JOB_KIND_JOB,
  JOBS_PAGE,
  MONITOR_JOBS_TAB,
  MONITOR_WORKFLOWS_TAB,
  PANEL_RERUN_MODE,
  REQUEST_CANCELED,
  STATE_FILTER_ALL_ITEMS,
  WORKFLOW_GRAPH_VIEW
} from '../../../constants'
import { DANGER_BUTTON } from 'igz-controls/constants'
import {
  generateActionsMenu,
  generateFilters,
  generatePageData,
  monitorWorkflowsActionCreator
} from './monitorWorkflows.util'
import { JobsContext } from '../Jobs'
import { createJobsWorkflowsTabContent } from '../../../utils/createJobsContent'
import {
  enrichRunWithFunctionFields,
  handleAbortJob,
  handleDeleteJob,
  isJobKindLocal,
  pollAbortingJobs
} from '../jobs.util'
import getState from '../../../utils/getState'
import { datePickerPastOptions, PAST_WEEK_DATE_OPTION } from '../../../utils/datePicker.util'
import { getFunctionLogs } from '../../../utils/getFunctionLogs'
import { getJobLogs } from '../../../utils/getJobLogs.util'
import { getNoDataMessage } from '../../../utils/getNoDataMessage'
import { isDetailsTabExists } from '../../../utils/isDetailsTabExists'
import { isRowRendered, useVirtualization } from '../../../hooks/useVirtualization.hook'
import { isWorkflowStepExecutable } from '../../Workflow/workflow.util'
import { openPopUp } from 'igz-controls/utils/common.util'
import { parseFunction } from '../../../utils/parseFunction'
import { parseJob } from '../../../utils/parseJob'
import { setFilters } from '../../../reducers/filtersReducer'
import { setNotification } from '../../../reducers/notificationReducer'
import { showErrorNotification } from '../../../utils/notifications.util'
import { useMode } from '../../../hooks/mode.hook'
import { usePods } from '../../../hooks/usePods.hook'
import { useSortTable } from '../../../hooks/useSortTable.hook'
import { useYaml } from '../../../hooks/yaml.hook'
import detailsActions from '../../../actions/details'
import jobsActions from '../../../actions/jobs'

import './monitorWorkflows.scss'
import cssVariables from './monitorWorkflows.scss'

const MonitorWorkflows = ({
  abortJob,
  deleteJob,
  deleteWorkflows,
  fetchFunctionLogs,
  fetchJob,
  fetchJobFunctions,
  fetchWorkflow,
  fetchWorkflows,
  getFunction,
  resetWorkflow
}) => {
  const [selectedFunction, setSelectedFunction] = useState({})
  const [workflowsViewMode, setWorkflowsViewMode] = useState(WORKFLOW_GRAPH_VIEW)
  const [workflowIsLoaded, setWorkflowIsLoaded] = useState(false)
  const [workflowsAreLoaded, setWorkflowsAreLoaded] = useState(false)
  const [itemIsSelected, setItemIsSelected] = useState(false)
  const [selectedJob, setSelectedJob] = useState({})
  const [largeRequestErrorMessage, setLargeRequestErrorMessage] = useState('')
  const [convertedYaml, toggleConvertedYaml] = useYaml('')
  const appStore = useSelector(store => store.appStore)
  const workflowsStore = useSelector(state => state.workflowsStore)
  const filtersStore = useSelector(state => state.filtersStore)
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { isStagingMode } = useMode()
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
  const abortControllerRef = useRef(new AbortController())
  const abortJobRef = useRef(null)
  const fetchJobFunctionsPromiseRef = useRef()
  const tableBodyRef = useRef(null)
  const tableRef = useRef(null)
  let fetchFunctionLogsTimeout = useRef(null)

  usePods(dispatch, detailsActions.fetchJobPods, detailsActions.removePods, selectedJob)

  const filters = useMemo(() => generateFilters(), [])

  const tableContent = useMemo(
    () =>
      createJobsWorkflowsTabContent(
        workflowsStore.workflows.data,
        params.projectName,
        isStagingMode,
        !isEmpty(selectedJob)
      ),
    [isStagingMode, params.projectName, selectedJob, workflowsStore.workflows.data]
  )

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

  const handlePollAbortingJob = useCallback(
    (jobRun, refresh) => {
      if (jobRun.abortTaskId && jobRun.state.value === 'aborting') {
        const abortingJob = {
          [jobRun.abortTaskId]: {
            uid: jobRun.uid,
            name: jobRun.name
          }
        }

        pollAbortingJobs(params.projectName, abortJobRef, abortingJob, refresh, dispatch)
      }
    },
    [dispatch, params.projectName]
  )

  const modifyAndSelectRun = useCallback(
    (jobRun, refresh) => {
      return enrichRunWithFunctionFields(
        dispatch,
        jobRun,
        fetchJobFunctions,
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
    [dispatch, fetchJobFunctions, handlePollAbortingJob]
  )

  const fetchRun = useCallback(() => {
    return fetchJob(params.projectName, params.jobId)
      .then(job => modifyAndSelectRun(parseJob(job), fetchRun))
      .catch(() =>
        navigate(`/projects/${params.projectName}/jobs/${MONITOR_WORKFLOWS_TAB}`, { replace: true })
      )
      .finally(() => {
        fetchJobFunctionsPromiseRef.current = null
      })
  }, [fetchJob, modifyAndSelectRun, navigate, params.jobId, params.projectName])

  const refreshJobs = useCallback(() => {
    fetchWorkflow(params.projectName, params.workflowId)
  }, [fetchWorkflow, params.projectName, params.workflowId])

  const setJobStatusAborting = useCallback(task => {
    setSelectedJob(state => ({
      ...state,
      abortTaskId: task,
      state: getState('aborting', JOBS_PAGE, JOB_KIND_JOB)
    }))
  }, [])

  const onAbortJob = useCallback(
    job => {
      handleAbortJob(
        abortJob,
        params.projectName,
        job,
        setNotification,
        () => {
          refreshJobs()
          fetchRun()
        },
        setConfirmData,
        dispatch,
        abortJobRef,
        setJobStatusAborting
      )
    },
    [
      abortJob,
      dispatch,
      fetchRun,
      params.projectName,
      refreshJobs,
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
          setConfirmData(null)
        }
      })
    },
    [onAbortJob, setConfirmData]
  )

  const getWorkflows = useCallback(
    filter => {
      abortControllerRef.current = new AbortController()

      fetchWorkflows(params.projectName, filter, {
        ui: {
          controller: abortControllerRef.current,
          setLargeRequestErrorMessage
        }
      })
    },
    [fetchWorkflows, params.projectName]
  )

  const onDeleteJob = useCallback(
    job => {
      handleDeleteJob(deleteJob, job, params.projectName, refreshJobs, filtersStore, dispatch).then(
        () => {
          navigate(
            location.pathname
              .split('/')
              .splice(0, location.pathname.split('/').indexOf(params.workflowId) + 1)
              .join('/')
          )
        }
      )
    },
    [
      deleteJob,
      dispatch,
      filtersStore,
      location.pathname,
      navigate,
      params.projectName,
      params.workflowId,
      refreshJobs
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

  const handleCancel = () => {
    setSelectedJob({})
    setSelectedFunction({})
    setItemIsSelected(false)
  }

  useEffect(() => {
    if ((params.jobId || params.functionHash) && pageData.details.menu.length > 0) {
      isDetailsTabExists(params.tab, pageData.details.menu, navigate, location)
    }
  }, [navigate, pageData.details.menu, location, params.jobId, params.functionHash, params.tab])

  useEffect(() => {
    const workflow = { ...workflowsStore.activeWorkflow?.data }
    const getWorkflow = () => {
      fetchWorkflow(params.projectName, params.workflowId).catch(error => {
        showErrorNotification(dispatch, error, 'Failed to fetch workflow')
        navigate(`/projects/${params.projectName}/jobs/${MONITOR_WORKFLOWS_TAB}`, { replace: true })
      })
    }

    if (!params.workflowId && workflow.graph) {
      resetWorkflow()
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
    fetchWorkflow,
    navigate,
    params.projectName,
    params.workflowId,
    resetWorkflow,
    workflowsStore.activeWorkflow
  ])

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

  useEffect(() => {
    if (
      !fetchJobFunctionsPromiseRef.current &&
      params.jobId &&
      (isEmpty(selectedJob) || params.jobId !== selectedJob.uid) &&
      checkIfWorkflowItemIsJob()
    ) {
      fetchRun()
    }
  }, [fetchRun, params.jobId, selectedFunction, selectedJob, checkIfWorkflowItemIsJob])

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
          getFunction(
            params.projectName,
            params.functionName,
            params.functionHash === 'latest' ? '' : params.functionHash
          )
            .then(func => {
              setSelectedFunction(parseFunction(func, params.projectName, customFunctionState))
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

        getFunction(params.projectName, params.jobId)
          .then(func => {
            setSelectedFunction(parseFunction(func, params.projectName, customFunctionState))
            setItemIsSelected(true)
            setSelectedJob({})
          })
          .catch(error => handleCatchRequest(error, 'Failed to fetch function'))
      }
    }
  }, [
    findSelectedWorkflowFunction,
    getFunction,
    handleCatchRequest,
    params.functionHash,
    params.functionName,
    params.projectName,
    selectedFunction,
    workflowsStore.activeWorkflow,
    checkIfWorkflowItemIsJob,
    params.jobId
  ])

  useEffect(() => {
    if (!params.functionHash && !params.jobId) {
      setItemIsSelected(false)
      setSelectedJob({})
      setSelectedFunction({})
    }
  }, [params.functionHash, params.jobId])

  useEffect(() => {
    if (!workflowsAreLoaded) {
      if (params.workflowId) {
        dispatch(setFilters({ groupBy: GROUP_BY_NONE }))
      } else {
        if (filtersStore.saveFilters) {
          const filters = {
            state: filtersStore.state,
            dates: filtersStore.dates,
            saveFilters: false,
            groupBy: GROUP_BY_WORKFLOW
          }

          getWorkflows(filters)
          dispatch(setFilters(filters))
        } else if (workflowsStore.workflows.data.length === 0) {
          const pastWeekOption = datePickerPastOptions.find(
            option => option.id === PAST_WEEK_DATE_OPTION
          )
          const generatedDates = [...pastWeekOption.handler()]

          if (generatedDates.length === 1) {
            generatedDates.push(new Date())
          }
          const filters = {
            dates: {
              value: generatedDates,
              isPredefined: pastWeekOption.isPredefined
            },
            state: STATE_FILTER_ALL_ITEMS,
            groupBy: GROUP_BY_WORKFLOW
          }

          dispatch(setFilters({ ...filters }))
          getWorkflows(filters)
        } else {
          getWorkflows({ ...filtersStore, groupBy: GROUP_BY_WORKFLOW })
          dispatch(setFilters({ groupBy: GROUP_BY_WORKFLOW }))
        }

        setWorkflowsAreLoaded(true)
      }
    }
  }, [
    dispatch,
    getWorkflows,
    params.workflowId,
    params.projectName,
    filtersStore,
    workflowsAreLoaded,
    workflowsStore.workflows.data.length
  ])

  useEffect(() => {
    return () => {
      setWorkflowIsLoaded(false)
      setWorkflowsAreLoaded(false)
      setItemIsSelected(false)
      setSelectedJob({})
      setSelectedFunction({})
      abortControllerRef.current.abort(REQUEST_CANCELED)
    }
  }, [params.projectName, params.workflowId])

  useEffect(() => {
    return () => {
      deleteWorkflows()
      setWorkflowsAreLoaded(false)
    }
  }, [deleteWorkflows])

  useEffect(() => {
    abortJobRef.current?.()
  }, [params.jobId])

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

  return (
    <>
      <div className="monitor-workflows">
        {
          !params.workflowId && (
            <p className="monitor-workflows__subtitle">
              View running workflows and previously executed workflows
            </p>
          )
        }
        <div className="content__action-bar-wrapper">
          <div className={classnames(!params.workflowId && 'action-bar')}>
            <FilterMenu
              filters={filters}
              onChange={getWorkflows}
              page={JOBS_PAGE}
              saveFilterOnProjectChange
              tab={MONITOR_WORKFLOWS_TAB}
              withoutExpandButton
              hidden={Boolean(params.workflowId)}
            />
          </div>
        </div>
      </div>
      {workflowsStore.workflows.loading ? null : (!params.workflowId &&
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

MonitorWorkflows.propTypes = {}

export default connect(null, {
  ...monitorWorkflowsActionCreator
})(React.memo(MonitorWorkflows))
