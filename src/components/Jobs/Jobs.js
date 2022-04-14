import React, { useCallback, useEffect, useRef, useMemo, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { find, isEmpty, cloneDeep } from 'lodash'

import JobsView from './JobsView'

import { useMode } from '../../hooks/mode.hook'
import { useYaml } from '../../hooks/yaml.hook'
import {
  actionCreator,
  generateEditableItem,
  generatePageData
} from './jobs.util'
import { isDetailsTabExists } from '../../utils/isDetailsTabExists'
import {
  datePickerOptions,
  PAST_WEEK_DATE_OPTION
} from '../../utils/datePicker.util'
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
  history,
  jobsStore,
  match,
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

  const handleRemoveFunctionLogs = useCallback(() => {
    clearTimeout(fetchFunctionLogsTimeout.current)
    removeFunctionLogs()
  }, [fetchFunctionLogsTimeout, removeFunctionLogs])

  const handleRemoveScheduledJob = schedule => {
    removeScheduledJob(match.params.projectName, schedule.name).then(() => {
      refreshJobs(filtersStore)
    })

    setConfirmData(null)
  }

  const handleMonitoring = item => {
    let redirectUrl = appStore.frontendSpec.jobs_dashboard_url
      .replace('{filter_name}', item ? 'uid' : 'project')
      .replace('{filter_value}', item ? item.uid : match.params.projectName)

    window.open(redirectUrl, '_blank')
  }

  const handleRunJob = job => {
    handleRunScheduledJob(
      {
        ...job.scheduled_object
      },
      match.params.projectName,
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
  }

  const handleSuccessRerunJob = tab => {
    if (tab === match.params.pageTab) {
      refreshJobs(filtersStore)
    }

    setEditableItem(null)
    setNotification({
      status: 200,
      id: Math.random(),
      message: 'Job started successfully'
    })
  }

  const onRemoveScheduledJob = scheduledJob => {
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
  }

  const handleActionsMenuClick = () => {
    history.push(
      `/projects/${match.params.projectName}/jobs/${match.params.pageTab}/create-new-job`
    )
  }

  const handleRerunJob = async job => {
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
  }

  const handleAbortJob = job => {
    abortJob(match.params.projectName, job)
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
  }

  const onAbortJob = job => {
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
  }

  const handleCatchRequest = useCallback(
    (error, message) => {
      setNotification({
        status: error?.response?.status || 400,
        id: Math.random(),
        message
      })
      history.push(
        match.url
          .split('/')
          .splice(0, match.path.split('/').indexOf(':workflowId') + 1)
          .join('/')
      )
    },
    [history, match.path, match.url, setNotification]
  )

  const handleEditScheduleJob = useCallback(
    editableItem => {
      fetchScheduledJobAccessKey(match.params.projectName, editableItem.name)
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
    [fetchScheduledJobAccessKey, match.params.projectName, setNotification]
  )

  const pageData = useCallback(
    generatePageData(
      match.params.pageTab,
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
      match.params.workflowId,
      selectedFunction,
      handleFetchFunctionLogs,
      handleRemoveFunctionLogs,
      match.params.jobName
    ),
    [
      match.params.projectName,
      match.params.pageTab,
      match.params.workflowId,
      match.params.jobName,
      appStore.frontendSpec.jobs_dashboard_url,
      isStagingMode,
      selectedJob,
      selectedFunction,
      onAbortJob,
      onRemoveScheduledJob
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

  const refreshJobs = useCallback(
    filters => {
      if (filters.dates) {
        setDateFilter(filters.dates.value)
      }
      const fetchData = match.params.jobName ? fetchAllJobRuns : fetchJobs
      fetchData(
        match.params.projectName,
        filters,
        match.params.jobName,
        match.params.pageTab === SCHEDULE_TAB
      )
        .then(jobs => {
          const parsedJobs = jobs.map(job =>
            parseJob(job, match.params.pageTab)
          )

          if (match.params.jobName) {
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
      match.params.jobName,
      match.params.pageTab,
      match.params.projectName,
      setNotification
    ]
  )

  const fetchCurrentJob = useCallback(() => {
    return fetchJob(match.params.projectName, match.params.jobId)
      .then(job => {
        setSelectedJob(parseJob(job))
        setItemIsSelected(true)

        return job
      })
      .catch(() =>
        history.replace(
          `/projects/${match.params.projectName}/jobs/${match.params.pageTab}`
        )
      )
  }, [
    fetchJob,
    history,
    match.params.jobId,
    match.params.pageTab,
    match.params.projectName
  ])

  const isJobDataEmpty = useCallback(
    () =>
      jobs.length === 0 &&
      ((!match.params.jobName && jobRuns.length === 0) || match.params.jobName),
    [jobRuns.length, jobs.length, match.params.jobName]
  )

  useEffect(() => {
    if (
      !isEmpty(selectedJob) &&
      [MONITOR_JOBS_TAB, MONITOR_WORKFLOWS_TAB].includes(match.params.pageTab)
    ) {
      fetchJobPods(match.params.projectName, selectedJob.uid)

      const interval = setInterval(() => {
        fetchJobPods(match.params.projectName, selectedJob.uid)
      }, 30000)

      return () => {
        removePods()
        clearInterval(interval)
      }
    }
  }, [
    fetchJobPods,
    match.params.pageTab,
    match.params.projectName,
    removePods,
    selectedJob
  ])

  useEffect(() => {
    if (match.params.jobId && pageData.details.menu.length > 0) {
      isDetailsTabExists(JOBS_PAGE, match, pageData.details.menu, history)
    }
  }, [history, match, pageData.details.menu])

  useEffect(() => {
    isPageTabValid(
      match,
      pageData.tabs.map(tab => tab.id),
      history
    )
  }, [history, pageData.tabs, match])

  useEffect(() => {
    const workflow = { ...workflowsStore.activeWorkflow.data }
    const getWorkflow = () => {
      fetchWorkflow(match.params.workflowId).catch(() =>
        history.replace(
          `/projects/${match.params.projectName}/jobs/${match.params.pageTab}`
        )
      )
    }

    if (!match.params.workflowId && workflow.graph) {
      resetWorkflow()
    }

    if (!workflow.graph && match.params.workflowId) {
      getWorkflow()
    }

    if (
      ['Running', 'None'].includes(workflow?.run?.status) &&
      match.params.workflowId &&
      workflow.graph
    ) {
      const timeout = setTimeout(getWorkflow, 10000)

      return () => clearTimeout(timeout)
    }
  }, [
    fetchWorkflow,
    history,
    match.params.pageTab,
    match.params.projectName,
    match.params.workflowId,
    resetWorkflow,
    workflowsStore.activeWorkflow
  ])

  useEffect(() => {
    if (
      match.params.jobId &&
      (isEmpty(selectedJob) || match.params.jobId !== selectedJob.uid)
    ) {
      fetchCurrentJob().then(() => setSelectedFunction({}))
    }
  }, [fetchCurrentJob, match.params.jobId, selectedJob])

  useEffect(() => {
    const workflow = { ...workflowsStore.activeWorkflow.data }

    if (
      workflow.graph &&
      match.params.functionHash &&
      (isEmpty(selectedFunction) ||
        match.params.functionHash !== selectedFunction.hash)
    ) {
      const selectedWorkflowFunction = find(workflow.graph, workflowItem => {
        return (
          workflowItem.function?.includes(
            `${match.params.functionName}@${match.params.functionHash}`
          ) || workflowItem.function?.includes(match.params.functionName)
        )
      })
      const customFunctionState = selectedWorkflowFunction?.phase?.toLowerCase()

      if (
        match.params.functionHash === 'latest' &&
        match.params.functionName !== selectedFunction.name
      ) {
        getFunction(match.params.projectName, match.params.functionName)
          .then(func => {
            setSelectedFunction(
              parseFunction(func, match.params.projectName, customFunctionState)
            )
            setItemIsSelected(true)
            setSelectedJob({})
          })
          .catch(error => handleCatchRequest(error, 'Failed to fetch function'))
      } else if (match.params.functionName !== selectedFunction.name) {
        getFunctionWithHash(
          match.params.projectName,
          match.params.functionName,
          match.params.functionHash
        )
          .then(func => {
            setSelectedFunction(
              parseFunction(func, match.params.projectName, customFunctionState)
            )
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
    match.params.functionHash,
    match.params.functionName,
    match.params.projectName,
    selectedFunction,
    workflowsStore.activeWorkflow
  ])

  useEffect(() => {
    if (!match.params.functionHash && !match.params.jobId) {
      setItemIsSelected(false)
      setSelectedJob({})
      setSelectedFunction({})
    }
  }, [match.params.functionHash, match.params.jobId])

  useEffect(() => {
    if (
      ((isEmpty(selectedJob) &&
        !match.params.jobId &&
        !match.params.workflowId) ||
        workflowsViewMode === 'list') &&
      !dataIsLoaded
    ) {
      let filters = {}

      if (match.params.pageTab === MONITOR_JOBS_TAB && isJobDataEmpty()) {
        const pastWeekOption = datePickerOptions.find(
          option => option.id === PAST_WEEK_DATE_OPTION
        )

        filters = {
          dates: {
            value: pastWeekOption.handler(),
            isPredefined: pastWeekOption.isPredefined
          },
          iter: ''
        }
      } else if (match.params.pageTab === MONITOR_JOBS_TAB) {
        filters = {
          dates: {
            value: dateFilter,
            isPredefined: false
          },
          iter: ''
        }
      }

      if (match.params.jobName) {
        filters.iter = 'false'
      }

      refreshJobs(filters)
      setFilters(filters)
      setDataIsLoaded(true)
    }
  }, [
    dataIsLoaded,
    dateFilter,
    isJobDataEmpty,
    match.params.jobId,
    match.params.jobName,
    match.params.pageTab,
    match.params.workflowId,
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
  }, [match.params.projectName, match.params.pageTab])

  useEffect(() => {
    return () => {
      setDataIsLoaded(false)
    }
  }, [match.params.projectName, match.params.pageTab, match.params.jobName])

  const getWorkflows = useCallback(
    filter => {
      fetchWorkflows(match.params.projectName, filter)
    },
    [fetchWorkflows, match.params.projectName]
  )

  useEffect(() => {
    if (match.params.pageTab === MONITOR_WORKFLOWS_TAB) {
      if (match.params.workflowId) {
        setFilters({ groupBy: GROUP_BY_NONE })
      } else {
        getWorkflows()
        setFilters({ groupBy: GROUP_BY_WORKFLOW })
      }
    } else {
      setFilters({ groupBy: GROUP_BY_NONE })
    }
  }, [
    getWorkflows,
    match.params.pageTab,
    match.params.workflowId,
    match.params.jobName,
    setFilters
  ])

  const handleSelectJob = useCallback(
    item => {
      if (match.params.jobName) {
        if (document.getElementsByClassName('view')[0]) {
          document.getElementsByClassName('view')[0].classList.remove('view')
        }

        setSelectedJob(item)
        setSelectedFunction({})
        setItemIsSelected(true)
      }
    },
    [match.params.jobName]
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
      match.params.projectName
    )
      .then(() => {
        removeNewJob()

        history.push(
          `/projects/${match.params.projectName}/jobs/${match.params.pageTab}`
        )
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
    return match.params.jobName
      ? getCloseDetailsLink(match, 'jobName')
      : match.url
          .split('/')
          .splice(0, match.path.split('/').indexOf(':pageTab') + 1)
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
      history={history}
      itemIsSelected={itemIsSelected}
      jobsStore={jobsStore}
      match={match}
      onEditJob={onEditJob}
      pageData={pageData}
      refreshJobs={
        match.params.pageTab === MONITOR_WORKFLOWS_TAB
          ? getWorkflows
          : refreshJobs
      }
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

Jobs.propTypes = {
  history: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired
}

export default connect(
  ({
    appStore,
    filtersStore,
    functionsStore,
    jobsStore,
    detailsStore,
    workflowsStore
  }) => ({
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
