import React from 'react'
import PropTypes from 'prop-types'

import JobInternalResults from '../JobInternalResults/JobInternalResults'
import ProgressRing from '../../common/ProgressRing/ProgressRing'

import downloadIcon from '../../images/download-icon.png'
import arrow from '../../images/arrow.png'

const JobInternalArtifactsView = ({
  items,
  handleClick,
  artifacts,
  handleDownloadClick,
  progress
}) => (
  <div className="jobs__table__item_artifacts">
    <table>
      <tbody>
        {items.map((item, i) => {
          return [
            <tr key={i} className="jobs__table__item_artifacts__table_item">
              <td
                onClick={e =>
                  handleClick(e, item.target_path.schema, item.target_path.path)
                }
              >
                <img src={arrow} alt="Arrow icon" className="arrow" />
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
                <button
                  onClick={() =>
                    handleDownloadClick(
                      item.target_path.schema,
                      item.target_path.path
                    )
                  }
                >
                  {progress > 0 ? (
                    <ProgressRing
                      radius="20"
                      stroke="1"
                      progress={progress}
                      textX={20}
                      textY={16}
                      color="#50B1E7"
                    />
                  ) : (
                    <img src={downloadIcon} alt="Download" />
                  )}
                </button>
              </td>
            </tr>,
            <tr className="jobs__table__item_artifacts__preview" key={i + 1}>
              {artifacts.type && artifacts.type === 'table-results' && (
                <td colSpan={5}>
                  <JobInternalResults job={artifacts} />
                </td>
              )}
              {artifacts.type && artifacts.type === 'table' && (
                <td colSpan={5}>
                  <table>
                    <tbody>
                      <tr>
                        {artifacts.data.headers.map(header => {
                          return (
                            <td key={header}>
                              {header[0].toUpperCase() + header.slice(1)}
                            </td>
                          )
                        })}
                      </tr>
                      {artifacts.data.content.map(item => (
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
              {artifacts.data && artifacts.type === 'text' && (
                <td
                  className="jobs__table__item_artifacts__preview_text"
                  colSpan={5}
                >
                  {artifacts.data.content}
                </td>
              )}
              {artifacts.data && artifacts.type === 'html' && (
                <td colSpan={5}>
                  <iframe
                    srcDoc={artifacts.data.content}
                    frameBorder="0"
                    title="Preview"
                  />
                </td>
              )}
              {artifacts.data && artifacts.type === 'json' && (
                <td colSpan={5}>
                  <pre>
                    <code>{artifacts.data.content}</code>
                  </pre>
                </td>
              )}
              {artifacts.data && artifacts.type === 'image' && (
                <td colSpan={5}>
                  <img src={artifacts.data.content} alt="Preview" />
                </td>
              )}
              {artifacts.type && artifacts.type === 'unknown' && (
                <td colSpan={5}>No preview</td>
              )}
            </tr>
          ]
        })}
      </tbody>
    </table>
  </div>
)

JobInternalArtifactsView.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleClick: PropTypes.func.isRequired,
  artifacts: PropTypes.shape({}).isRequired,
  handleDownloadClick: PropTypes.func.isRequired,
  progress: PropTypes.number.isRequired
}

export default JobInternalArtifactsView
