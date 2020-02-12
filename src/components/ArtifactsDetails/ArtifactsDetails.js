import React from 'react'
import PropTypes from 'prop-types'
import { formatDatetime } from '../../utils/index'
import cancel from '../../images/job-details-cancel.png'
import './artifactsdetails.scss'
import ArtifactDetailsTab from '../ArtifactsDetailsTab/ArtifactDetailsTab'
import { Link } from 'react-router-dom'
import Download from '../../common/Download/Download'

const ArtifactsDetails = ({ artifact, match }) => {
  return artifact ? (
    <div className="artifact_details_container">
      <div className="artifact_wrapper_header">
        <div className="artifact_header">
          {artifact.key}
          <div className="close_details_artifact">
            <Link to="/artifacts">
              <img src={cancel} alt="cancel" />
            </Link>
          </div>
        </div>
        <div className="wrapper_updated_download">
          <span>{formatDatetime(new Date(artifact.updated))}</span>
          <Download path={artifact.target_path}></Download>
        </div>
      </div>
      <div className="artifact_details_tab">
        <ArtifactDetailsTab
          match={match}
          artifact={artifact}
        ></ArtifactDetailsTab>
      </div>
    </div>
  ) : null
}

ArtifactsDetails.propTypes = {
  artifact: PropTypes.shape({}).isRequired
}

export default ArtifactsDetails
