import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { formatDatetime } from '../../utils'
import JobInternalInfo from '../../elements/JobInternalInfo/JobInternalInfo'
import JobInternalInputs from '../../elements/JobInternalInputs/JobInternalInputs'
import JobInternalResults from '../../elements/JobInternalResults/JobInternalResults'

import './jobItemInternal.scss'
import cancel from '../../images/job-details-cancel.png'

const JobsItemInternalView = ({ job, handleCancel, view, handleMenuClick }) => (
  <div className="jobs__table__item">
    <div className="jobs__table__item__header">
      <div className="jobs__table__item__header_data">
        <h3>{job.name}</h3>
        <span>
          {formatDatetime(job.startTime)} <i className={job.state} />
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
        <li
          className="jobs__table__item__menu_item active"
          onClick={e => handleMenuClick(e, 'Info')}
        >
          Info
        </li>
        <li
          className="jobs__table__item__menu_item"
          onClick={e => handleMenuClick(e, 'Inputs')}
        >
          Inputs
        </li>
        <li
          className="jobs__table__item__menu_item"
          onClick={e => handleMenuClick(e, 'Artifacts')}
        >
          Artifacts
        </li>
        <li
          className="jobs__table__item__menu_item"
          onClick={e => handleMenuClick(e, 'Results')}
        >
          Results
        </li>
        <li
          className="jobs__table__item__menu_item"
          onClick={e => handleMenuClick(e, 'Logs')}
        >
          Logs
        </li>
      </ul>
    </div>
    {view === 'Info' && <JobInternalInfo job={job} />}
    {view === 'Inputs' && <JobInternalInputs job={job} />}
    {view === 'Results' && <JobInternalResults job={job} />}
  </div>
)

JobsItemInternalView.propTypes = {
  job: PropTypes.shape({}).isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleMenuClick: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired
}

export default JobsItemInternalView
