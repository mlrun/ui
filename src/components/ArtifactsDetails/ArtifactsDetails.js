import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { formatDatetime } from '../../utils/index'

import ArtifactDetailsTab from '../ArtifactsDetailsTab/ArtifactDetailsTab'

import cancel from '../../images/cancel.png'
import './artifactsdetails.scss'

const ArtifactsDetails = ({ artifact, match }) => {
  return artifact ? (
    <div className="artifact_details_container">
      <div className="artifact_wrapper_header">
        <div className="artifact_header">
          {`${artifact.key} / ${artifact.tree} / ${
            artifact.iter ? artifact.iter : 0
          }`}
          <div className="close_details_artifact">
            <Link to="/artifacts">
              <img src={cancel} alt="x" />
            </Link>
          </div>
        </div>
        <span>{formatDatetime(new Date(artifact.updated))}</span>
      </div>
      <div className="artifact_details_tab">
        <ArtifactDetailsTab match={match} artifact={artifact} />
      </div>
    </div>
  ) : null
}

ArtifactsDetails.propTypes = {
  artifact: PropTypes.shape({}).isRequired
}

export default ArtifactsDetails
