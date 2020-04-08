import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import DetailsMenuItem from '../../elements/DetailsMenuItem/DetailsMenuItem'
import DetailsInfo from '../DetailsInfo/DetailsInfo'
import DetailsInputs from '../DetailsInputs/DetailsInputs'
import DetailsLogs from '../DetailsLogs/DetailsLogs'
import DetailsArtifacts from '../DetailsArtifacts/DetailsArtifacts'
import DetailsResults from '../DetailsResults/DetailsResults'
import Download from '../../common/Download/Download'
import ArtifactsPreview from '../ArtifactsPreview/ArtifactsPreview'
import TableActionsMenu from '../../common/TableActionsMenu/TableActionsMenu'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import ArtifactInfoMetadata from '../ArtifactInfoMetadata/ArtifactInfoMetada'
import DetailsCode from '../DetailsCode/DetailsCode'

import { formatDatetime } from '../../utils'
import { ARTIFACTS_PAGE } from '../../constants'

import { ReactComponent as Close } from '../../images/close.svg'
import { ReactComponent as Popout } from '../../images/popout.svg'

const DetailsView = ({
  item,
  page,
  toggleConvertToYaml,
  match,
  handleCancel,
  detailsMenu,
  handlePreview
}) => (
  <div className="table__item">
    <div className="item-header">
      <div className="item-header__data">
        <h3>{item.name || item.db_key}</h3>
        <span>
          {Object.keys(item).length > 0 &&
            formatDatetime(item.startTime || new Date(item.updated))}
          {item.state && (
            <Tooltip
              template={
                <TextTooltipTemplate
                  text={`${item.state[0].toUpperCase()}${item.state.slice(1)}`}
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
          <Download
            path={item.target_path.path}
            schema={item.target_path.schema}
          />
        )}
        <TableActionsMenu
          toggleConvertToYaml={toggleConvertToYaml}
          item={item}
          time={500}
        />
        <Link
          to={`/projects/${match.params.projectName}/${page.toLowerCase()}`}
          onClick={handleCancel}
        >
          <Close />
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
            name={item.db_key || item.name}
            hash={item.hash}
            page={page}
            tab={link}
          />
        ))}
        {item.schema && (
          <DetailsMenuItem
            id={item.uid}
            match={match}
            name={item.db_key}
            page={page}
            tab={'metadata'}
          />
        )}
      </ul>
    </div>
    {match.params.tab === 'info' && (
      <DetailsInfo match={match} item={item} page={page} />
    )}
    {match.params.tab === 'preview' && (
      <div className="preview_container">
        <button onClick={() => handlePreview()} className="preview_popout">
          <Popout />
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

DetailsView.propTypes = {
  item: PropTypes.shape({}).isRequired,
  page: PropTypes.string.isRequired,
  toggleConvertToYaml: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  handleCancel: PropTypes.func.isRequired,
  detailsMenu: PropTypes.array.isRequired,
  handlePreview: PropTypes.func.isRequired
}

export default DetailsView
