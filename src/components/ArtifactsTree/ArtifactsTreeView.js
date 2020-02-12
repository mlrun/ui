import React from 'react'
import Tooltip from '../ArtifactsTooltip/Tooltip'
import { truncateUid, formatDatetime } from '../../utils'
import Download from '../../common/Download/Download'

const ArtifactsTreeView = item => {
  const index = item.target_path.indexOf('://')
  const schema = item.target_path.includes('://')
    ? item.target_path.slice(0, index)
    : null
  const path = item.target_path.includes('://')
    ? item.target_path.slice(index + '://'.length)
    : item.target_path
  return (
    <>
      <div className="column_path">
        <div className="path_container">
          <div className="path_container_item">
            <div className="path_container_value" title={item.target_path}>
              schema: {schema} <br />
              path: {path}
            </div>
          </div>
        </div>
      </div>
      <div className="column_type">
        <div className="type_container">
          <div className="type_container_item">{item.kind && item.kind}</div>
        </div>
      </div>
      <div className="column_labels">
        <div className="labels_container">
          {item.labels.map((label, index) => {
            return (
              <div key={index} className="labels_container_item" title={label}>
                <span className="label">{label}</span>
              </div>
            )
          })}
        </div>
      </div>
      <div className="column_producer">
        <div className="producer_container">
          <div className="producer_container_item">
            {item.producer && (
              <Tooltip
                kind={item.producer.kind}
                owner={item.producer.owner}
                to={`/jobs/${item.producer.uri}/info`}
                name={item.producer.name}
              />
            )}
          </div>
        </div>
      </div>
      <div className="column_hash">
        <div className="hash_container" title={item.hash}>
          <div className="hash_container_item">{truncateUid(item.hash)}</div>
        </div>
      </div>
      <div className="column_started_at">
        <div className="started_at_container">
          <div className="started_at_container_item">
            {formatDatetime(new Date(item.updated))}
          </div>
        </div>
      </div>
      <div className="column_download">
        <Download path={path} schema={schema} />
      </div>
    </>
  )
}

export default ArtifactsTreeView
