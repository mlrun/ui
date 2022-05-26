import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { find, isEmpty } from 'lodash'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { connect, useSelector } from 'react-redux'

import MonitorWorkflowsView from './MonitorWorkflowsView'

import { JobsContext } from '../Jobs'
import {
  GROUP_BY_NONE,
  GROUP_BY_WORKFLOW,
  JOBS_PAGE,
  MONITOR_JOBS_TAB,
  MONITOR_WORKFLOWS_TAB
} from '../../../constants'
import { DANGER_BUTTON } from 'igz-controls/constants'
import { actionCreator, handleAbortJob, monitorJob } from '../jobs.util'
import { parseJob } from '../../../utils/parseJob'
import { useYaml } from '../../../hooks/yaml.hook'
import { isDetailsTabExists } from '../../../utils/isDetailsTabExists'
import { getFunctionLogs } from '../../../utils/getFunctionLogs'
import { rerunJob } from '../jobs.util'
import { parseFunction } from '../../../utils/parseFunction'
import { generateActionsMenu, generateFilters, generatePageData } from './monitorWorkflows.util'
import { usePods } from '../../../hooks/usePods.hook'

const MonitorWorkflows = ({
  abortJob,
  fetchFunctionLogs,
  fetchJob,
  fetchJobFunction,
  fetchJobLogs,
  fetchJobs,
  fetchWorkflow,
  fetchWorkflows,
  getFunction,
  getFunctionWithHash,
  removeFunctionLogs,
  removeJobLogs,
  removeNewJob,
  resetWorkflow,
  setFilters,
  setNotification
}) => {
  const [selectedFunction, setSelectedFunction] = useState({})
  const [workflowsViewMode, setWorkflowsViewMode] = useState('graph')
  const [dataIsLoaded, setDataIsLoaded] = useState(false)
  const [itemIsSelected, setItemIsSelected] = useState(false)
  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState({})
  const [convertedYaml, toggleConvertedYaml] = useYaml('')
  const [editableItem, setEditableItem] = useState(null)
  const appStore = useSelector(store => store.appStore)
  const workflowsStore = useSelector(state => state.workflowsStore)
  const filtersStore = useSelector(state => state.filtersStore)
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { setConfirmData } = React.useContext(JobsContext)
  let fetchFunctionLogsTimeout = useRef(null)

  usePods()

  const filters = useMemo(() => generateFilters(), [])

  const handleFetchFunctionLogs = useCallback(
    (projectName, name, tag, offset) => {
      return getFunctionLogs(
        fetchFunctionLogs,
        fetchFunctionLogsTimeout,
        projectName,
        name,
        tag,
        offset
      )
    },
    [fetchFunctionLogs, fetchFunctionLogsTimeout]
  )

  const handleRemoveFunctionLogs = useCallback(() => {
    clearTimeout(fetchFunctionLogsTimeout.current)
    removeFunctionLogs()
  }, [fetchFunctionLogsTimeout, removeFunctionLogs])

  const pageData = useMemo(
    () =>
      generatePageData(
        selectedFunction,
        handleFetchFunctionLogs,
        fetchJobLogs,
        handleRemoveFunctionLogs,
        removeJobLogs
      ),
    [
      fetchJobLogs,
      handleFetchFunctionLogs,
      handleRemoveFunctionLogs,
      removeJobLogs,
      selectedFunction
    ]
  )

  const refreshJobs = useCallback(
    filters => {
      fetchJobs(params.projectName, filters, false)
        .then(jobs => {
          const parsedJobs = jobs.map(job => parseJob(job, MONITOR_JOBS_TAB))

          setJobs(parsedJobs)
        })
        .catch(error => {
          setNotification({
            status: error?.response?.status || 400,
            id: Math.random(),
            message: 'Failed to fetch jobs',
            retry: () => refreshJobs(filters)
          })
        })
    },
    [fetchJobs, params.projectName, setNotification]
  )

  const handleRerunJob = useCallback(
    async job => {
      await rerunJob(job, fetchJobFunction, setNotification, setEditableItem)
    },
    [fetchJobFunction, setNotification]
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
        setConfirmData
      )
    },
    [abortJob, filtersStore, params.projectName, refreshJobs, setConfirmData, setNotification]
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

  const handleMonitoring = useCallback(
    item => {
      monitorJob(appStore.frontendSpec.jobs_dashboard_url, item, params.projectName)
    },
    [appStore.frontendSpec.jobs_dashboard_url, params.projectName]
  )

  const handleCatchRequest = useCallback(
    (error, message) => {
      setNotification({
        status: error?.response?.status || 400,
        id: Math.random(),
        message
      })
      navigate(
        location.pathname
          .split('/')
          .splice(0, location.pathname.split('/').indexOf(params.workflowId) + 1)
          .join('/')
      )
    },
    [location.pathname, navigate, params.workflowId, setNotification]
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
        navigate(`/projects/${params.projectName}/jobs/${MONITOR_JOBS_TAB}`, { replace: true })
      )
  }, [fetchJob, navigate, params.jobId, params.projectName])

  const handleSuccessRerunJob = useCallback(
    tab => {
      if (tab === MONITOR_JOBS_TAB) {
        refreshJobs(filtersStore)
      }

      setEditableItem(null)
      setNotification({
        status: 200,
        id: Math.random(),
        message: 'Job started successfully'
      })
    },
    [filtersStore, refreshJobs, setNotification]
  )

  const getWorkflows = useCallback(
    filter => {
      fetchWorkflows(params.projectName, filter)
    },
    [fetchWorkflows, params.projectName]
  )

  useEffect(() => {
    if (params.jobId && pageData.details.menu.length > 0) {
      isDetailsTabExists(JOBS_PAGE, params, pageData.details.menu, navigate, location)
    }
  }, [navigate, pageData.details.menu, params, location])

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
      refreshJobs({ iter: 'false' })
    }
  }, [params.workflowId, refreshJobs])

  useEffect(() => {
    if (params.workflowId) {
      setFilters({ groupBy: GROUP_BY_NONE })
    } else {
      getWorkflows()
      setFilters({ groupBy: GROUP_BY_WORKFLOW })
    }
  }, [getWorkflows, params.workflowId, setFilters, params.projectName])

  useEffect(() => {
    return () => {
      setDataIsLoaded(false)
      setJobs([])
      setItemIsSelected(false)
      setSelectedJob({})
      setSelectedFunction({})
    }
  }, [params.projectName, params.workflowId])

  return (
    <MonitorWorkflowsView
      actionsMenu={actionsMenu}
      convertedYaml={convertedYaml}
      editableItem={editableItem}
      filters={filters}
      filtersStore={filtersStore}
      getWorkflows={getWorkflows}
      jobs={jobs}
      handleCancel={handleCancel}
      handleSelectJob={handleSelectJob}
      handleSuccessRerunJob={handleSuccessRerunJob}
      itemIsSelected={itemIsSelected}
      pageData={pageData}
      refreshJobs={refreshJobs}
      removeNewJob={removeNewJob}
      selectedFunction={selectedFunction}
      selectedJob={selectedJob}
      setEditableItem={setEditableItem}
      setWorkflowsViewMode={setWorkflowsViewMode}
      toggleConvertedYaml={toggleConvertedYaml}
      workflowsStore={workflowsStore}
      workflowsViewMode={workflowsViewMode}
    />
  )
}

MonitorWorkflows.propTypes = {}

export default connect(null, {
  ...actionCreator
})(React.memo(MonitorWorkflows))
