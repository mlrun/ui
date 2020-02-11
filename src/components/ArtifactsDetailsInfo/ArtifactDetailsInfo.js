import React from 'react'
import { formatDatetime } from '../../utils/index'
const ArtifactDetailsInfo = ({ artifact }) => {
  return (
    <>
      <div className="artifact_details_body">
        <div className="details_container">
          <div className="key_label">Key</div>
          <div className="key_value">{artifact.key}</div>
        </div>
        <div className="details_container">
          <div className="iter_label">Iter</div>
          <div className="iter_value">
            {artifact.iter !== undefined ? artifact.iter : 0}
          </div>
        </div>
        <div className="details_container">
          <div className="kind_label">Kind</div>
          <div className="kind_value">{artifact.kind}</div>
        </div>
        <div className="details_container">
          <div className="size_label">Size</div>
          <div className="size_value">{artifact.size}</div>
        </div>
        <div className="details_container">
          <div className="path_label">Path</div>
          <div className="path_value">{artifact.target_path}</div>
        </div>
        <div className="details_container">
          <div className="tree_label">Tree</div>
          <div className="tree_value">{artifact.tree}</div>
        </div>
        <div className="details_container">
          <div className="updated_label">Updated</div>
          <div className="updated_value">
            {formatDatetime(new Date(artifact.updated))}
          </div>
        </div>
        <div className="details_container">
          <div className="labels_label">Lables</div>
          <div className="labels_value">
            {artifact.labels.map((label, index) => {
              return (
                <div key={index} className="labels_container_item">
                  <span className="label">{label}</span>
                </div>
              )
            })}
          </div>
        </div>
        {artifact.producer && (
          <div className="details_container_producer">
            <h3>Producer</h3>
            <div className="producer_details_body">
              <div className="details_container">
                <div className="kind_label">Kind</div>
                <div className="kind_value">{artifact.producer.kind}</div>
              </div>
              <div className="details_container">
                <div className="name_label">Name</div>
                <div className="name_value">{artifact.producer.name}</div>
              </div>
              <div className="details_container">
                <div className="owner_label">Owner</div>
                <div className="owner_value">{artifact.producer.owner}</div>
              </div>
              <div className="details_container">
                <div className="uri_label">Uri</div>
                <div className="uri_value">{artifact.producer.uri}</div>
              </div>
              <div className="details_container">
                <div className="workflow_label">Workflow</div>
                <div className="workflow_value">
                  {artifact.producer.workflow}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default ArtifactDetailsInfo
