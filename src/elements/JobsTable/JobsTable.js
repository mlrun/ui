import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import JobsItemInternal from '../../components/JobsItemInternal/JobsItemInternal'
import Loader from '../../common/Loader/Loader'

import { formatDatetime, truncateUid } from '../../utils'

import './jobs-table.scss'

const JobsTable = ({ jobs, handleSelectJob, job, handleCancel, loading }) => {
  return (
    <div className="jobs__table">
      {loading && <Loader />}
      <table>
        <thead className="jobs__table_head">
          <tr>
            <th>Name</th>
            <th>UID</th>
            <th>Started at</th>
            <th>Status</th>
            <th>Parameters</th>
            <th>Results</th>
          </tr>
        </thead>
        <tbody className="jobs__table_body">
          {jobs.map((item, i) => {
            if (item.parameters.length > 2) {
              let cuttedElemets = '+' + (item.parameters.length - 2)
              item.parameters = item.parameters.slice(0, 2)
              item.parameters.push(cuttedElemets)
            }
            return (
              <tr key={item + i}>
                <td>
                  <Link
                    to={`/jobs/${item.uid}`}
                    onClick={() => handleSelectJob(item)}
                  >
                    {item.name}
                  </Link>
                </td>
                <td>
                  <span title={item.uid}>{truncateUid(item.uid)}</span>
                </td>
                <td>{formatDatetime(item.startTime)}</td>
                <td>
                  <i className={item.state} />
                </td>
                <td style={{ maxWidth: '250px', overflow: 'auto' }}>
                  <div>
                    {item.parameters.map(item => (
                      <span key={item} className="jobs__table_body__parameters">
                        {item}
                      </span>
                    ))}
                  </div>
                </td>
                <td style={{ maxWidth: '250px' }}>
                  <div>
                    {item.resultsChips.map(item => (
                      <span key={item} className="jobs__table_body__results">
                        {item}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {job.uid && <JobsItemInternal job={job} handleCancel={handleCancel} />}
    </div>
  )
}

JobsTable.defaultProps = {
  job: {},
  jobs: []
}

JobsTable.propTypes = {
  handleCancel: PropTypes.func.isRequired,
  handleSelectJob: PropTypes.func.isRequired,
  job: PropTypes.shape({}),
  jobs: PropTypes.arrayOf(PropTypes.shape({})),
  loading: PropTypes.bool.isRequired
}

export default JobsTable
