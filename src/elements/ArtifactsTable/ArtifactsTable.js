import React from 'react'
import PropTypes from 'prop-types'
import ArtifactsDetails from '../../components/ArtifactsDetails/ArtifactsDetails'
import ArtifactsTableBody from '../../components/ArtifactsTableBody/ArtifactsTableBody'
import './artifactstable.scss'

const ArtifactsTable = ({ match, artifacts, selectArtifact }) => {
  return (
    <div className="table_container">
      <div className="table">
        <div className="table_header">
          <div className="table_header_container">
            <div className="table_header_name">Name</div>
            <div className="table_header_path">Path</div>
            <div className="table_header_type">Type</div>
            <div className="table_header_labels">Labels</div>
            <div className="table_header_producer">Producer</div>
            <div className="table_header_hash">Hash</div>
            <div className="table_header_updated_at">Updated at</div>
            <div className="table_header_download"></div>
          </div>
        </div>
        <div className="table_body">
          {artifacts.map((artifact, index) => {
            let item = null
            if (artifact.link_iteration) {
              let { link_iteration } = artifact.link_iteration
              item = artifact.data.filter(
                item => item.iter === link_iteration
              )[0]
            } else {
              item = artifact.data[0]
            }
            return (
              <div
                key={item.hash + index || item.tree + index}
                className="table_body_item"
              >
                <ArtifactsTableBody item={item} match={match} />
              </div>
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
