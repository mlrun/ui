import React from 'react'
import PropTypes from 'prop-types'

import ChipCell from '../ChipCell/ChipCell'

import { formatDatetime } from '../../utils'
import { cutChips } from '../../utils/cutChips'

const JobInternalInfo = ({ job, handleShowElements }) => {
  const parameters = cutChips(job.parameters, 8, handleShowElements)
  return (
    <div>
      <ul className="jobs__table__item_details">
        <li className="jobs__table__item_details_item">
          <div className="jobs__table__item_details_item_header">UID</div>
          <div className="jobs__table__item_details_item_data">{job.uid}</div>
        </li>
        <li className="jobs__table__item_details_item">
          <div className="jobs__table__item_details_item_header">
            Started at
          </div>
          <div className="jobs__table__item_details_item_data">
            {formatDatetime(job.startTime)}
          </div>
        </li>
        <li className="jobs__table__item_details_item">
          <div className="jobs__table__item_details_item_header">Status</div>
          <div className="jobs__table__item_details_item_data">
            {job.state[0].toUpperCase() + job.state.slice(1)}
            <i className={job.state} />
          </div>
        </li>
        <li className="jobs__table__item_details_item">
          <div className="jobs__table__item_details_item_header">
            Parameters
          </div>
          <div className="jobs__table__item_details_item_data">
            {
              <ChipCell
                elements={parameters}
                className="jobs__table__item_details_item_data__parameters"
              />
            }
          </div>
        </li>
        <li className="jobs__table__item_details_item">
          <div className="jobs__table__item_details_item_header">Labels</div>
          <div className="jobs__table__item_details_item_data">
            {job.labels.map(item => (
              <span
                key={item}
                className="jobs__table__item_details_item_data__labels"
              >
                {item}
              </span>
            ))}
          </div>
        </li>
        <li className="jobs__table__item_details_item">
          <div className="jobs__table__item_details_item_header">Log level</div>
          <div className="jobs__table__item_details_item_data">
            {job.logLevel}
          </div>
        </li>
        <li className="jobs__table__item_details_item">
          <div className="jobs__table__item_details_item_header">
            Output path
          </div>
          <div className="jobs__table__item_details_item_data">
            {job.outputPath}
          </div>
        </li>
        <li className="jobs__table__item_details_item">
          <div className="jobs__table__item_details_item_header">
            Iterations
          </div>
          <div className="jobs__table__item_details_item_data">
            {job.iterations.length === 0
              ? job.iterations.length
              : job.iterations}
          </div>
        </li>
      </ul>
    </div>
  )
}

JobInternalInfo.propTypes = {
  job: PropTypes.shape({}).isRequired,
  handleShowElements: PropTypes.func.isRequired
}

export default JobInternalInfo
