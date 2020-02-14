import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import Tooltip from '../ArtifactsTooltip/Tooltip'
import Download from '../../common/Download/Download'
import actionArtifact from '../../actions/artifacts'
import ActionsMenu from '../../common/ActionsMenu/ActionsMenu'
import YAML from 'yamljs'
import { truncateUid, formatDatetime } from '../../utils'
import { Link } from 'react-router-dom'
import { parseKeyValues } from '../../utils'
import { useDispatch } from 'react-redux'
import YamlModal from '../../common/YamlModal/YamlModal'
const ArtifactsTableBody = ({ item, match }) => {
  const dispatch = useDispatch()
  const [isShowYamlButton, setShowYamButtom] = useState(false)
  const [showYamlModal, setShowYamlModal] = useState(false)
  const ref = useRef(null)

  const handlerActionMenu = e => {
    setShowYamlModal(true)
  }

  const handlerModelClose = () => {
    setShowYamButtom(false)
  }

  const handlerMouseEnter = e => {
    if (
      !e.target.classList.value.includes('yaml_modal') &&
      e.target.classList.value.length !== 0
    ) {
      setShowYamButtom(!isShowYamlButton)
    }
  }
  const handlerMouseLeave = e => {
    if (
      !e.target.classList.value.includes('yaml_modal') &&
      e.target.classList.value.length !== 0
    ) {
      setShowYamButtom(false)
    }
  }

  return (
    <div
      className="table_body_item"
      ref={ref}
      onMouseEnter={handlerMouseEnter}
      onMouseLeave={handlerMouseLeave}
    >
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
      {isShowYamlButton && (
        <div className="column_yaml_button">
          <ActionsMenu
            convertToYaml={handlerActionMenu}
            item={YAML.stringify(item)}
          />
        </div>
      )}
      {showYamlModal && (
        <YamlModal
          convertedYaml={YAML.stringify(item)}
          close={handlerModelClose}
        />
      )}
    </div>
  )
}

ArtifactsTableBody.propTypes = {
  item: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired
}

export default ArtifactsTableBody
