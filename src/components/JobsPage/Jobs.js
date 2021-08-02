import React, { useCallback, useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import Content from '../../layout/Content/Content'
import Loader from '../../common/Loader/Loader'
import PopUpDialog from '../../common/PopUpDialog/PopUpDialog'
import JobsPanel from '../JobsPanel/JobsPanel'
import Button from '../../common/Button/Button'

import filtersActions from '../../actions/filters'
import jobsActions from '../../actions/jobs'
import notificationActions from '../../actions/notification'
import projectActions from '../../actions/projects'
import detailsActions from '../../actions/details'
import { generatePageData } from './jobsData'
import { generateKeyValues, parseKeyValues } from '../../utils'
import getState from '../../utils/getState.js'
import { isDetailsTabExists } from '../../utils/isDetailsTabExists'
import {
  MONITOR_TAB,
  SCHEDULE_TAB,
  INIT_GROUP_FILTER,
  JOBS_PAGE,
  PANEL_EDIT_MODE
} from '../../constants'

const Jobs = ({
  abortJob,
  appStore,
  editJob,
  editJobFailure,
  fetchJobFunction,
  fetchJobLogs,
  fetchJobPods,
  fetchJobs,
  fetchProjectWorkflows,
  handleRunScheduledJob,
  history,
  jobsStore,
  match,
  removeJobLogs,
  removeNewJob,
  removePods,
  removeScheduledJob,
  setFilters,
  setLoading,
  setNotification,
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
      btnConfirmType: 'danger',
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
      btnConfirmType: 'danger',
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
      match.params.pageTab === SCHEDULE_TAB,
      onRemoveScheduledJob,
      handleRunJob,
      setEditableItem,
      handleRerunJob,
      handleMonitoring,
      appStore.frontendSpec.jobs_dashboard_url,
      onAbortJob,
      appStore.frontendSpec.abortable_function_kinds,
      fetchJobLogs,
      removeJobLogs
    ),
    [match.params.pageTab, appStore.frontendSpec.jobs_dashboard_url]
  )

  const refreshJobs = useCallback(
    filters => {
      fetchJobs(
        match.params.projectName,
        filters,
        match.params.pageTab === SCHEDULE_TAB
      ).then(jobs => {
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
              state: getState(job.last_run?.status.state),
              type: job.kind === 'pipeline' ? 'workflow' : job.kind,
              project: job.project
            }
          } else {
            return {
              uid: job.metadata.uid,
              iteration: job.metadata.iteration,
              iterationStats: job.status.iterations || [],
              iterations: [],
              startTime: new Date(job.status.start_time),
              state: getState(job.status.state),
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
              hyperparams: job.spec?.hyperparams || {}
            }
          }
        })

        return setJobs(newJobs)
      })
    },
    [fetchJobs, match.params.pageTab, match.params.projectName]
  )

  const getWorkflows = useCallback(() => {
    fetchProjectWorkflows(match.params.projectName)
  }, [fetchProjectWorkflows, match.params.projectName])

  useEffect(() => {
    if (!isEmpty(selectedJob) && match.params.pageTab === MONITOR_TAB) {
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
      isDetailsTabExists(JOBS_PAGE, match.params, pageData.detailsMenu, history)
    }
  }, [history, match.params, pageData.detailsMenu])

  useEffect(() => {
    refreshJobs()

    return () => {
      setSelectedJob({})
      setJobs([])
    }
  }, [refreshJobs])

  useEffect(() => {
    if (match.params.pageTab === SCHEDULE_TAB) {
      setFilters({ groupBy: 'none' })
    } else if (match.params.pageTab !== SCHEDULE_TAB) {
      getWorkflows()
      setFilters({ groupBy: INIT_GROUP_FILTER })
    }
  }, [getWorkflows, match.params.pageTab, setFilters])

  useEffect(() => {
    if (match.params.jobId && jobs.some(job => job.uid) && jobs.length > 0) {
      let item = jobs.find(item => item.uid === match.params.jobId)

      if (!item) {
        return history.replace(
          `/projects/${match.params.projectName}/jobs/${match.params.pageTab}`
        )
      }

      setSelectedJob(item)
    } else {
      setSelectedJob({})
    }
  }, [
    match.params.jobId,
    setSelectedJob,
    jobs,
    match.params.projectName,
    history,
    match.params.pageTab
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
    <>
      {confirmData && (
        <PopUpDialog
          headerText={confirmData.title}
          closePopUp={confirmData.rejectHandler}
        >
          <div>{confirmData.description}</div>
          <div className="pop-up-dialog__footer-container">
            <Button
              variant="tertiary"
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
      {(jobsStore.loading || workflowsStore.loading) && <Loader />}
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
        yamlContent={jobsStore.jobs}
      />
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
    </>
  )
}

Jobs.propTypes = {
  history: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired
}

export default connect(
  ({ appStore, jobsStore, detailsStore, workflowsStore }) => ({
    appStore,
    detailsStore,
    jobsStore,
    workflowsStore
  }),
  {
    ...jobsActions,
    ...projectActions,
    ...detailsActions,
    ...notificationActions,
    ...filtersActions
  }
)(React.memo(Jobs))
