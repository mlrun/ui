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

import FilterMenu from '../../FilterMenu/FilterMenu'
import JobWizard from '../../JobWizard/JobWizard'
import JobsPanel from '../../JobsPanel/JobsPanel'
import JobsTableRow from '../../../elements/JobsTableRow/JobsTableRow'
import NoData from '../../../common/NoData/NoData'
import Table from '../../Table/Table'
import Workflow from '../../Workflow/Workflow'
import YamlModal from '../../../common/YamlModal/YamlModal'

import {
  GROUP_BY_NONE,
  GROUP_BY_WORKFLOW,
  JOBS_PAGE,
  MONITOR_JOBS_TAB,
  MONITOR_WORKFLOWS_TAB,
  PANEL_EDIT_MODE,
  PANEL_RERUN_MODE,
  WORKFLOW_GRAPH_VIEW
} from '../../../constants'
import {
  generateActionsMenu,
  generateFilters,
  generatePageData,
  monitorWorkflowsActionCreator
} from './monitorWorkflows.util'
import { DANGER_BUTTON } from 'igz-controls/constants'
import { JobsContext } from '../Jobs'
import { createJobsWorkflowsTabContent } from '../../../utils/createJobsContent'
import { getFunctionLogs } from '../../../utils/getFunctionLogs'
import { getNoDataMessage } from '../../../utils/getNoDataMessage'
import { handleAbortJob } from '../jobs.util'
import { isDetailsTabExists } from '../../../utils/isDetailsTabExists'
import { getJobLogs } from '../../../utils/getJobLogs.util'
import { openPopUp } from 'igz-controls/utils/common.util'
import { parseFunction } from '../../../utils/parseFunction'
import { parseJob } from '../../../utils/parseJob'
import { setFilters } from '../../../reducers/filtersReducer'
import { setNotification } from '../../../reducers/notificationReducer'
import { useMode } from '../../../hooks/mode.hook'
import { usePods } from '../../../hooks/usePods.hook'
import { useYaml } from '../../../hooks/yaml.hook'
import { useSortTable } from '../../../hooks/useSortTable.hook'

const MonitorWorkflows = ({
  abortJob,
  fetchFunctionLogs,
  fetchJob,
  fetchJobLogs,
  fetchJobPods,
  fetchWorkflow,
  fetchWorkflows,
  getFunction,
  getFunctionWithHash,
  removeFunctionLogs,
  removePods,
  removeNewJob,
  resetWorkflow
}) => {
  const [selectedFunction, setSelectedFunction] = useState({})
  const [workflowsViewMode, setWorkflowsViewMode] = useState(WORKFLOW_GRAPH_VIEW)
  const [dataIsLoaded, setDataIsLoaded] = useState(false)
  const [itemIsSelected, setItemIsSelected] = useState(false)
  const [selectedJob, setSelectedJob] = useState({})
  const [convertedYaml, toggleConvertedYaml] = useYaml('')
  const { isDemoMode } = useMode()
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
  let fetchFunctionLogsTimeout = useRef(null)

  usePods(fetchJobPods, removePods, selectedJob)

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
    (item, projectName, setDetailsLogs, offset) => {
      return getFunctionLogs(
        fetchFunctionLogs,
        fetchFunctionLogsTimeout,
        projectName,
        item.name,
        item.tag,
        setDetailsLogs,
        offset
      )
    },
    [fetchFunctionLogs, fetchFunctionLogsTimeout]
  )

  const handleFetchJobLogs = useCallback(
    (item, projectName, setDetailsLogs, streamLogsRef) => {
      return getJobLogs(item.uid, projectName, streamLogsRef, setDetailsLogs, fetchJobLogs)
    },
    [fetchJobLogs]
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
        handleRemoveFunctionLogs
      ),
    [handleFetchJobLogs, handleFetchFunctionLogs, handleRemoveFunctionLogs, selectedFunction]
  )

  const refreshJobs = useCallback(() => {
    fetchWorkflow(params.workflowId)
  }, [fetchWorkflow, params.workflowId])

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

  const handleCatchRequest = useCallback(
    (error, message) => {
      dispatch(
        setNotification({
          status: error?.response?.status || 400,
          id: Math.random(),
          message
        })
      )
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
        setSelectedFunction({})
        setItemIsSelected(true)
      }
    },
    [params.jobName]
  )

  const handleCancel = () => {
    setSelectedJob({})
    setSelectedFunction({})
    setItemIsSelected(false)
  }

  const fetchCurrentJob = useCallback(() => {
    return fetchJob(params.projectName, params.jobId)
      .then(job => {
        setSelectedJob(parseJob(job))
        setItemIsSelected(true)

        return job
      })
      .catch(() =>
        navigate(`/projects/${params.projectName}/jobs/${MONITOR_WORKFLOWS_TAB}`, { replace: true })
      )
  }, [fetchJob, navigate, params.jobId, params.projectName])

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

  const getWorkflows = useCallback(
    filter => {
      fetchWorkflows(params.projectName, filter)
    },
    [fetchWorkflows, params.projectName]
  )

  useEffect(() => {
    if ((params.jobId || params.functionHash) && pageData.details.menu.length > 0) {
      isDetailsTabExists(params.tab, pageData.details.menu, navigate, location)
    }
  }, [navigate, pageData.details.menu, location, params.jobId, params.functionHash, params.tab])

  useEffect(() => {
    const workflow = { ...workflowsStore.activeWorkflow.data }
    const getWorkflow = () => {
      fetchWorkflow(params.workflowId).catch(() =>
        navigate(`/projects/${params.projectName}/jobs/${MONITOR_WORKFLOWS_TAB}`, { replace: true })
      )
    }

    if (!params.workflowId && workflow.graph) {
      resetWorkflow()
    }

    if (!workflow.graph && params.workflowId && !dataIsLoaded) {
      getWorkflow()
      setDataIsLoaded(true)
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
    dataIsLoaded,
    fetchWorkflow,
    navigate,
    params.projectName,
    params.workflowId,
    resetWorkflow,
    workflowsStore.activeWorkflow
  ])

  useEffect(() => {
    if (params.jobId && (isEmpty(selectedJob) || params.jobId !== selectedJob.uid)) {
      fetchCurrentJob().then(() => {
        if (!isEmpty(selectedFunction)) {
          setSelectedFunction({})
        }
      })
    }
  }, [fetchCurrentJob, params.jobId, selectedFunction, selectedJob])

  useEffect(() => {
    const workflow = { ...workflowsStore.activeWorkflow.data }

    if (
      workflow.graph &&
      params.functionHash &&
      (isEmpty(selectedFunction) || params.functionHash !== selectedFunction.hash)
    ) {
      const selectedWorkflowFunction = find(workflow.graph, workflowItem => {
        return (
          workflowItem.function?.includes(`${params.functionName}@${params.functionHash}`) ||
          workflowItem.function?.includes(params.functionName)
        )
      })
      const customFunctionState = selectedWorkflowFunction?.phase?.toLowerCase()

      if (params.functionHash === 'latest' && params.functionName !== selectedFunction.name) {
        getFunction(params.projectName, params.functionName)
          .then(func => {
            setSelectedFunction(parseFunction(func, params.projectName, customFunctionState))
            setItemIsSelected(true)
            setSelectedJob({})
          })
          .catch(error => handleCatchRequest(error, 'Failed to fetch function'))
      } else if (params.functionName !== selectedFunction.name) {
        getFunctionWithHash(params.projectName, params.functionName, params.functionHash)
          .then(func => {
            setSelectedFunction(parseFunction(func, params.projectName, customFunctionState))
            setItemIsSelected(true)
            setSelectedJob({})
          })
          .catch(error => handleCatchRequest(error, 'Failed to fetch function'))
      }
    }
  }, [
    getFunction,
    getFunctionWithHash,
    handleCatchRequest,
    params.functionHash,
    params.functionName,
    params.projectName,
    selectedFunction,
    workflowsStore.activeWorkflow
  ])

  useEffect(() => {
    if (!params.functionHash && !params.jobId) {
      setItemIsSelected(false)
      setSelectedJob({})
      setSelectedFunction({})
    }
  }, [params.functionHash, params.jobId])

  useEffect(() => {
    if (params.workflowId) {
      dispatch(setFilters({ groupBy: GROUP_BY_NONE }))
    } else {
      getWorkflows()
      dispatch(setFilters({ groupBy: GROUP_BY_WORKFLOW }))
    }
  }, [dispatch, getWorkflows, params.workflowId, params.projectName])

  useEffect(() => {
    return () => {
      setDataIsLoaded(false)
      setItemIsSelected(false)
      setSelectedJob({})
      setSelectedFunction({})
    }
  }, [params.projectName, params.workflowId])

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
        mode: jobWizardMode
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

  return (
    <>
      {!params.workflowId && (
        <div className="content__action-bar">
          <FilterMenu
            filters={filters}
            onChange={getWorkflows}
            page={JOBS_PAGE}
            withoutExpandButton
          />
        </div>
      )}
      {workflowsStore.workflows.loading ? null : !params.workflowId &&
        workflowsStore.workflows.data.length === 0 ? (
        <NoData
          message={getNoDataMessage(filtersStore, filters, JOBS_PAGE, MONITOR_WORKFLOWS_TAB)}
        />
      ) : (
        <>
          {params.workflowId ? (
            <Workflow
              actionsMenu={actionsMenu}
              handleCancel={handleCancel}
              handleSelectItem={handleSelectJob}
              itemIsSelected={itemIsSelected}
              pageData={pageData}
              refresh={getWorkflows}
              refreshJobs={refreshJobs}
              selectedFunction={selectedFunction}
              selectedJob={selectedJob}
              setWorkflowsViewMode={setWorkflowsViewMode}
              workflow={workflowsStore.activeWorkflow.data}
              workflowsViewMode={workflowsViewMode}
            />
          ) : (
            <Table
              actionsMenu={actionsMenu}
              content={workflowsStore.workflows.data}
              handleCancel={handleCancel}
              handleSelectItem={handleSelectJob}
              pageData={pageData}
              retryRequest={getWorkflows}
              selectedItem={selectedJob}
              tab={MONITOR_JOBS_TAB}
              tableHeaders={sortedTableContent[0]?.content ?? []}
            >
              {sortedTableContent.map((tableItem, index) => (
                <JobsTableRow
                  actionsMenu={actionsMenu}
                  handleSelectJob={handleSelectJob}
                  key={index}
                  rowItem={tableItem}
                  selectedJob={selectedJob}
                />
              ))}
            </Table>
          )}
        </>
      )}
      {convertedYaml.length > 0 && (
        <YamlModal convertedYaml={convertedYaml} toggleConvertToYaml={toggleConvertedYaml} />
      )}
      {editableItem && !isDemoMode && (
        // todo: delete when the job wizard is out of the demo mode
        <JobsPanel
          closePanel={() => {
            setEditableItem(null)
            removeNewJob()
          }}
          defaultData={editableItem?.rerun_object}
          mode={PANEL_EDIT_MODE}
          onSuccessRun={tab => {
            if (editableItem) {
              handleSuccessRerunJob(tab)
            }
          }}
          project={params.projectName}
        />
      )}
    </>
  )
}

MonitorWorkflows.propTypes = {}

export default connect(null, {
  ...monitorWorkflowsActionCreator
})(React.memo(MonitorWorkflows))
