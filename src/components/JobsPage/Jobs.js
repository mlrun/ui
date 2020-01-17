import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import jobsActions from '../../actions/jobs'

import JobsView from './JobsView'

const Jobs = ({ match, jobsStore, fetchJobs, setSelectedJob, history }) => {
  const [jobs, setJobs] = useState([])
  const [filter, setFilter] = useState('')
  const [filterValue, setFilterValue] = useState('')
  const [loading, setLoading] = useState(true)

  const refreshJobs = useCallback(
    noCahche => {
      if (noCahche || jobsStore.jobs.length === 0) {
        setSelectedJob({})
        setLoading(true)
        fetchJobs()
          .then(jobs => setJobs(jobs))
          .then(() => setLoading(false))
      }
    },
    [fetchJobs, jobsStore.jobs]
  )

  useEffect(() => {
    refreshJobs()
  }, [refreshJobs])

  useEffect(() => {
    if (match.params.jobId) {
      let item = jobsStore.jobs.find(item => {
        if (item.uid === match.params.jobId) return item
      })
      setSelectedJob(item)
    }
  }, [jobsStore.jobs, match.params, setSelectedJob])

  const handleSelectJob = item => {
    setSelectedJob(item)
  }

  const handleCancel = () => {
    setSelectedJob({})
  }

  const handleFilterByStatus = filter => {
    if (filter === 'All') {
      setJobs(jobsStore.jobs)
      return
    }
    let filteredJobs = jobsStore.jobs.filter(item => {
      if (item.state === filter.toLowerCase()) return item
    })
    setJobs(filteredJobs)
  }

  const handleFilterClick = () => {
    if (filter === 'status') handleFilterByStatus(filterValue)
  }

  return (
    <JobsView
      jobs={jobs}
      job={jobsStore.selectedJob}
      match={match}
      refreshJobs={refreshJobs}
      handleSelectJob={handleSelectJob}
      handleCancel={handleCancel}
      handleFilterClick={handleFilterClick}
      setFilter={setFilter}
      setFilterValue={setFilterValue}
      loading={loading}
    />
  )
}

Jobs.propTypes = {
  fetchJobs: PropTypes.func.isRequired,
  history: PropTypes.shape({}).isRequired,
  jobsStore: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  setJobs: PropTypes.func.isRequired,
  setSelectedJob: PropTypes.func.isRequired
}

export default connect(jobsStore => jobsStore, jobsActions)(Jobs)
