import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import prettyBytes from 'pretty-bytes'
import { connect } from 'react-redux'

import jobsActions from '../../actions/jobs'
import { formatDatetime } from '../../utils'

import downloadIcon from '../../images/download-icon.png'

const JobInternalArtifacts = ({ jobsStore, getArtifacts }) => {
  const items = jobsStore.selectedJob.artifacts.map(item => {
    const index = item.target_path.indexOf('://')
    const target_path = {
      schema: item.target_path.includes('://')
        ? item.target_path.slice(0, index)
        : null,
      path: item.target_path.includes('://')
        ? item.target_path.slice(index + '://'.length)
        : item.target_path
    }
    return {
      key: item.key,
      target_path: target_path,
      size: prettyBytes(item.size),
      date: formatDatetime(jobsStore.selectedJob.startTime)
    }
  })

  const handleClick = (e, schema, path) => {
    e.persist()
    getArtifacts(schema, path).then(() => {
      e.target
        .closest('.jobs__table__item_artifacts__table_item')
        .classList.add('view')
    })
  }

  return (
    <div className="jobs__table__item_artifacts">
      <table>
        <tbody>
          {items.map((item, i) => {
            return [
              <tr key={i} className="jobs__table__item_artifacts__table_item">
                <td
                  onClick={e =>
                    handleClick(
                      e,
                      item.target_path.schema,
                      item.target_path.path
                    )
                  }
                >
                  {item.key}
                </td>
                <td>
                  {item.target_path.schema && (
                    <p>schema: {item.target_path.schema}</p>
                  )}
                  path: {item.target_path.path}
                </td>
                <td>size: {item.size}</td>
                <td>{item.date}</td>
                <td>
                  <button>
                    <Link
                      to="/"
                      target="_blank"
                      download={`/files?${
                        item.target_path.schema
                          ? `schema=${item.target_path.schema}`
                          : ''
                      }&path=${item.target_path.path}`}
                    >
                      <img src={downloadIcon} alt="Download" />
                    </Link>
                  </button>
                </td>
              </tr>,
              <tr className="jobs__table__item_artifacts__preview" key={i + 1}>
                {jobsStore.artifacts.data &&
                  jobsStore.artifacts.data.type === 'table' && (
                    <td>
                      <table>
                        <tr>
                          {jobsStore.artifacts.data.headers.map(header => (
                            <td key={header}>{header}</td>
                          ))}
                        </tr>
                        {jobsStore.artifacts.data.content.map(item => (
                          <tr
                            key={item + Math.random()}
                            className="jobs__table__item_artifacts__preview"
                          >
                            {item.map(value => (
                              <td key={value + Math.random()}>{value}</td>
                            ))}
                          </tr>
                        ))}
                      </table>
                    </td>
                  )}
                {jobsStore.artifacts.data &&
                  jobsStore.artifacts.type === 'text' && (
                    <td
                      className="jobs__table__item_artifacts__preview_text"
                      colSpan={5}
                    >
                      {jobsStore.artifacts.data.content}
                    </td>
                  )}
              </tr>
            ]
          })}
        </tbody>
      </table>
    </div>
  )
}

JobInternalArtifacts.propTypes = {
  getArtifacts: PropTypes.func.isRequired,
  jobsStore: PropTypes.shape({}).isRequired
}

export default connect(
  jobsStore => jobsStore,
  jobsActions
)(JobInternalArtifacts)
