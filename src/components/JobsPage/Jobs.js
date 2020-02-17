import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import YAML from 'yamljs'

import jobsActions from '../../actions/jobs'

import Content from '../../layout/Content/Content'
import { formatDatetime, truncateUid } from '../../utils'

const Jobs = ({ match, jobsStore, fetchJobs, setSelectedJob }) => {
  const [jobs, setJobs] = useState([])
  const [filter, setFilter] = useState('')
  const [filterValue, setFilterValue] = useState('')
  const [loading, setLoading] = useState(true)
  const [convertedYaml, setConvertedYaml] = useState()
  const tableHeaders = [
    {
      header: 'Name',
      size: 'medium'
    },
    {
      header: 'UID',
      size: 'small'
    },
    {
      header: 'Started at',
      size: 'small'
    },
    {
      header: 'Status',
      size: 'small'
    },
    {
      header: 'Parameters',
      size: 'big'
    },
    {
      header: 'Results',
      size: 'big'
    }
  ]

  const tableContent = jobs.map(job => ({
    name: {
      value: job.name,
      size: 'medium'
    },
    uid: {
      value: truncateUid(job.uid),
      size: 'small'
    },
    startTime: {
      value: formatDatetime(job.startTime),
      size: 'small'
    },
    state: {
      value: job.state,
      size: 'small',
      type: 'state'
    },
    parameters: {
      value: job.parameters,
      size: 'big',
      type: 'parameters'
    },
    resultsChips: {
      value: job.resultsChips,
      size: 'big',
      type: 'results'
    }
  }))

  const refreshJobs = useCallback(
    noCahche => {
      setSelectedJob({})
      if (noCahche || jobsStore.jobs.length === 0) {
        setLoading(true)
        fetchJobs()
          .then(jobs => {
            return setJobs(jobs)
          })
          .then(() => setLoading(false))
      } else if (jobsStore.jobs.length > 0 && !noCahche) {
        setJobs(jobsStore.jobs)
        setLoading(false)
      }
    },
    [fetchJobs, jobsStore.jobs, setSelectedJob]
  )

  useEffect(() => {
    refreshJobs()
  }, [refreshJobs])

  useEffect(() => {
    if (match.params.jobId) {
      let item = jobsStore.jobs.find(item => item.uid === match.params.jobId)
      setSelectedJob(item)
    }
  }, [jobsStore.jobs, match.params, setSelectedJob])

  const handleSelectJob = item => {
    if (document.getElementsByClassName('view')[0]) {
      document.getElementsByClassName('view')[0].classList.remove('view')
    }
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
    let filteredJobs = jobsStore.jobs.filter(
      item => item.state === filter.toLowerCase()
    )
    setJobs(filteredJobs)
  }

  const handleFilterClick = () => {
    if (filter === 'status') handleFilterByStatus(filterValue)
  }

  const convertToYaml = item => {
    document.getElementById('yaml_modal').style.display = 'flex'
    const jobJson = item
    delete jobJson.showedParameters
    delete jobJson.showedResults
    setConvertedYaml(YAML.stringify(jobJson))
  }

  return (
    <Content
      tableContent={tableContent}
      jobs={jobs}
      selectedItem={jobsStore.selectedJob}
      match={match}
      refresh={refreshJobs}
      handleSelectJob={handleSelectJob}
      handleCancel={handleCancel}
      handleFilterClick={handleFilterClick}
      setFilter={setFilter}
      setFilterValue={setFilterValue}
      loading={loading}
      convertedYaml={convertedYaml}
      convertToYaml={convertToYaml}
      tableHeaders={tableHeaders}
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
