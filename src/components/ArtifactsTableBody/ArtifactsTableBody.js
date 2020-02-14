import React from 'react'
import PropTypes from 'prop-types'
import Tooltip from '../ArtifactsTooltip/Tooltip'
import Download from '../../common/Download/Download'
import actionArtifact from '../../actions/artifacts'
import { truncateUid, formatDatetime } from '../../utils'
import { Link } from 'react-router-dom'
import { parseKeyValues } from '../../utils'
import { useDispatch } from 'react-redux'

const ArtifactsTableBody = ({ item, match }) => {
  const dispatch = useDispatch()
  return (
    <>
      <div className="column_name">
        <div className="column_name_item">
          <Link
            to={`/projects/${match.params.projectName}/artifacts/${item.key}/${
              match.params.tab ? match.params.tab : 'info'
            }`}
            onClick={() => dispatch(actionArtifact.selectArtifact(item))}
          >
            {item.key}
          </Link>
        </div>
      </div>
      <div className="column_path">
        <div className="path_container">
          <div className="path_container_item">
            <div className="path_container_value" title={item.target_path}>
              {item.target_path}
            </div>
          </div>
        </div>
      </div>
      <div className="column_type">
        <div className="type_container">
          <div className="type_container_item">{item.kind}</div>
        </div>
      </div>
      <div className="column_labels">
        <div className="labels_container">
          {item.labels &&
            parseKeyValues(item.labels).map((label, index) => {
              return (
                <div key={index} className="labels_container_item">
                  <span className="label" title={label}>
                    {label}
                  </span>
                </div>
              )
            })}
        </div>
      </div>
      <div className="column_producer">
        <div className="producer_container">
          <div className="producer_container_item">
            <Tooltip
              kind={item.producer.kind}
              owner={item.producer.owner ? item.producer.owner : ''}
              to={`/jobs/${item.producer.uri}/info`}
              name={item.producer.name}
            />
          </div>
        </div>
      </div>
      <div className="column_hash">
        <div className="hash_container" title={item.hash}>
          <div className="hash_container_item">{truncateUid(item.hash)}</div>
        </div>
      </div>
      <div className="column_updated_at">
        <div className="updated_at_container">
          <div className="updated_at_container_item">
            {formatDatetime(new Date(item.updated))}
          </div>
        </div>
      </div>
      <div className="column_download">
        <Download path={item.target_path} />
      </div>
    </>
  )
}

ArtifactsTableBody.propTypes = {
  item: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired
}

export default ArtifactsTableBody
