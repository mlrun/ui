import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import yaml from 'js-yaml'
import jobsActions from '../../actions/jobs'
import jobsData from './jobsData'
import createJobsContent from '../../utils/createJobsContent'

import Content from '../../layout/Content/Content'

const Jobs = ({ match, jobsStore, fetchJobs, setSelectedJob }) => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [convertedYaml, setConvertedYaml] = useState()
  const tableContent = createJobsContent(jobs)

  const refreshJobs = useCallback(
    noCahche => {
      setSelectedJob({})
      if (noCahche || jobsStore.jobs.length === 0) {
        setLoading(true)
        fetchJobs(match.params.projectName)
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
    setConvertedYaml(yaml.safeDump(jobJson))
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
      filters={jobsData.filters}
      tableHeaders={jobsData.tableHeaders}
      tableContent={tableContent}
      detailsMenu={jobsData.detailsMenu}
      page={'jobs'}
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
