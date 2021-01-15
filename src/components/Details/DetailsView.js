import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classnames from 'classnames'

import DetailsMenuItem from '../../elements/DetailsMenuItem/DetailsMenuItem'
import Download from '../../common/Download/Download'
import TableActionsMenu from '../../common/TableActionsMenu/TableActionsMenu'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import Select from '../../common/Select/Select'
import PopUpDialog from '../../common/PopUpDialog/PopUpDialog'

import { formatDatetime } from '../../utils'
import {
  ARTIFACTS_PAGE,
  JOBS_PAGE,
  DETAILS_ARTIFACTS_TAB,
  FEATURE_SETS_TAB,
  FEATURE_STORE_PAGE,
  FILES_PAGE,
  MODELS_PAGE
} from '../../constants'
import { detailsActions } from '../DetailsInfo/detailsReducer'

import { ReactComponent as Close } from '../../images/close.svg'

const DetailsView = React.forwardRef(
  (
    {
      actionsMenu,
      applyChanges,
      cancelChanges,
      detailsDispatch,
      detailsMenu,
      detailsMenuClick,
      detailsState,
      handleCancel,
      handleShowWarning,
      leavePage,
      match,
      pageData,
      selectedItem,
      tabsContent
    },
    ref
  ) => {
    const detailsPanelClassNames = classnames(
      'table__item',
      detailsState.showWarning && 'pop-up-dialog-opened'
    )
    const applyChangesBtnClassNames = classnames(
      'btn_apply-changes',
      'btn_border-bottom',
      detailsState.changes.counter === 0 && 'btn_apply-changes_default'
    )

    return (
      <div className={detailsPanelClassNames} ref={ref}>
        <div className="item-header__data">
          <h3>{selectedItem.name || selectedItem.db_key}</h3>
          <span>
            {Object.keys(selectedItem).length > 0 && pageData.page === JOBS_PAGE
              ? formatDatetime(selectedItem?.startTime, 'Not yet started')
              : selectedItem?.updated
              ? formatDatetime(new Date(selectedItem?.updated), 'N/A')
              : ''}
            {selectedItem.state && pageData.page === JOBS_PAGE && (
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
          {pageData.page === FEATURE_STORE_PAGE && (
            <>
              <button
                onClick={cancelChanges}
                className="btn_cancel"
                disabled={detailsState.changes.counter === 0}
              >
                Cancel
              </button>
              {detailsState.changes.counter > 0 ? (
                <Tooltip
                  template={
                    <TextTooltipTemplate text={detailsState.changes.counter} />
                  }
                >
                  <button
                    onClick={applyChanges}
                    className={applyChangesBtnClassNames}
                    disabled={detailsState.changes.counter === 0}
                  >
                    Apply Changes
                  </button>
                </Tooltip>
              ) : (
                <button
                  onClick={applyChanges}
                  className={applyChangesBtnClassNames}
                  disabled={detailsState.changes.counter === 0}
                >
                  Apply Changes
                </button>
              )}
            </>
          )}
          {match.params.tab?.toUpperCase() === DETAILS_ARTIFACTS_TAB && (
            <Select
              key="Iteration"
              label="Iteration:"
              onClick={option => {
                detailsDispatch({
                  type: detailsActions.SET_ITERATION,
                  payload: option
                })
              }}
              options={detailsState.iterationOptions}
              selectedId={detailsState.iteration}
            />
          )}
          {(pageData.page === ARTIFACTS_PAGE ||
            pageData.page === FILES_PAGE ||
            pageData.page === MODELS_PAGE ||
            pageData.page === FEATURE_STORE_PAGE) &&
            match.params.pageTab !== FEATURE_SETS_TAB && (
              <Tooltip template={<TextTooltipTemplate text="Download" />}>
                <Download
                  fileName={selectedItem.db_key || selectedItem.key}
                  path={selectedItem.target_path?.path}
                  schema={selectedItem.target_path?.schema}
                  user={selectedItem.producer?.owner}
                />
              </Tooltip>
            )}
          <TableActionsMenu item={selectedItem} time={500} menu={actionsMenu} />
          <Link
            data-testid="details-close-btn"
            to={`/projects/${
              match.params.projectName
            }/${pageData.page.toLowerCase()}${
              match.params.pageTab ? `/${match.params.pageTab}` : ''
            }`}
            onClick={() => {
              if (detailsState.changes.counter > 0) {
                handleShowWarning(true)
              } else {
                handleCancel()
              }
            }}
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
              onClick={detailsMenuClick}
              page={pageData.page}
              tab={link}
            />
          ))}
        </ul>
        {tabsContent}
        {detailsState.showWarning && (
          <PopUpDialog
            headerText={`You have unsaved changes. ${
              detailsState.refreshWasHandled
                ? 'Refreshing the list'
                : 'Leaving this page'
            } will discard your changes.`}
            closePopUp={() => {
              handleShowWarning(false)
              detailsDispatch({
                type: detailsActions.SET_REFRESH_WAS_HANDLED,
                payload: false
              })
            }}
          >
            <div className="pop-up-dialog__footer-container">
              <button
                className="btn_default"
                onClick={() => {
                  handleShowWarning(false)
                  detailsDispatch({
                    type: detailsActions.SET_REFRESH_WAS_HANDLED,
                    payload: false
                  })
                }}
              >
                Don't Leave
              </button>
              <button
                className="pop-up-dialog__btn_cancel btn_primary btn_success"
                onClick={leavePage}
              >
                Leave
              </button>
            </div>
          </PopUpDialog>
        )}
      </div>
    )
  }
)

DetailsView.defaultProps = {
  detailsMenuClick: () => {},
  tabsContent: null
}

DetailsView.propTypes = {
  actionsMenu: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  applyChanges: PropTypes.func.isRequired,
  cancelChanges: PropTypes.func.isRequired,
  detailsDispatch: PropTypes.func.isRequired,
  detailsMenu: PropTypes.array.isRequired,
  detailsMenuClick: PropTypes.func,
  detailsState: PropTypes.shape({}).isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleShowWarning: PropTypes.func.isRequired,
  leavePage: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  pageData: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  tabsContent: PropTypes.element
}

export default DetailsView
