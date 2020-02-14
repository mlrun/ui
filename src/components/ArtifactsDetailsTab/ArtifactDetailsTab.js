import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import ArtifactDetailsInfo from '../ArtifactsDetailsInfo/ArtifactDetailsInfo'
import ArtifactsDetailsPreview from '../ArtifactsDetailsPreview/ArtifactsDetailsPreview'

const ArtifactDetailsTab = ({ match, artifact }) => {
  return (
    <div className="artifact_details_tab_container">
      <div className="tabs_container_menu">
        <Link
          className={match.params.tab === 'info' ? 'active' : null}
          to={`/projects/${match.params.projectName}/artifacts/${match.params.name}/info`}
        >
          Info
        </Link>
        <Link
          className={match.params.tab === 'preview' ? 'active' : null}
          to={`/projects/${match.params.projectName}/artifacts/${match.params.name}/preview`}
        >
          Preview
        </Link>
      </div>
      {match.params.tab === 'info' && (
        <ArtifactDetailsInfo artifact={artifact} />
      )}
      {match.params.tab === 'preview' && (
        <ArtifactsDetailsPreview artifact={artifact} />
      )}
    </div>
  )
}

ArtifactDetailsTab.propTypes = {
  match: PropTypes.shape({}).isRequired,
  artifact: PropTypes.shape({}).isRequired
}

export default ArtifactDetailsTab
