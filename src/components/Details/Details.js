import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { formatDatetime } from '../../utils'

import './details.scss'

import cancel from '../../images/cancel.png'
import DetailsMenuItem from '../../elements/DetailsMenuItem/DetailsMenuItem'
import DetailsInfo from '../DetailsInfo/DetailsInfo'
import DetailsInputs from '../DetailsInputs/DetailsInputs'

const Details = ({ item, handleCancel, match, detailsMenu, page }) => {
  return (
    <div className="table__item">
      <div className="table__item__header">
        <div className="table__item__header_data">
          <h3>{item.name || item.producer.name}</h3>
          <span>
            {formatDatetime(item.startTime)}{' '}
            {item.state && (
              <i
                className={item.state}
                title={`${item.state[0].toUpperCase()}${item.state.slice(1)}`}
              />
            )}
          </span>
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
            />
          ))}
        </ul>
      </div>
      {match.params.tab === 'info' && <DetailsInfo item={item} page={page} />}
      {match.params.tab === 'inputs' && <DetailsInputs inputs={item.inputs} />}
      {/*{match.params.tab === 'artifacts' && (*/}
      {/*  <JobInternalArtifacts job={job} setDownloadStatus={setDownloadStatus} />*/}
      {/*)}*/}
      {/*{match.params.tab === 'results' && <JobInternalResults job={job} />}*/}
      {/*{match.params.tab === 'logs' && <JobInternalLogs match={match} />}*/}
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
