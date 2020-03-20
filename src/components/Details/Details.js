import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'

import DetailsMenuItem from '../../elements/DetailsMenuItem/DetailsMenuItem'
import DetailsInfo from '../DetailsInfo/DetailsInfo'
import DetailsInputs from '../DetailsInputs/DetailsInputs'
import DetailsLogs from '../DetailsLogs/DetailsLogs'
import DetailsArtifacts from '../DetailsArtifacts/DetailsArtifacts'
import DetailsResults from '../DetailsResults/DetailsResults'
import Download from '../../common/Download/Download'
import ArtifactsPreview from '../ArtifactsPreview/ArtifactsPreview'
import ActionsMenu from '../../common/ActionsMenu/ActionsMenu'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import ArtifactInfoMetadata from '../ArtifactInfoMetadata/ArtifactInfoMetada'

import { formatDatetime } from '../../utils'
import artifactsAction from '../../actions/artifacts'

import './details.scss'

import cancel from '../../images/cancel.png'
import popout from '../../images/popout.png'

const Details = ({
  detailsMenu,
  handleCancel,
  handleShowElements,
  hideChips,
  item,
  match,
  page,
  convertToYaml
}) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const handlePreview = () => {
    history.push(`/projects/${match.params.projectName}/artifacts`)
    dispatch(
      artifactsAction.selectArtifact({
        isPreview: true,
        item
      })
    )
  }

  useEffect(() => {
    if (match.params.tab === 'metadata' && item.schema === undefined) {
      history.push(
        `/projects/${match.params.projectName}/artifacts/${match.params.name}/info`
      )
    }
  }, [
    history,
    item.schema,
    match.params.name,
    match.params.projectName,
    match.params.tab
  ])

  return (
    <div className="table__item" onClick={hideChips}>
      <div className="item-header">
        <div className="item-header__data">
          <h3>{item.name || item.key}</h3>
          <span>
            {formatDatetime(item.startTime)}
            {item.state && (
              <Tooltip
                template={
                  <TextTooltipTemplate
                    text={`${item.state[0].toUpperCase()}${item.state.slice(
                      1
                    )}`}
                  />
                }
              >
                <i className={item.state} />
              </Tooltip>
            )}
          </span>
        </div>
        <div className="item-header__buttons">
          {page === 'artifacts' && (
            <>
              <Download
                path={item.target_path.path}
                schema={item.target_path.schema}
              />
              <ActionsMenu
                convertToYaml={convertToYaml}
                item={item}
                time={500}
              />
            </>
          )}
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
              key={link}
              id={item.uid}
              match={match}
              name={item.key}
              page={page}
              tab={link}
            />
          ))}
          {item.schema && (
            <DetailsMenuItem
              id={item.uid}
              match={match}
              name={item.key}
              page={page}
              tab={'metadata'}
            />
          )}
        </ul>
      </div>
      {match.params.tab === 'info' && (
        <DetailsInfo
          handleShowElements={handleShowElements}
          item={item}
          page={page}
        />
      )}
      {match.params.tab === 'preview' && (
        <div className="preview_container">
          <button onClick={() => handlePreview()} className="preview_popout">
            <img src={popout} alt="preview" />
          </button>
          <ArtifactsPreview artifact={item} />
        </div>
      )}
      {match.params.tab === 'inputs' && <DetailsInputs inputs={item.inputs} />}
      {match.params.tab === 'artifacts' && <DetailsArtifacts match={match} />}
      {match.params.tab === 'results' && <DetailsResults job={item} />}
      {match.params.tab === 'logs' && <DetailsLogs match={match} />}
      {match.params.tab === 'metadata' && item.schema && (
        <ArtifactInfoMetadata item={item} />
      )}
    </div>
  )
}

Details.propTypes = {
  detailsMenu: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleShowElements: PropTypes.func.isRequired,
  hideChips: PropTypes.func.isRequired,
  item: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  page: PropTypes.string.isRequired
}

export default Details
