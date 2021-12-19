import React, { useCallback, useEffect, useRef, useMemo, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { find, isEmpty, cloneDeep } from 'lodash'

import ConfirmDialog from '../../common/ConfirmDialog/ConfirmDialog'
import Content from '../../layout/Content/Content'
import JobsPanel from '../JobsPanel/JobsPanel'
import Loader from '../../common/Loader/Loader'
import Workflow from '../Workflow/Workflow'
import Details from '../Details/Details'
import YamlModal from '../../common/YamlModal/YamlModal'

import detailsActions from '../../actions/details'
import filtersActions from '../../actions/filters'
import jobsActions from '../../actions/jobs'
import notificationActions from '../../actions/notification'
import workflowsActions from '../../actions/workflow'
import functionsActions from '../../actions/functions'

import { useDemoMode } from '../../hooks/demoMode.hook'
import { useYaml } from '../../hooks/yaml.hook'
import { generateKeyValues } from '../../utils'
import { generatePageData } from './jobsData'
import { getJobIdentifier } from '../../utils/getUniqueIdentifier'
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
  PANEL_EDIT_MODE,
  SCHEDULE_TAB,
  TERTIARY_BUTTON
} from '../../constants'
import { parseJob } from '../../utils/parseJob'
import { parseFunction } from '../../utils/parseFunction'
import { getFunctionLogs } from '../../utils/getFunctionLogs'
import { isPageTabValid } from '../../utils/handleRedirect'
import { generateContentActionsMenu } from '../../layout/Content/content.util'

import { ReactComponent as Yaml } from '../../images/yaml.svg'

const Jobs = ({
  abortJob,
  appStore,
  editJob,
  editJobFailure,
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
  removeFunction,
  removeFunctionLogs,
  removeJob,
  removeJobLogs,
  removeNewJob,
  removePods,
  removeScheduledJob,
  setFilters,
  setLoading,
  setNotification,
  workflowsStore
}) => {
  const [convertedYaml, toggleConvertedYaml] = useYaml('')
  const [jobs, setJobs] = useState([])
  const [confirmData, setConfirmData] = useState(null)
  const [editableItem, setEditableItem] = useState(null)
  const [workflow, setWorkflow] = useState({})
  const [workflowJobsIds, setWorkflowJobsIds] = useState([])
  const [selectedJob, setSelectedJob] = useState({})
  const [selectedFunction, setSelectedFunction] = useState({})
  const [workflowsViewMode, setWorkflowsViewMode] = useState('graph')
  const [dataIsLoaded, setDataIsLoaded] = useState(false)
  const isDemoMode = useDemoMode()

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
      refreshJobs()
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
      .catch(() => {
        setNotification({
          status: 400,
          id: Math.random(),
          retry: item => handleRunJob(item),
          message: 'Job failed to start'
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

    setEditableItem({
      rerun_object: {
        credentials: {
          access_key: functionData?.metadata?.credentials?.access_key ?? ''
        },
        function: {
          spec: {
            env: functionData?.spec.env ?? [],
            resources: functionData?.spec.resources,
            volume_mounts: functionData?.spec.volume_mounts ?? [],
            volumes: functionData?.spec.volumes ?? [],
            node_selector: functionData?.spec.node_selector ?? {}
          }
        },
        schedule: null,
        task: {
          metadata: {
            labels: generateKeyValues(job.labels ?? {}),
            name: job.name,
            project: job.project
          },
          spec: {
            function: job.function,
            handler: job?.handler ?? '',
            hyperparams: job.hyperparams,
            input_path: job.input_path ?? '',
            inputs: job.inputs ?? {},
            output_path: job.outputPath,
            param_file: job.param_file ?? '',
            parameters: generateKeyValues(job.parameters ?? {}),
            secret_sources: job.secret_sources ?? [],
            selector: job.selector ?? 'max.',
            tuning_strategy: job.tuning_strategy ?? 'list'
          }
        }
      }
    })
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
      isDemoMode,
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
      handleRemoveFunctionLogs
    ),
    [
      match.params.projectName,
      match.params.pageTab,
      match.params.workflowId,
      appStore.frontendSpec.jobs_dashboard_url,
      isDemoMode,
      selectedJob,
      selectedFunction
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
      fetchJobs(
        match.params.projectName,
        filters,
        match.params.pageTab === SCHEDULE_TAB
      )
        .then(jobs => {
          return setJobs(jobs.map(job => parseJob(job, match.params.pageTab)))
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
    [fetchJobs, match.params.pageTab, match.params.projectName, setNotification]
  )

  const fetchCurrentJob = useCallback(() => {
    fetchJob(match.params.projectName, match.params.jobId)
      .then(job => {
        setSelectedJob(parseJob(job))
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
    if (!workflow.graph) {
      fetchWorkflow(match.params.workflowId)
        .then(workflow => {
          setWorkflow(workflow)
          setWorkflowJobsIds(
            Object.values(workflow.graph).map(jobData => jobData.run_uid)
          )
        })
        .catch(() =>
          history.replace(
            `/projects/${match.params.projectName}/jobs/${match.params.pageTab}`
          )
        )
    }
  }, [
    fetchWorkflow,
    history,
    match.params.pageTab,
    match.params.projectName,
    match.params.workflowId,
    workflow.graph
  ])

  useEffect(() => {
    if (
      match.params.jobId &&
      (isEmpty(selectedJob) || match.params.jobId !== selectedJob.uid)
    ) {
      fetchCurrentJob()
    } else if (!isEmpty(selectedJob) && !match.params.jobId) {
      setSelectedJob({})
      removeJob()
    } else if (
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
          })
          .catch(error => handleCatchRequest(error, 'Failed to fetch function'))
      }
    } else if (!isEmpty(selectedFunction) && !match.params.functionHash) {
      setSelectedFunction({})
      removeFunction()
    }
  }, [
    fetchCurrentJob,
    getFunctionWithHash,
    history,
    match.params.functionHash,
    match.params.functionName,
    match.params.jobId,
    match.params.projectName,
    match.path,
    match.url,
    handleCatchRequest,
    removeFunction,
    removeJob,
    selectedFunction,
    selectedJob,
    setNotification,
    getFunction,
    workflow
  ])

  useEffect(() => {
    if (isEmpty(selectedJob) && !match.params.jobId && !dataIsLoaded) {
      let filters = {}

      if (match.params.pageTab === MONITOR_JOBS_TAB) {
        const pastWeekOption = datePickerOptions.find(
          option => option.id === PAST_WEEK_DATE_OPTION
        )

        filters = {
          dates: {
            value: pastWeekOption.handler(),
            isPredefined: pastWeekOption.isPredefined
          }
        }

        setFilters(filters)
      }

      refreshJobs(filters)
      setDataIsLoaded(true)
    }
  }, [
    dataIsLoaded,
    match.params.jobId,
    match.params.pageTab,
    refreshJobs,
    selectedJob,
    setFilters
  ])

  useEffect(() => {
    return () => {
      setJobs([])
      setDataIsLoaded(false)
    }
  }, [match.params.projectName, match.params.pageTab])

  const getWorkflows = useCallback(() => {
    fetchWorkflows(match.params.projectName)
  }, [fetchWorkflows, match.params.projectName])

  useEffect(() => {
    if (match.params.pageTab === SCHEDULE_TAB) {
      setFilters({ groupBy: GROUP_BY_NONE })
    } else if (match.params.pageTab === MONITOR_WORKFLOWS_TAB) {
      if (match.params.workflowId) {
        setFilters({ groupBy: GROUP_BY_NONE })
      } else {
        getWorkflows()
        setFilters({ groupBy: GROUP_BY_WORKFLOW })
      }
    }
  }, [getWorkflows, match.params.pageTab, match.params.workflowId, setFilters])

  const handleSelectJob = item => {
    if (document.getElementsByClassName('view')[0]) {
      document.getElementsByClassName('view')[0].classList.remove('view')
    }

    setSelectedJob(item)
  }

  const handleCancel = () => {
    setSelectedJob({})
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
        dispatch(editJobFailure(error.message))
      })
  }

  return (
    <div className="content-wrapper">
      <Content
        content={jobs}
        handleActionsMenuClick={handleActionsMenuClick}
        handleCancel={handleCancel}
        handleSelectItem={handleSelectJob}
        loading={jobsStore.loading}
        match={match}
        pageData={pageData}
        refresh={refreshJobs}
        selectedItem={selectedJob}
        setLoading={setLoading}
        getIdentifier={getJobIdentifier}
      >
        {match.params.workflowId ? (
          <Workflow
            actionsMenu={actionsMenu}
            content={jobs}
            handleCancel={handleCancel}
            handleSelectItem={handleSelectJob}
            history={history}
            match={match}
            pageData={pageData}
            refresh={refreshJobs}
            refreshJobs={refreshJobs}
            selectedFunction={selectedFunction}
            selectedJob={selectedJob}
            setLoading={setLoading}
            setWorkflowsViewMode={setWorkflowsViewMode}
            workflow={workflow}
            workflowJobsIds={workflowJobsIds}
            workflowsViewMode={workflowsViewMode}
          />
        ) : !isEmpty(selectedJob) ? (
          <Details
            actionsMenu={actionsMenu}
            detailsMenu={pageData.details.menu}
            handleCancel={handleCancel}
            handleRefresh={fetchCurrentJob}
            isDetailsScreen
            match={match}
            pageData={pageData}
            selectedItem={selectedJob}
          />
        ) : null}
      </Content>
      {confirmData && (
        <ConfirmDialog
          cancelButton={{
            handler: confirmData.rejectHandler,
            label: 'Cancel',
            variant: TERTIARY_BUTTON
          }}
          closePopUp={confirmData.rejectHandler}
          confirmButton={{
            handler: () => confirmData.confirmHandler(confirmData.item),
            label: confirmData.btnConfirmLabel,
            variant: confirmData.btnConfirmType
          }}
          header={confirmData.header}
          message={confirmData.message}
        />
      )}
      {(jobsStore.loading ||
        workflowsStore.workflows.loading ||
        workflowsStore.activeWorkflow.loading ||
        functionsStore.loading) && <Loader />}
      {editableItem && (
        <JobsPanel
          closePanel={() => {
            setEditableItem(null)
            removeNewJob()
          }}
          defaultData={
            editableItem.scheduled_object || editableItem.rerun_object
          }
          handleRunNewJob={{}}
          match={match}
          mode={PANEL_EDIT_MODE}
          onEditJob={onEditJob}
          onSuccessRun={tab => {
            if (editableItem) {
              handleSuccessRerunJob(tab)
            }
          }}
          project={match.params.projectName}
          withSaveChanges={Boolean(editableItem.scheduled_object)}
        />
      )}

      {convertedYaml.length > 0 && (
        <YamlModal
          convertedYaml={convertedYaml}
          toggleConvertToYaml={toggleConvertedYaml}
        />
      )}
    </div>
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
    ...functionsActions,
    ...jobsActions,
    ...workflowsActions,
    ...detailsActions,
    ...notificationActions,
    ...filtersActions
  }
)(React.memo(Jobs))
