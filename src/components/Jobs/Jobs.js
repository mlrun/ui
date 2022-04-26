import React, { useCallback, useEffect, useRef, useMemo, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import { find, isEmpty, cloneDeep } from 'lodash'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import JobsView from './JobsView'

import { useMode } from '../../hooks/mode.hook'
import { useYaml } from '../../hooks/yaml.hook'
import { actionCreator, generateEditableItem, generatePageData } from './jobs.util'
import { isDetailsTabExists } from '../../utils/isDetailsTabExists'
import { datePickerOptions, PAST_WEEK_DATE_OPTION } from '../../utils/datePicker.util'
import {
  DANGER_BUTTON,
  GROUP_BY_NONE,
  GROUP_BY_WORKFLOW,
  JOBS_PAGE,
  MONITOR_JOBS_TAB,
  MONITOR_WORKFLOWS_TAB,
  SCHEDULE_TAB,
  STATUS_CODE_FORBIDDEN
} from '../../constants'
import { parseJob } from '../../utils/parseJob'
import { parseFunction } from '../../utils/parseFunction'
import { getFunctionLogs } from '../../utils/getFunctionLogs'
import { isPageTabValid } from '../../utils/handleRedirect'
import { generateContentActionsMenu } from '../../layout/Content/content.util'
import { getCloseDetailsLink } from '../../utils/getCloseDetailsLink'

import { ReactComponent as Yaml } from '../../images/yaml.svg'

const Jobs = ({
  abortJob,
  appStore,
  editJob,
  editJobFailure,
  fetchAllJobRuns,
  fetchFunctionLogs,
  fetchJob,
  fetchJobFunction,
  fetchJobLogs,
  fetchJobPods,
  fetchJobs,
  fetchScheduledJobAccessKey,
  fetchWorkflow,
  fetchWorkflows,
  filtersStore,
  functionsStore,
  getFunction,
  getFunctionWithHash,
  handleRunScheduledJob,
  jobsStore,
  removeFunctionLogs,
  removeJobLogs,
  removeNewJob,
  removePods,
  removeScheduledJob,
  resetWorkflow,
  setFilters,
  setNotification,
  workflowsStore
}) => {
  const [convertedYaml, toggleConvertedYaml] = useYaml('')
  const [jobs, setJobs] = useState([])
  const [confirmData, setConfirmData] = useState(null)
  const [editableItem, setEditableItem] = useState(null)
  const [selectedJob, setSelectedJob] = useState({})
  const [selectedFunction, setSelectedFunction] = useState({})
  const [workflowsViewMode, setWorkflowsViewMode] = useState('graph')
  const [dataIsLoaded, setDataIsLoaded] = useState(false)
  const [itemIsSelected, setItemIsSelected] = useState(false)
  const [jobRuns, setJobRuns] = useState([])
  const [dateFilter, setDateFilter] = useState(['', ''])
  const { isStagingMode } = useMode()
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const dispatch = useDispatch()
  let fetchFunctionLogsTimeout = useRef(null)

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

  const refreshJobs = useCallback(
    filters => {
      if (filters.dates) {
        setDateFilter(filters.dates.value)
      }
      const fetchData = params.jobName ? fetchAllJobRuns : fetchJobs
      fetchData(params.projectName, filters, params.jobName, params.pageTab === SCHEDULE_TAB)
        .then(jobs => {
          const parsedJobs = jobs.map(job => parseJob(job, params.pageTab))

          if (params.jobName) {
            setJobRuns(parsedJobs)
          } else {
            setJobs(parsedJobs)
          }
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
    [
      fetchAllJobRuns,
      fetchJobs,
      params.jobName,
      params.pageTab,
      params.projectName,
      setNotification
    ]
  )

  const handleRemoveFunctionLogs = useCallback(() => {
    clearTimeout(fetchFunctionLogsTimeout.current)
    removeFunctionLogs()
  }, [fetchFunctionLogsTimeout, removeFunctionLogs])

  const handleRemoveScheduledJob = useCallback(
    schedule => {
      removeScheduledJob(params.projectName, schedule.name).then(() => {
        refreshJobs(filtersStore)
      })

      setConfirmData(null)
    },
    [filtersStore, params.projectName, refreshJobs, removeScheduledJob]
  )

  const handleMonitoring = useCallback(
    item => {
      let redirectUrl = appStore.frontendSpec.jobs_dashboard_url
        .replace('{filter_name}', item ? 'uid' : 'project')
        .replace('{filter_value}', item ? item.uid : params.projectName)

      window.open(redirectUrl, '_blank')
    },
    [appStore.frontendSpec.jobs_dashboard_url, params.projectName]
  )

  const handleRunJob = useCallback(
    job => {
      handleRunScheduledJob(
        {
          ...job.scheduled_object
        },
        params.projectName,
        job.name
      )
        .then(response => {
          setNotification({
            status: response.status,
            id: Math.random(),
            message: 'Job started successfully'
          })
        })
        .catch(error => {
          setNotification({
            status: 400,
            id: Math.random(),
            retry: item => handleRunJob(item),
            message:
              error.response.status === STATUS_CODE_FORBIDDEN
                ? 'You are not permitted to run new job.'
                : 'Job failed to start.'
          })
        })
    },
    [handleRunScheduledJob, params.projectName, setNotification]
  )

  const handleSuccessRerunJob = tab => {
    if (tab === params.pageTab) {
      refreshJobs(filtersStore)
    }

    setEditableItem(null)
    setNotification({
      status: 200,
      id: Math.random(),
      message: 'Job started successfully'
    })
  }

  const onRemoveScheduledJob = useCallback(
    scheduledJob => {
      setConfirmData({
        item: scheduledJob,
        header: 'Delete scheduled job?',
        message: `You try to delete scheduled job "${scheduledJob.name}". Deleted scheduled jobs can not be restored.`,
        btnConfirmLabel: 'Delete',
        btnConfirmType: DANGER_BUTTON,
        rejectHandler: () => {
          setConfirmData(null)
        },
        confirmHandler: () => {
          handleRemoveScheduledJob(scheduledJob)
        }
      })
    },
    [handleRemoveScheduledJob]
  )

  const handleActionsMenuClick = () => {
    navigate(`/projects/${params.projectName}/jobs/${params.pageTab}/create-new-job`)
  }

  const handleRerunJob = useCallback(
    async job => {
      const [project = '', func = ''] = job?.function?.split('/') ?? []
      const functionData = await fetchJobFunction(
        project,
        func.replace(/@.*$/g, ''),
        func.replace(/.*@/g, '')
      )

      if (!functionData) {
        setNotification({
          status: 400,
          id: Math.random(),
          message: 'Job’s function failed to load'
        })
      }

      setEditableItem(generateEditableItem(functionData, job))
    },
    [fetchJobFunction, setNotification]
  )

  const handleAbortJob = useCallback(
    job => {
      abortJob(params.projectName, job)
        .then(() => {
          refreshJobs(filtersStore)
          setNotification({
            status: 200,
            id: Math.random(),
            message: 'Job is successfully aborted'
          })
        })
        .catch(() => {
          setNotification({
            status: 400,
            id: Math.random(),
            retry: () => handleAbortJob(job),
            message: 'Aborting job failed'
          })
        })
      setConfirmData(null)
    },
    [abortJob, filtersStore, params.projectName, refreshJobs, setNotification]
  )

  const onAbortJob = useCallback(
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
          handleAbortJob(job)
        }
      })
    },
    [handleAbortJob]
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

  const handleEditScheduleJob = useCallback(
    editableItem => {
      fetchScheduledJobAccessKey(params.projectName, editableItem.name)
        .then(result => {
          setEditableItem({
            ...editableItem,
            scheduled_object: {
              ...editableItem.scheduled_object,
              credentials: {
                access_key: result.data.credentials.access_key
              }
            }
          })
        })
        .catch(() => {
          setNotification({
            status: 400,
            id: Math.random(),
            retry: () => handleEditScheduleJob(editableItem),
            message: 'Failed to fetch job access key'
          })
        })
    },
    [fetchScheduledJobAccessKey, params.projectName, setNotification]
  )

  const pageData = useMemo(
    () =>
      generatePageData(
        params.pageTab,
        isStagingMode,
        onRemoveScheduledJob,
        handleRunJob,
        handleEditScheduleJob,
        handleRerunJob,
        handleMonitoring,
        appStore.frontendSpec.jobs_dashboard_url,
        onAbortJob,
        appStore.frontendSpec.abortable_function_kinds,
        fetchJobLogs,
        removeJobLogs,
        !isEmpty(selectedJob),
        params.workflowId,
        selectedFunction,
        handleFetchFunctionLogs,
        handleRemoveFunctionLogs,
        params.jobName
      ),
    [
      params.pageTab,
      params.workflowId,
      params.jobName,
      isStagingMode,
      onRemoveScheduledJob,
      handleRunJob,
      handleEditScheduleJob,
      handleRerunJob,
      handleMonitoring,
      appStore.frontendSpec.jobs_dashboard_url,
      appStore.frontendSpec.abortable_function_kinds,
      onAbortJob,
      fetchJobLogs,
      removeJobLogs,
      selectedJob,
      selectedFunction,
      handleFetchFunctionLogs,
      handleRemoveFunctionLogs
    ]
  )

  const actionsMenu = useMemo(() => {
    return generateContentActionsMenu(pageData.actionsMenu, [
      {
        label: 'View YAML',
        icon: <Yaml />,
        onClick: toggleConvertedYaml
      }
    ])
  }, [pageData.actionsMenu, toggleConvertedYaml])

  const fetchCurrentJob = useCallback(() => {
    return fetchJob(params.projectName, params.jobId)
      .then(job => {
        setSelectedJob(parseJob(job))
        setItemIsSelected(true)

        return job
      })
      .catch(() =>
        navigate(`/projects/${params.projectName}/jobs/${params.pageTab}`, { replace: true })
      )
  }, [fetchJob, navigate, params.jobId, params.pageTab, params.projectName])

  const isJobDataEmpty = useCallback(
    () => jobs.length === 0 && ((!params.jobName && jobRuns.length === 0) || params.jobName),
    [jobRuns.length, jobs.length, params.jobName]
  )

  useEffect(() => {
    if (
      !isEmpty(selectedJob) &&
      [MONITOR_JOBS_TAB, MONITOR_WORKFLOWS_TAB].includes(params.pageTab)
    ) {
      fetchJobPods(params.projectName, selectedJob.uid)

      const interval = setInterval(() => {
        fetchJobPods(params.projectName, selectedJob.uid)
      }, 30000)

      return () => {
        removePods()
        clearInterval(interval)
      }
    }
  }, [fetchJobPods, params.pageTab, params.projectName, removePods, selectedJob])

  useEffect(() => {
    if (params.jobId && pageData.details.menu.length > 0) {
      isDetailsTabExists(JOBS_PAGE, params, pageData.details.menu, navigate, location)
    }
  }, [navigate, pageData.details.menu, params, location])

  useEffect(() => {
    isPageTabValid(
      params.pageTab,
      pageData.tabs.map(tab => tab.id),
      navigate,
      location
    )
  }, [navigate, pageData.tabs, params.pageTab, location])

  useEffect(() => {
    const workflow = { ...workflowsStore.activeWorkflow.data }
    const getWorkflow = () => {
      fetchWorkflow(params.workflowId).catch(() =>
        navigate(`/projects/${params.projectName}/jobs/${params.pageTab}`, { replace: true })
      )
    }

    if (!params.workflowId && workflow.graph) {
      resetWorkflow()
    }

    if (!workflow.graph && params.workflowId) {
      getWorkflow()
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
    fetchWorkflow,
    navigate,
    params.pageTab,
    params.projectName,
    params.workflowId,
    resetWorkflow,
    workflowsStore.activeWorkflow
  ])

  useEffect(() => {
    if (params.jobId && (isEmpty(selectedJob) || params.jobId !== selectedJob.uid)) {
      fetchCurrentJob().then(() => setSelectedFunction({}))
    }
  }, [fetchCurrentJob, params.jobId, selectedJob])

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
    if (
      ((isEmpty(selectedJob) && !params.jobId && !params.workflowId) ||
        workflowsViewMode === 'list') &&
      !dataIsLoaded
    ) {
      let filters = {}

      if (params.pageTab === MONITOR_JOBS_TAB && isJobDataEmpty()) {
        const pastWeekOption = datePickerOptions.find(option => option.id === PAST_WEEK_DATE_OPTION)

        filters = {
          dates: {
            value: pastWeekOption.handler(),
            isPredefined: pastWeekOption.isPredefined
          }
        }
      } else if (params.pageTab === MONITOR_JOBS_TAB) {
        filters = {
          dates: {
            value: dateFilter,
            isPredefined: false
          }
        }
      }

      filters.iter = 'false'

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
    params.pageTab,
    params.workflowId,
    refreshJobs,
    selectedJob,
    setFilters,
    workflowsViewMode
  ])

  useEffect(() => {
    return () => {
      setJobs([])
      setJobRuns([])
    }
  }, [params.projectName, params.pageTab])

  useEffect(() => {
    return () => {
      setDataIsLoaded(false)
    }
  }, [params.projectName, params.pageTab, params.jobName])

  const getWorkflows = useCallback(
    filter => {
      fetchWorkflows(params.projectName, filter)
    },
    [fetchWorkflows, params.projectName]
  )

  useEffect(() => {
    if (params.pageTab === MONITOR_WORKFLOWS_TAB) {
      if (params.workflowId) {
        setFilters({ groupBy: GROUP_BY_NONE })
      } else {
        getWorkflows()
        setFilters({ groupBy: GROUP_BY_WORKFLOW })
      }
    } else {
      setFilters({ groupBy: GROUP_BY_NONE })
    }
  }, [getWorkflows, params.pageTab, params.workflowId, params.jobName, setFilters])

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

  const onEditJob = (event, postData) => {
    const generatedData = cloneDeep(postData)

    delete generatedData.function.metadata

    editJob(
      {
        credentials: postData.function.metadata.credentials,
        scheduled_object: generatedData,
        cron_trigger: generatedData.schedule
      },
      params.projectName
    )
      .then(() => {
        removeNewJob()

        navigate(`/projects/${params.projectName}/jobs/${params.pageTab}`)
        setEditableItem(null)
        refreshJobs(filtersStore)
      })
      .catch(error => {
        dispatch(
          editJobFailure(
            error.response.status === STATUS_CODE_FORBIDDEN
              ? 'You are not permitted to run new job.'
              : error.message
          )
        )
      })
  }

  const generateCloseDetailsLink = name => {
    return params.jobName
      ? getCloseDetailsLink(location, params.jobName)
      : location.pathname
          .split('/')
          .splice(0, location.pathname.split('/').indexOf(params.pageTab) + 1)
          .concat(name)
          .join('/')
  }

  return (
    <JobsView
      actionsMenu={actionsMenu}
      confirmData={confirmData}
      convertedYaml={convertedYaml}
      editableItem={editableItem}
      fetchCurrentJob={fetchCurrentJob}
      functionsStore={functionsStore}
      getCloseDetailsLink={generateCloseDetailsLink}
      jobRuns={jobRuns}
      jobs={jobs}
      handleActionsMenuClick={handleActionsMenuClick}
      handleCancel={handleCancel}
      handleSelectJob={handleSelectJob}
      handleSuccessRerunJob={handleSuccessRerunJob}
      itemIsSelected={itemIsSelected}
      jobsStore={jobsStore}
      onEditJob={onEditJob}
      pageData={pageData}
      params={params}
      refreshJobs={params.pageTab === MONITOR_WORKFLOWS_TAB ? getWorkflows : refreshJobs}
      removeNewJob={removeNewJob}
      selectedFunction={selectedFunction}
      selectedJob={selectedJob}
      setEditableItem={setEditableItem}
      setWorkflowsViewMode={setWorkflowsViewMode}
      toggleConvertedYaml={toggleConvertedYaml}
      workflow={workflowsStore.activeWorkflow.data}
      workflowJobsIds={workflowsStore.activeWorkflow.workflowJobsIds}
      workflowsStore={workflowsStore}
      workflowsViewMode={workflowsViewMode}
    />
  )
}

export default connect(
  ({ appStore, filtersStore, functionsStore, jobsStore, detailsStore, workflowsStore }) => ({
    appStore,
    detailsStore,
    filtersStore,
    functionsStore,
    jobsStore,
    workflowsStore
  }),
  {
    ...actionCreator
  }
)(React.memo(Jobs))
