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
  actionsMenu,
  detailsMenu,
  handleCancel,
  handlePreview,
  match,
  page,
  selectedItem
}) => {
  console.log(selectedItem.db_key)
  return (
    <div className="table-item">
      <div className="item-header">
        <div className="item-header__data">
          <h3>{selectedItem.name || selectedItem.db_key}</h3>
          <span>
            {Object.keys(selectedItem).length > 0 &&
              formatDatetime(
                selectedItem.startTime || new Date(selectedItem.updated)
              )}
            {selectedItem.state && (
              <Tooltip
                template={
                  <TextTooltipTemplate
                    text={`${selectedItem.state[0].toUpperCase()}${selectedItem.state.slice(
                      1
                    )}`}
                  />
                }
              >
                <i className={selectedItem.state} />
              </Tooltip>
            )}
          </span>
        </div>
        <div className="item-header__buttons">
          {page === ARTIFACTS_PAGE && (
            <Download
              path={selectedItem.target_path.path}
              schema={selectedItem.target_path.schema}
            />
          )}
          <TableActionsMenu item={selectedItem} time={500} menu={actionsMenu} />
          <Link
            to={`/projects/${match.params.projectName}/${page.toLowerCase()}`}
            onClick={handleCancel}
          >
            <Close />
          </Link>
        </div>
      </div>
      <div>
        <ul className="table-item__menu">
          {detailsMenu.map(link => (
            <DetailsMenuItem
              hash={selectedItem.hash}
              id={selectedItem.uid}
              key={link}
              match={match}
              name={selectedItem.db_key || selectedItem.name}
              page={page}
              tab={link}
            />
          ))}
        </ul>
      </div>
      {match.params.tab === 'info' && (
        <DetailsInfo match={match} item={selectedItem} page={page} />
      )}
      {match.params.tab === 'preview' && (
        <div className="preview_container">
          <button onClick={() => handlePreview()} className="preview_popout">
            <Popout />
          </button>
          <ArtifactsPreview artifact={selectedItem} />
        </div>
      )}
      {match.params.tab === 'inputs' && (
        <DetailsInputs inputs={selectedItem.inputs} />
      )}
      {match.params.tab === 'artifacts' && (
        <DetailsArtifacts match={match} selectedItem={selectedItem} />
      )}
      {match.params.tab === 'results' && <DetailsResults job={selectedItem} />}
      {match.params.tab === 'logs' && (
        <DetailsLogs match={match} item={selectedItem} />
      )}
      {match.params.tab === 'code' && (
        <DetailsCode code={selectedItem.functionSourceCode} />
      )}
      {match.params.tab === 'metadata' && selectedItem.schema && (
        <ArtifactInfoMetadata item={selectedItem} />
      )}
    </div>
  )
}

DetailsView.propTypes = {
  actionsMenu: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  detailsMenu: PropTypes.array.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handlePreview: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  page: PropTypes.string.isRequired,
  selectedItem: PropTypes.shape({}).isRequired
}

export default DetailsView
