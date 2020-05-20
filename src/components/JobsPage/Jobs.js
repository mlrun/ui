import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import jobsActions from '../../actions/jobs'
import workflowActions from '../../actions/workflow'
import jobsData from './jobsData'
import { parseKeyValues } from '../../utils'

import Content from '../../layout/Content/Content'
import Loader from '../../common/Loader/Loader'

const Jobs = ({
  fetchJobs,
  fetchWorkflows,
  jobsStore,
  history,
  match,
  workflowsStore
}) => {
  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState({})
  const [stateFilter, setStateFilter] = useState(jobsData.initialStateFilter)
  const [groupFilter, setGroupFilter] = useState(jobsData.initialGroupFilter)
  const pageData = {
    detailsMenu: jobsData.detailsMenu,
    filters: jobsData.filters,
    page: jobsData.page,
    tableHeaders: jobsData.tableHeaders
  }

  const refreshJobs = useCallback(
    event => {
      fetchJobs(
        match.params.projectName,
        stateFilter !== jobsData.initialStateFilter && stateFilter,
        event
      ).then(jobs => {
        const newJobs = jobs.map(job => {
          const func = job?.spec?.function?.match(
            /(\/)([\w\W\d]+)(?=:)|(:)([\w\d]+)/g
          )

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
            owner: job.metadata.labels.owner,
            updated: new Date(job.status.last_update),
            function: {
              name: func && func[0],
              hash: func && func[1]
            }
          }
        })

        return setJobs(newJobs)
      })
    },
    [fetchJobs, match.params.projectName, stateFilter]
  )

  const getWorkflows = useCallback(() => {
    fetchWorkflows()
  }, [fetchWorkflows])

  useEffect(() => {
    refreshJobs()
    getWorkflows()

    return () => {
      setSelectedJob({})
      setJobs([])
    }
  }, [getWorkflows, history, match.params.projectName, refreshJobs])

  useEffect(() => {
    if (match.params.jobId && jobs.length > 0) {
      let item = jobs.find(item => item.uid === match.params.jobId)

      if (!item) {
        return history.push(`/projects/${match.params.projectName}/jobs`)
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
    history
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
    setStateFilter(id || jobsData.initialStateFilter)
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
  { ...jobsActions, ...workflowActions }
)(React.memo(Jobs))
