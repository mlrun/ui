import React, { useCallback, useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import jobsActions from '../../actions/jobs'
import notificationActions from '../../actions/notification'
import projectActions from '../../actions/projects'
import {
  generatePageData,
  initialStateFilter,
  initialGroupFilter
} from './jobsData'
import { parseKeyValues } from '../../utils'
import { SCHEDULE_TAB } from '../../constants'

import Content from '../../layout/Content/Content'
import Loader from '../../common/Loader/Loader'
import PopUpDialog from '../../common/PopUpDialog/PopUpDialog'
import JobsPanel from '../JobsPanel/JobsPanel'
import Button from '../../common/Button/Button'
import {
  getDefaultData,
  getDefaultMethodAndVersion,
  getEnvironmentVariables,
  getMethodOptions,
  getParameters,
  getResources,
  getVersionOptions,
  getVolume,
  getVolumeMounts
} from '../JobsPanel/jobsPanel.util'

const Jobs = ({
  editJob,
  editJobFailure,
  fetchJobFunction,
  fetchJobs,
  fetchProjectWorkflows,
  jobsStore,
  handleRunScheduledJob,
  history,
  match,
  removeNewJob,
  removeScheduledJob,
  setLoading,
  setNotification,
  workflowsStore
}) => {
  const [jobs, setJobs] = useState([])
  const [confirmData, setConfirmData] = useState(null)
  const [selectedJob, setSelectedJob] = useState({})
  const [stateFilter, setStateFilter] = useState(initialStateFilter)
  const [groupFilter, setGroupFilter] = useState(initialGroupFilter)
  const [editableItem, setEditableItem] = useState(null)

  const dispatch = useDispatch()

  const handleRemoveScheduledJob = schedule => {
    removeScheduledJob(match.params.projectName, schedule.name).then(() => {
      refreshJobs()
    })

    setConfirmData(null)
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
    const functionParts = job.function.split('/')
    const functionName = functionParts[1].replace(/@.*$/g, '')
    const functionHash = functionParts[1].replace(/.*@/g, '')
    const functionData = await fetchJobFunction(
      functionParts[0],
      functionName,
      functionHash
    )

    console.log(functionName)

    const versionOptions = getVersionOptions([functionData])
    const methodOptions = getMethodOptions([functionData])
    const {
      defaultMethod,
      defaultVersion
    } = getDefaultMethodAndVersion(versionOptions, [functionData])

    const functionParameters = getParameters(
      [functionData],
      defaultMethod || (methodOptions[0]?.id ?? '')
    )
    const [{ limits, requests }] = getResources([functionData])
    const environmentVariables = getEnvironmentVariables([functionData])

    const { parameters, dataInputs } = getDefaultData(functionParameters)
    const volumeMounts = getVolumeMounts([functionData])
    const volumes = getVolume([functionData])
    const labels = parseKeyValues(functionData?.metadata.labels || [])
    const name = functionData?.metadata.name
    const project = functionData?.metadata.project
    const func = job.function
    const handler = defaultMethod || (methodOptions[0]?.id ?? '')
    //const hyperparams

    console.log('functionData: ', functionData)
    console.log('default version: ', defaultVersion)
    console.log('parameters : ', parameters)
    console.log('limits : ', limits)
    console.log('requests : ', requests)
    console.log('environmentVariables : ', environmentVariables)
    console.log('dataInputs : ', dataInputs)
    console.log('volumeMounts : ', volumeMounts)
    console.log('volumes : ', volumes)
    console.log('labels : ', labels)
    console.log('name : ', name)
    console.log('project : ', project)
    console.log('func : ', func)
    console.log('handler : ', handler)
    //function: {
    // spec:
    // env: (3) [{…}, {…}, {…}]
    // resources: {limits: {…}, requests: {…}}
    // volume_mounts: [{…}]
    // volumes: [{…}]
    // }
    // schedule: undefined
    // task:
    // metadata: {
    // labels: {}
    // name: "my-trainer"
    // project: "default"
    // }
    // spec: {
    // function: "default/my-trainer@5abba780832d7144359431289ba82c6caba9f460"
    // handler: "training"
    // hyperparams: {}
    // input_path: ""
    // inputs: {}
    // output_path: "v3io:///projects/{{run.project}}/artifacts/{{run.uid}}"
    // param_file: ""
    // parameters: {context: "", p1: 1, p2: 2}
    // secret_sources: []
    // selector: "max."
    // tuning_strategy: "list"
    // }
    console.log(job)
  }

  const pageData = useCallback(
    generatePageData(
      match.params.pageTab === SCHEDULE_TAB,
      onRemoveScheduledJob,
      handleRunJob,
      setEditableItem,
      handleRerunJob
    ),
    [match.params.pageTab]
  )

  const refreshJobs = useCallback(
    event => {
      fetchJobs(
        match.params.projectName,
        stateFilter !== initialStateFilter && stateFilter,
        event,
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
              state: job.last_run?.status.state,
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
              state: job.status.state,
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
              project: job.metadata.project
            }
          }
        })

        return setJobs(newJobs)
      })
    },
    [fetchJobs, match.params.pageTab, match.params.projectName, stateFilter]
  )

  const getWorkflows = useCallback(() => {
    fetchProjectWorkflows(match.params.projectName)
  }, [fetchProjectWorkflows, match.params.projectName])

  useEffect(() => {
    refreshJobs()

    return () => {
      setSelectedJob({})
      setJobs([])
    }
  }, [getWorkflows, history, match.params.pageTab, refreshJobs])

  useEffect(() => {
    if (match.params.pageTab === SCHEDULE_TAB) {
      setGroupFilter('none')
    } else if (match.params.pageTab !== SCHEDULE_TAB) {
      getWorkflows()
      setGroupFilter(initialGroupFilter)
    }
  }, [getWorkflows, match.params.pageTab])

  useEffect(() => {
    if (match.params.jobId && jobs.some(job => job.uid) && jobs.length > 0) {
      let item = jobs.find(item => item.uid === match.params.jobId)

      if (!item) {
        return history.push(
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

  const onStateFilterChange = id => {
    setStateFilter(id || initialStateFilter)
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
        groupFilter={groupFilter}
        handleCancel={handleCancel}
        handleSelectItem={handleSelectJob}
        loading={jobsStore.loading}
        match={match}
        pageData={pageData}
        refresh={refreshJobs}
        selectedItem={selectedJob}
        setGroupFilter={setGroupFilter}
        setLoading={setLoading}
        setStateFilter={onStateFilterChange}
        stateFilter={stateFilter}
        yamlContent={jobsStore.jobs}
      />
      {editableItem && (
        <JobsPanel
          closePanel={() => {
            setEditableItem(null)
            removeNewJob()
          }}
          defaultData={editableItem.scheduled_object}
          match={match}
          onEditJob={onEditJob}
          project={match.params.projectName}
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
  ({ jobsStore, workflowsStore }) => ({ jobsStore, workflowsStore }),
  { ...jobsActions, ...projectActions, ...notificationActions }
)(React.memo(Jobs))
