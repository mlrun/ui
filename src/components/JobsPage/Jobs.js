import React, { useCallback, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import jobsActions from '../../actions/getJobs'
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import JobDetails from '../JobInternalPage/JobDetails'
import JobsTable from '../../elements/JobsTable/JobsTable'
import JobsList from '../../elements/JobsList'

import './jobs.scss'
import searchIcon from '../../images/search-icon.png'
import refreshIcon from '../../images/refresh.png'

const Jobs = ({ match, jobsStore, fetchJobs }) => {
  const jobId = match.params && match.params.jobId

  const [loading, setLoading] = useState(false)

  const refreshJobs = useCallback(
    noCahche => {
      if (noCahche || jobsStore.jobs.length === 0) {
        setLoading(true)
        fetchJobs()
      }
    },
    [fetchJobs, jobsStore.jobs.length]
  )

  useEffect(() => {
    refreshJobs()
  }, [refreshJobs])

  return (
    <>
      <div className="jobs__header">
        <Breadcrumbs match={match} />
      </div>
      <div className="jobs">
        <div className="jobs__menu">
          <ul className="jobs__menu__list">
            <li className="jobs__menu__list_item active">Monitor</li>
            <li className="jobs__menu__list_item">Edit</li>
            <li className="jobs__menu__list_item">Create</li>
          </ul>
        </div>
        <div className="jobs__parameters">
          <div className="jobs__parameters__filters">
            <div className="jobs__parameters__select_period">
              <select className="jobs__parameters__select">
                <option className="jobs__parameters_period">Last 7 days</option>
              </select>
            </div>
            <div className="jobs__parameters__select_group">
              <select className="jobs__parameters__select group">
                <option>Name</option>
                <option>None</option>
              </select>
            </div>
            <div className="jobs__parameters__select_status">
              <select className="jobs__parameters__select status">
                <option>All</option>
              </select>
            </div>
            <button className="jobs__parameters__button_search">
              <img src={searchIcon} alt="search icon" />
            </button>
          </div>
          <button
            className="jobs__parameters__button_refresh"
            onClick={refreshJobs}
          >
            <img src={refreshIcon} alt="refresh" />
          </button>
        </div>
        {jobId ? (
          <JobsList jobs={jobsStore.jobs} loading={loading} jobId={jobId} />
        ) : (
          <JobsTable jobs={jobsStore.jobs} />
        )}
        {jobId && <JobDetails />}
      </div>
    </>
  )
}

Jobs.propTypes = {
  fetchJobs: PropTypes.func.isRequired,
  history: PropTypes.shape({}).isRequired,
  jobsStore: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  setJobs: PropTypes.func.isRequired
}

export default connect(jobsStore => jobsStore, jobsActions)(Jobs)
