import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
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
import { ARTIFACTS_PAGE } from '../../constants'

import './details.scss'

import cancel from '../../images/cancel.png'
import popout from '../../images/popout.png'
import DetailsCode from '../DetailsCode/DetailsCode'

const Details = ({
  detailsMenu,
  handleCancel,
  handleSelectItem,
  handleShowElements,
  item,
  match,
  page,
  toggleConvertToYaml
}) => {
  const history = useHistory()

  const handlePreview = () => {
    history.push(`/projects/${match.params.projectName}/artifacts`)
    handleSelectItem(item, true)
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
    <div className="table__item">
      <div className="item-header">
        <div className="item-header__data">
          <h3>{item.name || item.key}</h3>
          <span>
            {Object.keys(item).length > 0 &&
              formatDatetime(item.startTime || new Date(item.updated))}
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
          {page === ARTIFACTS_PAGE && (
            <>
              <Download
                path={item.target_path.path}
                schema={item.target_path.schema}
              />
              <ActionsMenu
                toggleConvertToYaml={toggleConvertToYaml}
                item={item}
                time={500}
              />
            </>
          )}
          <Link
            to={`/projects/${match.params.projectName}/${page.toLowerCase()}`}
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
              name={item.key || item.name}
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
      {match.params.tab === 'artifacts' && (
        <DetailsArtifacts match={match} selectedItem={item} />
      )}
      {match.params.tab === 'results' && <DetailsResults job={item} />}
      {match.params.tab === 'logs' && <DetailsLogs match={match} item={item} />}
      {match.params.tab === 'code' && (
        <DetailsCode code={item.functionSourceCode} />
      )}
      {match.params.tab === 'metadata' && item.schema && (
        <ArtifactInfoMetadata item={item} />
      )}
    </div>
  )
}

Details.defaultProps = {
  item: {}
}

Details.propTypes = {
  detailsMenu: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleShowElements: PropTypes.func.isRequired,
  item: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  page: PropTypes.string.isRequired,
  toggleConvertToYaml: PropTypes.func.isRequired
}

export default Details
