import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { formatDatetime } from '../../utils'

import JobInternalInfo from '../JobInternalInfo/JobInternalInfo'
import JobInternalInputs from '../JobInternalInputs/JobInternalInputs'
import JobInternalResults from '../JobInternalResults/JobInternalResults'
import JobInternalLogs from '../JobInternalLogs/JobInternalLogs'
import JobInternalArtifacts from '../JobInternalArtifacts/JobInternalArtifacts'

import './jobItemInternal.scss'

import cancel from '../../images/cancel.png'

const JobsItemInternalView = ({
  job,
  handleCancel,
  handleMenuClick,
  handleShowElements,
  match,
  setDownloadStatus
}) => (
  <div className="jobs__table__item">
    <div className="jobs__table__item__header">
      <div className="jobs__table__item__header_data">
        <h3>{job.name}</h3>
        <span>
          {formatDatetime(job.startTime)}{' '}
          <i
            className={job.state}
            title={`${job.state[0].toUpperCase()}${job.state.slice(1)}`}
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
        <Link to={`/jobs/${job.uid}/info`} onClick={handleMenuClick}>
          <li className="jobs__table__item__menu_item active" id="info">
            Info
          </li>
        </Link>
        <Link to={`/jobs/${job.uid}/inputs`} onClick={handleMenuClick}>
          <li className="jobs__table__item__menu_item" id="inputs">
            Inputs
          </li>
        </Link>
        <Link to={`/jobs/${job.uid}/artifacts`} onClick={handleMenuClick}>
          <li className="jobs__table__item__menu_item" id="artifacts">
            Artifacts
          </li>
        </Link>
        <Link to={`/jobs/${job.uid}/results`} onClick={handleMenuClick}>
          <li className="jobs__table__item__menu_item" id="results">
            Results
          </li>
        </Link>
        <Link to={`/jobs/${job.uid}/logs`} onClick={handleMenuClick}>
          <li className="jobs__table__item__menu_item" id="logs">
            Logs
          </li>
        </Link>
      </ul>
    </div>
    {match.params.tab === 'info' && (
      <JobInternalInfo job={job} handleShowElements={handleShowElements} />
    )}
    {match.params.tab === 'inputs' && <JobInternalInputs job={job} />}
    {match.params.tab === 'artifacts' && (
      <JobInternalArtifacts job={job} setDownloadStatus={setDownloadStatus} />
    )}
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
