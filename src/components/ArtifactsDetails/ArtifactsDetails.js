import React from 'react'
import PropTypes from 'prop-types'
import { formatDatetime } from '../../utils/index'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import cancel from '../../images/job-details-cancel.png'
import './artifactsdetails.scss'

const ArtifactsDetails = ({ artifacts, match }) => {
  const { name, artifactId, iter } = match.params
  const artifact = artifacts
    .reduce((prev, curr) => {
      let flatArray = curr.tree.reduce((prev, curr) => {
        return [...prev, ...curr]
      }, [])
      return [...prev, ...flatArray]
    }, [])
    .filter(artifact => {
      if (artifact.iter !== undefined) {
        return (
          artifact.key === name &&
          artifact.tree === artifactId &&
          artifact.iter === parseInt(iter)
        )
      } else {
        return artifact.key === name && artifact.tree === artifactId
      }
    })[0]

  return artifact ? (
    <div className="artifact_details_container">
      <div className="artifact_wrapper_header">
        <div className="artifact_header">
          {`${artifact.key} / ${artifact.tree} / ${
            artifact.iter ? artifact.iter : 0
          }`}
          <Link to="/artifacts">
            <img src={cancel} alt="X" />
          </Link>
        </div>
        <span>{formatDatetime(new Date(artifact.updated))}</span>
      </div>
      <div className="artifact_details_body">
        <div className="details_container">
          <div className="key_label">Key</div>
          <div className="key_value">{artifact.key}</div>
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
              <div className="workflow_value">{artifact.producer.workflow}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null
}

const mapStateToProps = state => {
  return {
    artifacts: state.artifactsStore.artifacts
  }
}

ArtifactsDetails.propTypes = {
  artifacts: PropTypes.array.isRequired,
  match: PropTypes.shape({
    name: PropTypes.string,
    artifactId: PropTypes.string,
    iter: PropTypes.string
  }).isRequired
}

export default connect(mapStateToProps)(ArtifactsDetails)
