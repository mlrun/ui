import React from 'react'
import { Link } from 'react-router-dom'
import ArtifactDetailsInfo from '../ArtifactsDetailsInfo/ArtifactDetailsInfo'
import ArtifactsDetailsPreview from '../ArtifactsDetailsPreview/ArtifactsDetailsPreview'

const ArtifactDetailsTab = ({ match, artifact }) => {
  return (
    <div className="artifact_details_tab_container">
      <div className="tabs_container_menu">
        <Link
          className={match.params.tab === 'info' ? 'active' : null}
          to={`/artifacts/${match.params.name}/${match.params.artifactId}/${match.params.iter}/info`}
        >
          Info
        </Link>
        <Link
          className={match.params.tab === 'preview' ? 'active' : null}
          to={`/artifacts/${match.params.name}/${match.params.artifactId}/${match.params.iter}/preview`}
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

export default ArtifactDetailsTab
