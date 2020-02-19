import React from 'react'
import PropTypes from 'prop-types'
import ArtifactsDetails from '../../components/ArtifactsDetails/ArtifactsDetails'
import ArtifactsTableBody from '../../components/ArtifactsTableBody/ArtifactsTableBody'
import './artifactstable.scss'

const ArtifactsTable = ({ match, artifacts, selectArtifact }) => {
  return (
    <div className="table_container">
      <div className="table">
        <div className="table_body">
          {artifacts.map((artifact, index) => {
            return (
              <ArtifactsTableBody
                key={artifact.hash + index || artifact.tree + index}
                item={artifact}
                match={match}
              />
            )
          })}
        </div>
        {Object.keys(selectArtifact).length !== 0 && (
          <ArtifactsDetails artifact={selectArtifact} match={match} />
        )}
      </div>
    </div>
  )
}

ArtifactsTable.propTypes = {
  artifacts: PropTypes.array.isRequired,
  match: PropTypes.shape({}).isRequired,
  selectArtifact: PropTypes.shape({})
}

export default ArtifactsTable
