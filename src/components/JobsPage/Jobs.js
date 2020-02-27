import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import yaml from 'js-yaml'

import jobsActions from '../../actions/jobs'
import jobsData from './jobsData'
import createJobsContent from '../../utils/createJobsContent'

import Content from '../../layout/Content/Content'

const Jobs = ({ fetchJobs, jobsStore, match, setSelectedJob, history }) => {
  const [convertedYaml, setConvertedYaml] = useState()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [stateFilter, setStateFilter] = useState('All')
  const tableContent = createJobsContent(jobs)

  const refreshJobs = useCallback(
    noCahche => {
      setJobs([])
      setLoading(true)
      setSelectedJob({})
      history.push(`/projects/${match.params.projectName}/jobs`)
      fetchJobs(
        match.params.projectName,
        stateFilter !== 'All' ? stateFilter : false
      )
        .then(jobs => {
          return setJobs(jobs)
        })
        .then(() => setLoading(false))
    },
    [fetchJobs, history, match.params.projectName, setSelectedJob, stateFilter]
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
    const jobJson = jobsStore.jobsData.filter(
      job => job.metadata.uid === item.uid
    )
    setConvertedYaml(
      yaml.safeDump(jobJson, {
        lineWidth: 1000
      })
    )
  }

  return (
    <Content
      content={jobs}
      convertToYaml={convertToYaml}
      convertedYaml={convertedYaml}
      detailsMenu={jobsData.detailsMenu}
      filters={jobsData.filters}
      handleCancel={handleCancel}
      handleSelectItem={handleSelectJob}
      loading={loading}
      match={match}
      page={jobsData.page}
      selectedItem={jobsStore.selectedJob}
      refresh={refreshJobs}
      tableHeaders={jobsData.tableHeaders}
      tableContent={tableContent}
      stateFilter={stateFilter}
      setStateFilter={setStateFilter}
    />
  )
}

Jobs.propTypes = {
  fetchJobs: PropTypes.func.isRequired,
  jobsStore: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  setSelectedJob: PropTypes.func.isRequired
}

export default connect(jobsStore => jobsStore, jobsActions)(Jobs)
