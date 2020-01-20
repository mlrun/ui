import React from 'react'
import { capitalize } from 'lodash'
import PropTypes from 'prop-types'

const JobInternalResults = ({ job }) => {
  let headers = (job.iterationStats[0] || []).map(item => {
    let head = capitalize(String(item).replace(/^.+\./, ''))
    return head
  })
  const changedHeaders = [headers[1], headers[0]]
  headers = changedHeaders.concat(headers.slice(2))
  let items = job.iterationStats.slice(1)
  items = items.map(item => {
    const changedItems = [item[1], item[0]]
    return changedItems.concat(item.slice(2))
  })
  return (
    <div className="jobs__table__item_results">
      {job.iterationStats && (
        <table className="jobs__table__item_results__table">
          <thead>
            <tr>
              {headers.map((item, i) => (
                <th key={i}>{item}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                {item.map((value, i) => {
                  if (typeof value === typeof '') {
                    return (
                      <td key={value + '' + i}>
                        <i className={value} />
                      </td>
                    )
                  } else {
                    return <td key={value + '' + i}>{value}</td>
                  }
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

JobInternalResults.propTypes = {
  job: PropTypes.shape({}).isRequired
}

export default JobInternalResults
