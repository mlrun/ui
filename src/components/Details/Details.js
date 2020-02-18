import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { formatDatetime } from '../../utils'

// import JobInternalInfo from '../JobInternalInfo/JobInternalInfo'
// import JobInternalInputs from '../JobInternalInputs/JobInternalInputs'
// import JobInternalResults from '../JobInternalResults/JobInternalResults'
// import JobInternalLogs from '../JobInternalLogs/JobInternalLogs'
// import JobInternalArtifacts from '../JobInternalArtifacts/JobInternalArtifacts'

import './details.scss'

import cancel from '../../images/cancel.png'
import DetailsMenuItem from '../../elements/DetailsMenuItem/DetailsMenuItem'

const Details = ({ item, handleCancel, match, detailsMenu }) => {
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
            to={`/projects/${match.params.projectName}/jobs`}
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
              page={'jobs'}
              tab={link}
            />
          ))}
        </ul>
      </div>
      {/*{match.params.tab === 'info' && <JobInternalInfo job={job} />}*/}
      {/*{match.params.tab === 'inputs' && <JobInternalInputs job={job} />}*/}
      {/*{match.params.tab === 'artifacts' && (*/}
      {/*  <JobInternalArtifacts job={job} setDownloadStatus={setDownloadStatus} />*/}
      {/*)}*/}
      {/*{match.params.tab === 'results' && <JobInternalResults job={job} />}*/}
      {/*{match.params.tab === 'logs' && <JobInternalLogs match={match} />}*/}
    </div>
  )
}

Details.propTypes = {
  job: PropTypes.shape({}).isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleMenuClick: PropTypes.func.isRequired,
  handleShowElements: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired
}

export default Details
