import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import DetailsMenuItem from '../../elements/DetailsMenuItem/DetailsMenuItem'
import DetailsInfo from '../DetailsInfo/DetailsInfo'
import DetailsInputs from '../DetailsInputs/DetailsInputs'
import DetailsLogs from '../DetailsLogs/DetailsLogs'

import { formatDatetime } from '../../utils'

import './details.scss'

import cancel from '../../images/cancel.png'
import DetailsArtifacts from '../DetailsArtifacts/DetailsArtifacts'
import DetailsResults from '../DetailsResults/DetailsResults'
import Download from '../../common/Download/Download'
import ArtifactsPreview from '../ArtifactsPreview/ArtifactsPreview'

const Details = ({
  item,
  handleCancel,
  match,
  detailsMenu,
  page,
  handleShowElements,
  hideChips
}) => {
  return (
    <div className="table__item" onClick={hideChips}>
      <div className="table__item__header">
        <div className="table__item__header_data">
          <h3>{item.name || item.key}</h3>
          {page === 'jobs' ? (
            <span>
              {formatDatetime(item.startTime)}
              {item.state && (
                <i
                  className={item.state}
                  title={`${item.state[0].toUpperCase()}${item.state.slice(1)}`}
                />
              )}
            </span>
          ) : (
            <span>
              {formatDatetime(new Date(item.updated))}
              <Download
                path={item.target_path.path}
                schema={item.target_path.schema}
              />
            </span>
          )}
        </div>
        <div className="table__item__header_buttons">
          <Link
            to={`/projects/${match.params.projectName}/${page}`}
            onClick={handleCancel}
          >
            <img src={cancel} alt="cancel" />
          </Link>
        </div>
      </div>
      <div>
        <ul className="table__item__menu">
          {detailsMenu.map(link => (
            <DetailsMenuItem
              match={match}
              id={item.uid}
              page={page}
              tab={link}
              key={link}
              name={item.key}
            />
          ))}
        </ul>
      </div>
      {match.params.tab === 'info' && (
        <DetailsInfo
          item={item}
          page={page}
          handleShowElements={handleShowElements}
        />
      )}
      {match.params.tab === 'preview' && <ArtifactsPreview artifact={item} />}
      {match.params.tab === 'inputs' && <DetailsInputs inputs={item.inputs} />}
      {match.params.tab === 'artifacts' && <DetailsArtifacts />}
      {match.params.tab === 'results' && <DetailsResults job={item} />}
      {match.params.tab === 'logs' && <DetailsLogs match={match} />}
    </div>
  )
}

Details.propTypes = {
  item: PropTypes.shape({}).isRequired,
  handleCancel: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  detailsMenu: PropTypes.arrayOf(PropTypes.string).isRequired,
  page: PropTypes.string.isRequired
}

export default Details
