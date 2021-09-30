import React, { useCallback, useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import Button from '../../common/Button/Button'
import Content from '../../layout/Content/Content'
import JobsPanel from '../JobsPanel/JobsPanel'
import Loader from '../../common/Loader/Loader'
import PopUpDialog from '../../common/PopUpDialog/PopUpDialog'
import Workflow from '../Workflow/Workflow'

import detailsActions from '../../actions/details'
import filtersActions from '../../actions/filters'
import jobsActions from '../../actions/jobs'
import notificationActions from '../../actions/notification'
import workflowsActions from '../../actions/workflow'

import getState from '../../utils/getState.js'
import { generateKeyValues, parseKeyValues } from '../../utils'
import { generatePageData } from './jobsData'
import { getJobIdentifier } from '../../utils/getUniqueIdentifier'
import { isDetailsTabExists } from '../../utils/isDetailsTabExists'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'

import {
  DANGER_BUTTON,
  INIT_GROUP_FILTER,
  JOBS_PAGE,
  MONITOR_JOBS_TAB,
  MONITOR_WORKFLOWS_TAB,
  PANEL_EDIT_MODE,
  SCHEDULE_TAB,
  TERTIARY_BUTTON
} from '../../constants'
import { isDemoMode } from '../../utils/helper'

const Jobs = ({
  abortJob,
  appStore,
  editJob,
  editJobFailure,
  fetchJobFunction,
  fetchJobLogs,
  fetchJobPods,
  fetchJobs,
  fetchWorkflow,
  fetchWorkflows,
  filtersStore,
  handleRunScheduledJob,
  history,
  jobsStore,
  location,
  match,
  removeJobLogs,
  removeNewJob,
  removePods,
  removeScheduledJob,
  setFilters,
  setLoading,
  setNotification,
  subPage,
  workflowsStore
}) => {
  const [jobs, setJobs] = useState([])
  const [confirmData, setConfirmData] = useState(null)
  const [selectedJob, setSelectedJob] = useState({})
  const [editableItem, setEditableItem] = useState(null)

  const dispatch = useDispatch()

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
      refreshJobs()
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
      title: `Delete scheduled job "${scheduledJob.name}"?`,
      description: 'Deleted scheduled jobs can not be restored.',
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
            handler:
              Object.values(functionData?.spec?.entry_points ?? {})[0]?.name ??
              '',
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
        refreshJobs()
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
      title: `Abort job "${job.name}"?`,
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

  const pageData = useCallback(
    generatePageData(
      match.params,
      location.search,
      onRemoveScheduledJob,
      handleRunJob,
      setEditableItem,
      handleRerunJob,
      handleMonitoring,
      appStore.frontendSpec.jobs_dashboard_url,
      onAbortJob,
      appStore.frontendSpec.abortable_function_kinds,
      fetchJobLogs,
      removeJobLogs,
      !isEveryObjectValueEmpty(selectedJob)
    ),
    [
      match.params,
      location.search,
      appStore.frontendSpec.jobs_dashboard_url,
      selectedJob
    ]
  )

  const refreshJobs = useCallback(
    filters => {
      fetchJobs(
        match.params.projectName,
        filters,
        match.params.pageTab === SCHEDULE_TAB
      )
        .then(jobs => {
          const newJobs = jobs.map(job => {
            if (match.params.pageTab === SCHEDULE_TAB) {
              return {
                createdTime: new Date(job.creation_time),
                func: job.scheduled_object.task.spec.function,
                name: job.name,
                nextRun: new Date(job.next_run_time),
                lastRunUri: job.last_run_uri,
                scheduled_object: job.scheduled_object,
                start_time: new Date(job.last_run?.status.start_time),
                state: getState(job.last_run?.status.state, JOBS_PAGE, 'job'),
                type: job.kind === 'pipeline' ? 'workflow' : job.kind,
                project: job.project,
                ui: {
                  originalContent: job
                }
              }
            } else {
              return {
                uid: job.metadata.uid,
                iteration: job.metadata.iteration,
                iterationStats: job.status.iterations || [],
                iterations: [],
                startTime: new Date(job.status.start_time),
                state: getState(job.status.state, JOBS_PAGE, 'job'),
                name: job.metadata.name,
                labels: parseKeyValues(job.metadata.labels || {}),
                logLevel: job.spec.log_level,
                inputs: job.spec.inputs || {},
                parameters: parseKeyValues(job.spec.parameters || {}),
                results: job.status.results || {},
                resultsChips: parseKeyValues(job.status.results || {}),
                artifacts: job.status.artifacts || [],
                outputPath: job.spec.output_path,
                owner: job.metadata.labels?.owner,
                updated: new Date(job.status.last_update),
                function: job?.spec?.function ?? '',
                project: job.metadata.project,
                hyperparams: job.spec?.hyperparams || {},
                ui: {
                  originalContent: job
                }
              }
            }
          })

          return setJobs(newJobs)
        })
        .catch(error => {
          setNotification({
            status: error?.response?.status || 400,
            id: Math.random(),
            message: 'Failed to fetch jobs',
            retry: () => refreshJobs(filtersStore.filters)
          })
        })
    },
    [
      fetchJobs,
      filtersStore.filters,
      match.params.pageTab,
      match.params.projectName,
      setNotification
    ]
  )

  useEffect(() => {
    if (!isEmpty(selectedJob) && match.params.pageTab === MONITOR_JOBS_TAB) {
      removePods()
      fetchJobPods(match.params.projectName, selectedJob.uid)

      const interval = setInterval(() => {
        fetchJobPods(match.params.projectName, selectedJob.uid)
      }, 30000)

      return () => clearInterval(interval)
    }
  }, [
    fetchJobPods,
    match.params.pageTab,
    match.params.projectName,
    removePods,
    selectedJob
  ])

  useEffect(() => {
    if (match.params.jobId && pageData.detailsMenu.length > 0) {
      isDetailsTabExists(JOBS_PAGE, match, pageData.detailsMenu, history)
    }
  }, [history, match, pageData.detailsMenu])

  useEffect(() => {
    if (match.params.jobId && jobs.some(job => job.uid) && jobs.length > 0) {
      let item = jobs.find(item => item.uid === match.params.jobId)

      if (!item) {
        const urlArray = match.url.split('/')
        const newUrl = urlArray.slice(0, -2).join('/')

        return history.replace(newUrl)
      }

      setSelectedJob(item)
    } else {
      setSelectedJob({})
    }
  }, [history, jobs, match.params.jobId, match.url, setSelectedJob])

  useEffect(() => {
    refreshJobs()

    return () => {
      setSelectedJob({})
      setJobs([])
    }
  }, [refreshJobs])

  const getWorkflows = useCallback(() => {
    fetchWorkflows(match.params.projectName)
  }, [fetchWorkflows, match.params.projectName])

  useEffect(() => {
    if (match.params.pageTab === SCHEDULE_TAB) {
      setFilters({ groupBy: 'none' })
    } else if (match.params.pageTab === MONITOR_JOBS_TAB) {
      if (!isDemoMode(location.search)) {
        getWorkflows()
      }
      setFilters({ groupBy: INIT_GROUP_FILTER })
    } else if (match.params.pageTab === MONITOR_WORKFLOWS_TAB) {
      if (match.params.workflowId) {
        setFilters({ groupBy: 'none' })
      } else {
        getWorkflows()
        setFilters({ groupBy: 'workflow' })
      }
    }
  }, [
    getWorkflows,
    match.params.pageTab,
    match.params.workflowId,
    location.search,
    subPage,
    setFilters
  ])

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
    editJob(
      { scheduled_object: postData, cron_trigger: postData.schedule },
      match.params.projectName
    )
      .then(() => {
        removeNewJob()

        history.push(
          `/projects/${match.params.projectName}/jobs/${match.params.pageTab}`
        )
        setEditableItem(null)
        refreshJobs()
      })
      .catch(error => {
        dispatch(editJobFailure(error.message))
      })
  }

  return (
    <div className="content-wrapper">
      <Content
        content={jobs}
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
            fetchWorkflow={fetchWorkflow}
            handleCancel={handleCancel}
            content={jobs}
            handleSelectItem={handleSelectJob}
            refresh={refreshJobs}
            history={history}
            match={match}
            pageData={pageData}
            refreshJobs={refreshJobs}
            selectedJob={selectedJob}
            setLoading={setLoading}
          />
        ) : null}
      </Content>
      {confirmData && (
        <PopUpDialog
          headerText={confirmData.title}
          closePopUp={confirmData.rejectHandler}
        >
          <div>{confirmData.description}</div>
          <div className="pop-up-dialog__footer-container">
            <Button
              variant={TERTIARY_BUTTON}
              label="Cancel"
              onClick={confirmData.rejectHandler}
              className="pop-up-dialog__btn_cancel"
            />
            <Button
              variant={confirmData.btnConfirmType}
              label={confirmData.btnConfirmLabel}
              onClick={() => confirmData.confirmHandler(confirmData.item)}
            />
          </div>
        </PopUpDialog>
      )}
      {(jobsStore.loading ||
        workflowsStore.workflows.loading ||
        workflowsStore.activeWorkflow.loading) && <Loader />}
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
    </div>
  )
}

Jobs.defaultProps = {
  subPage: ''
}

Jobs.propTypes = {
  history: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  subPage: PropTypes.string
}

export default connect(
  ({ appStore, filtersStore, jobsStore, detailsStore, workflowsStore }) => ({
    appStore,
    detailsStore,
    filtersStore,
    jobsStore,
    workflowsStore
  }),
  {
    ...jobsActions,
    ...workflowsActions,
    ...detailsActions,
    ...notificationActions,
    ...filtersActions
  }
)(React.memo(Jobs))
