import React from 'react'
import { Link } from 'react-router-dom'
import ArtifactDetailsInfo from '../ArtifactsDetailsInfo/ArtifactDetailsInfo'

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
      </div>
      {(match.params.tab === 'info' || match.params.tab === undefined) && (
        <ArtifactDetailsInfo artifact={artifact} />
      )}
    </div>
  )
}

export default ArtifactDetailsTab
