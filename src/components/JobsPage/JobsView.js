import React from 'react'
import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import searchIcon from '../../images/search-icon.png'
import refreshIcon from '../../images/refresh.png'
import JobsTable from '../../elements/JobsTable/JobsTable'
import './jobs.scss'
import PropTypes from 'prop-types'

const JobsView = ({
  match,
  refreshJobs,
  jobs,
  job,
  handleSelectJob,
  handleCancel,
  handleFilterClick,
  setFilter,
  setFilterValue,
  loading
}) => (
  <>
    <div className="jobs__header">
      <Breadcrumbs match={match} onClick={handleCancel} />
    </div>
    <div className="jobs">
      <div className="jobs__menu">
        <ul className="jobs__menu__list">
          <li className="jobs__menu__list_item active">Monitor</li>
          {/*<li className="jobs__menu__list_item">Edit</li>*/}
          {/*<li className="jobs__menu__list_item">Create</li>*/}
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
            <select
              className="jobs__parameters__select status"
              onClick={e => {
                setFilterValue(e.target.value)
                setFilter('status')
              }}
            >
              <option>All</option>
              <option>Completed</option>
              <option>Running</option>
              <option>Failed</option>
            </select>
          </div>
          <button
            className="jobs__parameters__button_search"
            onClick={handleFilterClick}
          >
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
      <JobsTable
        jobs={jobs}
        handleSelectJob={handleSelectJob}
        job={job}
        handleCancel={handleCancel}
        loading={loading}
        match={match}
      />
    </div>
  </>
)

JobsView.defaultProps = {
  job: {}
}

JobsView.propTypes = {
  handleCancel: PropTypes.func.isRequired,
  handleFilterClick: PropTypes.func.isRequired,
  handleSelectJob: PropTypes.func.isRequired,
  job: PropTypes.shape({}),
  jobs: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  loading: PropTypes.bool.isRequired,
  match: PropTypes.shape({}).isRequired,
  refreshJobs: PropTypes.func.isRequired,
  setFilter: PropTypes.func.isRequired,
  setFilterValue: PropTypes.func.isRequired
}

export default JobsView
