import React from 'react'
import PropTypes from 'prop-types'
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
      size: item.size ? prettyBytes(item.size) : 'N/A',
      date: formatDatetime(jobsStore.selectedJob.startTime)
    }
  })

  const handleClick = (e, schema, path) => {
    const viewedBlocks = document.getElementsByClassName('view')
    if (viewedBlocks.length > 0) {
      viewedBlocks[0].classList.remove('view')
    }
    e.persist()
    getArtifacts(schema, path).then(() => {
      e.target.parentNode.classList.add('view')
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
                    <a
                      href={`http://13.58.34.174:30080/api/files?${
                        item.target_path.schema
                          ? `schema=${item.target_path.schema}&`
                          : ''
                      }path=${item.target_path.path}`}
                      download
                    >
                      <img src={downloadIcon} alt="Download" />
                    </a>
                  </button>
                </td>
              </tr>,
              <tr className="jobs__table__item_artifacts__preview" key={i + 1}>
                {jobsStore.artifacts.data &&
                  jobsStore.artifacts.type === 'table' && (
                    <td colSpan={5}>
                      <table>
                        <tbody>
                          <tr>
                            {jobsStore.artifacts.data.headers.map(header => {
                              return <td key={header}>{header}</td>
                            })}
                          </tr>
                          {jobsStore.artifacts.data.content.map(item => (
                            <tr key={item + Math.random()}>
                              {typeof item === typeof '' ? (
                                <td>{item}</td>
                              ) : (
                                item.map(value => (
                                  <td key={value + Math.random()}>{value}</td>
                                ))
                              )}
                            </tr>
                          ))}
                        </tbody>
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
                {jobsStore.artifacts.data &&
                  jobsStore.artifacts.type === 'html' && (
                    <td colSpan={5}>
                      <iframe
                        srcDoc={jobsStore.artifacts.data.content}
                        frameBorder="0"
                        title="Preview"
                      />
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
