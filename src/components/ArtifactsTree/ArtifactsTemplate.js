import React from 'react'
import Tooltip from '../ArtifactsTooltip/Tooltip'
import { truncateUid, formatDatetime } from '../../utils'

const templateArifacts = item => {
  return (
    <>
      <div className="column_path">
        <div className="path_container">
          <div className="path_container_item">
            <div
              className="path_container_value"
              title={item.target_path.length > 60 ? item.target_path : null}
            >
              {item.target_path}
            </div>
          </div>
        </div>
      </div>
      <div className="column_type">
        <div className="type_container">
          <div className="type_container_item">{item.kind}</div>
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
            <Tooltip
              kind={item.producer.kind}
              owner={item.producer.owner}
              to={`/jobs/${item.producer.uri}/info`}
              name={item.producer.name}
            />
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
    </>
  )
}

export default templateArifacts
