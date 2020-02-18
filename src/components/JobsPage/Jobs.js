import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import YAML from 'yamljs'

import jobsActions from '../../actions/jobs'

import Content from '../../layout/Content/Content'
import { formatDatetime, truncateUid } from '../../utils'

const Jobs = ({ match, jobsStore, fetchJobs, setSelectedJob }) => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [convertedYaml, setConvertedYaml] = useState()
  const tableHeaders = [
    {
      header: 'Name',
      size: 'jobs_medium'
    },
    {
      header: 'UID',
      size: 'jobs_small'
    },
    {
      header: 'Started at',
      size: 'jobs_small'
    },
    {
      header: 'Status',
      size: 'jobs_small'
    },
    {
      header: 'Parameters',
      size: 'jobs_big'
    },
    {
      header: 'Results',
      size: 'jobs_big'
    }
  ]

  const tableContent = jobs.map(job => ({
    name: {
      value: job.name,
      size: 'jobs_medium'
    },
    uid: {
      value: truncateUid(job.uid),
      size: 'jobs_small'
    },
    startTime: {
      value: formatDatetime(job.startTime),
      size: 'jobs_small'
    },
    state: {
      value: job.state,
      size: 'jobs_small',
      type: 'state'
    },
    parameters: {
      value: job.parameters,
      size: 'jobs_big',
      type: 'parameters'
    },
    resultsChips: {
      value: job.resultsChips,
      size: 'jobs_big',
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

  const convertToYaml = item => {
    document.getElementById('yaml_modal').style.display = 'flex'
    const jobJson = item
    delete jobJson.showedParameters
    delete jobJson.showedResults
    setConvertedYaml(YAML.stringify(jobJson))
  }

  return (
    <Content
      content={jobs}
      selectedItem={jobsStore.selectedJob}
      match={match}
      refresh={refreshJobs}
      handleSelectItem={handleSelectJob}
      handleCancel={handleCancel}
      loading={loading}
      convertedYaml={convertedYaml}
      convertToYaml={convertToYaml}
      filters={['period', 'status']}
      tableHeaders={tableHeaders}
      tableContent={tableContent}
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
