import React from 'react'
import PropTypes from 'prop-types'
import ArtifactsTree from '../../components/ArtifactsTree/ArtifactsTree'
import ArtifactsDetails from '../../components/ArtifactsDetails/ArtifactsDetails'
import './artifactstable.scss'

const ArtifactsTable = ({ match, artifacts, selectArtifact }) => {
  return (
    <div className="table_container">
      <div className="table">
        <div className="table_header">
          <div className="table_header_container">
            <div className="table_header_name">Name/Tree/Iter</div>
            <div className="table_header_path">Path</div>
            <div className="table_header_type">Type</div>
            <div className="table_header_labels">Labels</div>
            <div className="table_header_producer">Producer</div>
            <div className="table_header_hash">Hash</div>
            <div className="table_header_started_at">Started at</div>
          </div>
        </div>
        <div className="table_body">
          {artifacts.map(artifacts => {
            return (
              <ArtifactsTree
                key={artifacts.key}
                items={artifacts}
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
  match: PropTypes.shape({}).isRequired
}

export default ArtifactsTable
