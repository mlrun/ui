import React from 'react'
import Tooltip from '../ArtifactsTooltip/Tooltip'
import { truncateUid, formatDatetime } from '../../utils'

const templateArifacts = item => {
  const labels = item.labels.map((label, index) => {
    return (
      <div key={index} className="labels_container_item">
        <span className="label">{label}</span>
      </div>
    )
  })

  return (
    <>
      <div className="column_path">
        <div className="path_container">
          <div className="path_container_item">
            <span>{item.target_path}</span>
          </div>
        </div>
      </div>
      <div className="column_type">
        <div className="type_container">
          <div className="type_container_item">{item.kind}</div>
        </div>
      </div>
      <div className="column_labels">
        <div className="labels_container">{labels}</div>
      </div>
      <div className="column_producer">
        <div className="producer_container">
          <div className="producer_container_item">
            <Tooltip
              kind={item.producer.kind}
              owner={item.producer.owner}
              to={`/jobs/${item.producer.uri}`}
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
