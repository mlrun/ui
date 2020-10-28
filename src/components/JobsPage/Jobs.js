import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import jobsActions from '../../actions/jobs'
import workflowActions from '../../actions/workflow'
import {
  generatePageData,
  initialStateFilter,
  initialGroupFilter
} from './jobsData'
import { parseKeyValues } from '../../utils'
import { SCHEDULE_TAB } from '../../constants'
import notificationActions from '../../actions/notificationDownload'

import Content from '../../layout/Content/Content'
import Loader from '../../common/Loader/Loader'

const Jobs = ({
  fetchJobs,
  fetchWorkflows,
  jobsStore,
  handleRunScheduledJob,
  history,
  match,
  removeScheduledJob,
  setLoading,
  setNotification,
  workflowsStore
}) => {
  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState({})
  const [stateFilter, setStateFilter] = useState(initialStateFilter)
  const [groupFilter, setGroupFilter] = useState(initialGroupFilter)

  const handleRemoveScheduledJob = scheduleName => {
    removeScheduledJob(match.params.projectName, scheduleName).then(() => {
      refreshJobs()
    })
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

  const pageData = useCallback(
    generatePageData(
      match.params.jobTab.toUpperCase() === SCHEDULE_TAB,
      handleRemoveScheduledJob,
      handleRunJob
    ),
    [match.params.jobTab]
  )

  const refreshJobs = useCallback(
    event => {
      fetchJobs(
        match.params.projectName,
        stateFilter !== initialStateFilter && stateFilter,
        event,
        match.params.jobTab.toUpperCase() === SCHEDULE_TAB
      ).then(jobs => {
        const newJobs = jobs.map(job => {
          if (match.params.jobTab.toUpperCase() === SCHEDULE_TAB) {
            return {
              name: job.name,
              type: job.kind === 'pipeline' ? 'workflow' : job.kind,
              createdTime: new Date(job.creation_time),
              nextRun: new Date(job.next_run_time),
              scheduled_object: job.scheduled_object
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
              function: job?.spec?.function ?? ''
            }
          }
        })

        return setJobs(newJobs)
      })
    },
    [fetchJobs, match.params.jobTab, match.params.projectName, stateFilter]
  )

  const getWorkflows = useCallback(
    token => {
      fetchWorkflows(token).then(pageToken => {
        if (pageToken?.length > 0) {
          getWorkflows(pageToken)
        }
      })
    },
    [fetchWorkflows]
  )

  useEffect(() => {
    refreshJobs()

    return () => {
      setSelectedJob({})
      setJobs([])
    }
  }, [getWorkflows, history, match.params.jobTab, refreshJobs])

  useEffect(() => {
    if (match.params.jobTab.toUpperCase() === SCHEDULE_TAB) {
      setGroupFilter('none')
    } else {
      getWorkflows()
      setGroupFilter(initialGroupFilter)
    }
  }, [getWorkflows, match.params.jobTab])

  useEffect(() => {
    if (match.params.jobId && jobs.length > 0) {
      let item = jobs.find(item => item.uid === match.params.jobId)

      if (!item) {
        return history.push(
          `/projects/${match.params.projectName}/jobs/${match.params.jobTab}`
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
    match.params.jobTab
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

  return (
    <>
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
    </>
  )
}

Jobs.propTypes = {
  history: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired
}

export default connect(
  ({ jobsStore, workflowsStore }) => ({ jobsStore, workflowsStore }),
  { ...jobsActions, ...workflowActions, ...notificationActions }
)(React.memo(Jobs))
