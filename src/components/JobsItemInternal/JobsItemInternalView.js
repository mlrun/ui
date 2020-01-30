import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { formatDatetime } from '../../utils'
import JobInternalInfo from '../../elements/JobInternalInfo/JobInternalInfo'
import JobInternalInputs from '../../elements/JobInternalInputs/JobInternalInputs'
import JobInternalResults from '../../elements/JobInternalResults/JobInternalResults'
import JobInternalLogs from '../../elements/JobInternalLogs/JobInternalLogs'
import JobInternalArtifacts from '../../elements/JobInternalArtifacts/JobInternalArtifacts'

import './jobItemInternal.scss'
import cancel from '../../images/job-details-cancel.png'

const JobsItemInternalView = ({
  job,
  handleCancel,
  handleMenuClick,
  handleShowElements,
  match
}) => (
  <div className="jobs__table__item">
    <div className="jobs__table__item__header">
      <div className="jobs__table__item__header_data">
        <h3>{job.name}</h3>
        <span>
          {formatDatetime(job.startTime)}{' '}
          <i
            className={job.state}
            title={job.state[0].toUpperCase() + job.state.slice(1)}
          />
        </span>
      </div>
      <div className="jobs__table__item__header_buttons">
        <Link to="/jobs" onClick={handleCancel}>
          <img src={cancel} alt="cancel" />
        </Link>
      </div>
    </div>
    <div>
      <ul className="jobs__table__item__menu">
        <li className="jobs__table__item__menu_item active" id="info">
          <Link to={`/jobs/${job.uid}/info`} onClick={handleMenuClick}>
            Info
          </Link>
        </li>
        <li className="jobs__table__item__menu_item" id="inputs">
          <Link to={`/jobs/${job.uid}/inputs`} onClick={handleMenuClick}>
            Inputs
          </Link>
        </li>
        <li className="jobs__table__item__menu_item" id="artifacts">
          <Link to={`/jobs/${job.uid}/artifacts`} onClick={handleMenuClick}>
            Artifacts
          </Link>
        </li>
        <li className="jobs__table__item__menu_item" id="results">
          <Link to={`/jobs/${job.uid}/results`} onClick={handleMenuClick}>
            Results
          </Link>
        </li>
        <li className="jobs__table__item__menu_item" id="logs">
          <Link to={`/jobs/${job.uid}/logs`} onClick={handleMenuClick}>
            Logs
          </Link>
        </li>
      </ul>
    </div>
    {match.params.tab === 'info' && (
      <JobInternalInfo job={job} handleShowElements={handleShowElements} />
    )}
    {match.params.tab === 'inputs' && <JobInternalInputs job={job} />}
    {match.params.tab === 'artifacts' && <JobInternalArtifacts job={job} />}
    {match.params.tab === 'results' && <JobInternalResults job={job} />}
    {match.params.tab === 'logs' && <JobInternalLogs />}
  </div>
)

JobsItemInternalView.propTypes = {
  job: PropTypes.shape({}).isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleMenuClick: PropTypes.func.isRequired,
  handleShowElements: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired
}

export default JobsItemInternalView
