import React from 'react'
import PropTypes from 'prop-types'

import downloadIcon from '../../images/download-icon.png'

const JobInternalArtifactsView = ({ items, handleClick, artifacts }) => (
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
              {artifacts.data && artifacts.type === 'table' && (
                <td colSpan={5}>
                  <table>
                    <tbody>
                      <tr>
                        {artifacts.data.headers.map(header => {
                          return <td key={header}>{header}</td>
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
  artifacts: PropTypes.shape({}).isRequired
}

export default JobInternalArtifactsView
