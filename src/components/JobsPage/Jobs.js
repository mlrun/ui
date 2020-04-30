import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import jobsActions from '../../actions/jobs'
import jobsData from './jobsData'
import { parseKeyValues } from '../../utils'

import Content from '../../layout/Content/Content'
import Loader from '../../common/Loader/Loader'

const Jobs = ({ fetchJobs, jobsStore, match, history }) => {
  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState({})

  const [stateFilter, setStateFilter] = useState(jobsData.initialStateFilter)
  const [groupFilter, setGroupFilter] = useState(jobsData.initialGroupFilter)

  const refreshJobs = useCallback(
    event => {
      fetchJobs(
        match.params.projectName,
        stateFilter !== jobsData.initialStateFilter && stateFilter,
        event
      ).then(jobs => {
        const newJobs = jobs.map(job => {
          const func = job?.spec?.function?.match(
            /(?<=\/)([\w\W\d]+)(?=:)|(?<=:)([\w\d]+)/g
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

  useEffect(() => {
    refreshJobs()

    return () => {
      setSelectedJob({})
      setJobs([])
    }
  }, [history, match.params.projectName, refreshJobs])

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
      {jobsStore.loading && <Loader />}
      <Content
        content={jobs}
        detailsMenu={jobsData.detailsMenu}
        filters={jobsData.filters}
        groupFilter={groupFilter}
        handleCancel={handleCancel}
        handleSelectItem={handleSelectJob}
        loading={jobsStore.loading}
        match={match}
        page={jobsData.page}
        refresh={refreshJobs}
        selectedItem={selectedJob}
        setGroupFilter={setGroupFilter}
        setStateFilter={onStateFilterChange}
        stateFilter={stateFilter}
        tableHeaders={jobsData.tableHeaders}
        yamlContent={jobsStore.jobs}
      />
    </>
  )
}

Jobs.propTypes = {
  fetchJobs: PropTypes.func.isRequired,
  history: PropTypes.shape({}).isRequired,
  jobsStore: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired
}

export default connect(jobsStore => jobsStore, jobsActions)(React.memo(Jobs))
