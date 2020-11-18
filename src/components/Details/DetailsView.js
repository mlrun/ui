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
import TableActionsMenu from '../../common/TableActionsMenu/TableActionsMenu'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import ArtifactInfoMetadata from '../ArtifactInfoMetadata/ArtifactInfoMetada'
import DetailsCode from '../DetailsCode/DetailsCode'
import DetailsPreview from '../DetailsPreview/DetailsPreview'
import DetailsAnalysis from '../DetailsAnalysis/DetailsAnalysis'
import Select from '../../common/Select/Select'

import { formatDatetime } from '../../utils'
import {
  ARTIFACTS_PAGE,
  JOBS_PAGE,
  DETAILS_ARTIFACTS_TAB,
  DETAILS_INFO_TAB,
  DETAILS_PREVIEW_TAB,
  DETAILS_INPUTS_TAB,
  DETAILS_RESULTS_TAB,
  DETAILS_LOGS_TAB,
  DETAILS_CODE_TAB,
  DETAILS_METADATA_TAB,
  DETAILS_ANALYSIS_TAB
} from '../../constants'

import { ReactComponent as Close } from '../../images/close.svg'

const DetailsView = ({
  actionsMenu,
  detailsMenu,
  handleCancel,
  handlePreview,
  iteration,
  iterationOptions,
  match,
  pageData,
  selectedItem,
  setIteration,
  setIterationOptions
}) => {
  return (
    <div className="table__item">
      <div className="item-header__data">
        <h3>{selectedItem.name || selectedItem.db_key}</h3>
        <span>
          {Object.keys(selectedItem).length > 0 && pageData.page === JOBS_PAGE
            ? formatDatetime(selectedItem?.startTime, 'Not yet started')
            : formatDatetime(new Date(selectedItem?.updated), 'N/A')}
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
        {match.params.tab?.toUpperCase() === DETAILS_ARTIFACTS_TAB && (
          <Select
            options={iterationOptions}
            label="Iteration:"
            key="Iteration"
            selectedId={iteration}
            onClick={setIteration}
          />
        )}
        {pageData.page === ARTIFACTS_PAGE && (
          <Tooltip template={<TextTooltipTemplate text="Download" />}>
            <Download
              fileName={selectedItem.db_key || selectedItem.key}
              path={selectedItem.target_path.path}
              schema={selectedItem.target_path.schema}
              user={selectedItem.producer?.owner}
            />
          </Tooltip>
        )}
        <TableActionsMenu item={selectedItem} time={500} menu={actionsMenu} />
        <Link
          data-testid="details-close-btn"
          to={`/projects/${match.params.projectName}/${
            pageData.pageKind ? pageData.pageKind : pageData.page.toLowerCase()
          }${match.params.pageTab ? `/${match.params.pageTab}` : ''}`}
          onClick={handleCancel}
        >
          <Close />
        </Link>
      </div>
      <ul className="item-menu">
        {detailsMenu.map(link => (
          <DetailsMenuItem
            hash={selectedItem.hash}
            id={pageData.page === JOBS_PAGE ? selectedItem.uid : ''}
            key={link}
            match={match}
            name={selectedItem.db_key || selectedItem.name}
            page={pageData.pageKind ? pageData.pageKind : pageData.page}
            tab={link}
          />
        ))}
      </ul>
      {match.params.tab?.toUpperCase() === DETAILS_INFO_TAB && (
        <DetailsInfo
          match={match}
          selectedItem={selectedItem}
          pageData={pageData}
        />
      )}
      {match.params.tab?.toUpperCase() === DETAILS_PREVIEW_TAB && (
        <DetailsPreview artifact={selectedItem} handlePreview={handlePreview} />
      )}
      {match.params.tab?.toUpperCase() === DETAILS_INPUTS_TAB && (
        <DetailsInputs inputs={selectedItem.inputs} />
      )}
      {match.params.tab?.toUpperCase() === DETAILS_ARTIFACTS_TAB && (
        <DetailsArtifacts
          iteration={iteration}
          match={match}
          selectedItem={selectedItem}
          setIterationOptions={setIterationOptions}
        />
      )}
      {match.params.tab?.toUpperCase() === DETAILS_RESULTS_TAB && (
        <DetailsResults job={selectedItem} />
      )}
      {match.params.tab?.toUpperCase() === DETAILS_LOGS_TAB && (
        <DetailsLogs match={match} item={selectedItem} />
      )}
      {match.params.tab?.toUpperCase() === DETAILS_CODE_TAB && (
        <DetailsCode code={selectedItem.functionSourceCode} />
      )}
      {match.params.tab?.toUpperCase() === DETAILS_METADATA_TAB &&
        selectedItem.schema && (
          <ArtifactInfoMetadata selectedItem={selectedItem} />
        )}
      {match.params.tab?.toUpperCase() === DETAILS_ANALYSIS_TAB &&
        selectedItem.kind === 'dataset' &&
        selectedItem.extra_data && (
          <DetailsAnalysis
            artifact={selectedItem}
            handlePreview={handlePreview}
          />
        )}
    </div>
  )
}

DetailsView.propTypes = {
  actionsMenu: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  detailsMenu: PropTypes.array.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handlePreview: PropTypes.func.isRequired,
  iteration: PropTypes.string.isRequired,
  iterationOptions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  match: PropTypes.shape({}).isRequired,
  pageData: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  setIteration: PropTypes.func.isRequired,
  setIterationOptions: PropTypes.func.isRequired
}

export default DetailsView
