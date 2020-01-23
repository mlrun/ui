import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import JobsItemInternal from '../../components/JobsItemInternal/JobsItemInternal'
import Loader from '../../common/Loader/Loader'
import ChipCell from '../ChipCell/ChipCell'

import { formatDatetime, truncateUid } from '../../utils'
import { cutChips } from '../../utils/cutChips'

import './jobs-table.scss'

const JobsTable = ({ jobs, handleSelectJob, job, handleCancel, loading }) => {
  const handleShowElements = e => {
    if (
      e.target.className === 'jobs__table_body__results' ||
      e.target.className === 'jobs__table_body__parameters'
    ) {
      const parentBlock = e.target.closest('.jobs__table_body__chips__block')
      parentBlock.classList.contains('showChips')
        ? parentBlock.classList.remove('showChips')
        : parentBlock.classList.add('showChips')
    }
  }

  const hideChips = e => {
    if (
      e.target.className !== 'jobs__table_body__results' &&
      e.target.className !== 'jobs__table_body__parameters'
    ) {
      const block = document.getElementsByClassName(
        'jobs__table_body__chips__block showChips'
      )[0]
      if (block) {
        document
          .getElementsByClassName('jobs__table_body__chips__block showChips')[0]
          .classList.remove('showChips')
      }
    }
  }

  return (
    <div className="jobs__table" onClick={hideChips}>
      {loading && <Loader />}
      <div className={job.uid && 'jobs__table__item_opened'}>
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
              item.showedParameters = cutChips(
                item.parameters,
                2,
                handleShowElements
              )
              item.showedResults = cutChips(
                item.resultsChips,
                2,
                handleShowElements
              )
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
                    <i
                      className={item.state}
                      title={item.state[0].toUpperCase() + item.state.slice(1)}
                    />
                  </td>
                  <td className="jobs__table_body__chips_cell">
                    <ChipCell
                      elements={item.showedParameters}
                      className="jobs__table_body__parameters"
                    />
                  </td>
                  <td className="jobs__table_body__chips_cell">
                    <ChipCell
                      className="jobs__table_body__results"
                      elements={item.showedResults}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {job.uid && (
        <JobsItemInternal
          job={job}
          handleCancel={handleCancel}
          handleShowElements={handleShowElements}
        />
      )}
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
