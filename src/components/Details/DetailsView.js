import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { capitalize } from 'lodash'
import classnames from 'classnames'
import { isEmpty } from 'lodash'

import DetailsMenuItem from '../../elements/DetailsMenuItem/DetailsMenuItem'
import Download from '../../common/Download/Download'
import ActionsMenu from '../../common/ActionsMenu/ActionsMenu'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import Select from '../../common/Select/Select'
import PopUpDialog from '../../common/PopUpDialog/PopUpDialog'
import Button from '../../common/Button/Button'
import LoadButton from '../../common/LoadButton/LoadButton'
import Loader from '../../common/Loader/Loader'
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage'

import { formatDatetime } from '../../utils'
import {
  JOBS_PAGE,
  DETAILS_ARTIFACTS_TAB,
  FEATURE_SETS_TAB,
  FEATURE_STORE_PAGE,
  FUNCTIONS_PAGE,
  FEATURE_VECTORS_TAB,
  MODEL_ENDPOINTS_TAB
} from '../../constants'

import { ReactComponent as Close } from '../../images/close.svg'

const DetailsView = React.forwardRef(
  (
    {
      actionsMenu,
      applyChanges,
      cancelChanges,
      detailsMenu,
      detailsMenuClick,
      detailsStore,
      handleCancel,
      handleShowWarning,
      leavePage,
      match,
      pageData,
      selectedItem,
      setIteration,
      setRefreshWasHandled,
      tabsContent
    },
    ref
  ) => {
    const detailsPanelClassNames = classnames(
      'table__item',
      detailsStore.showWarning && 'pop-up-dialog-opened'
    )
    const state = selectedItem.state || selectedItem?.status?.state

    return (
      <div className={detailsPanelClassNames} ref={ref}>
        {detailsStore.loading && <Loader />}
        {detailsStore.error && (
          <ErrorMessage message={detailsStore.error.message} />
        )}
        <div className="item-header__data">
          <h3>
            {selectedItem.name ||
              selectedItem.db_key ||
              selectedItem.spec?.model?.replace(/:.*$/, '') // 'model-key:model-tag', remove tag
            }
          </h3>
          <span>
            {Object.keys(selectedItem).length > 0 && pageData.page === JOBS_PAGE
              ? formatDatetime(
                  selectedItem?.startTime,
                  state === 'aborted' ? 'N/A' : 'Not yet started'
                )
              : selectedItem?.updated
              ? formatDatetime(new Date(selectedItem?.updated), 'N/A')
              : selectedItem?.spec?.model.includes(':') // 'model-key:model-tag'
              ? selectedItem.spec.model.replace(/^.*:/, '') // remove key
              : selectedItem?.spec?.model
              ? selectedItem?.metadata?.uid
              : ''}
            {state && (
              <Tooltip
                template={<TextTooltipTemplate text={capitalize(state)} />}
              >
                <i className={state} />
              </Tooltip>
            )}
            {!isEmpty(detailsStore.pods.podsPending) && (
              <span>
                {`${detailsStore.pods.podsPending.length} of ${detailsStore.pods.podsList.length} pods are pending`}
              </span>
            )}
            {detailsStore.pods.error && (
              <span className="item-header__pods-error">
                Failed to load pods
              </span>
            )}
          </span>
        </div>
        <div className="item-header__buttons">
          {pageData.page === FEATURE_STORE_PAGE && (
            <>
              <Button
                variant="label"
                label="Cancel"
                onClick={cancelChanges}
                disabled={detailsStore.changes.counter === 0}
              />
              <Tooltip
                template={
                  <TextTooltipTemplate
                    text={`${detailsStore.changes.counter} change${
                      detailsStore.changes.counter === 1 ? '' : 's'
                    } pending`}
                  />
                }
              >
                <LoadButton
                  variant="primary"
                  label="Apply Changes"
                  className="btn_apply-changes"
                  onClick={applyChanges}
                  disabled={detailsStore.changes.counter === 0}
                />
              </Tooltip>
            </>
          )}
          {match.params.tab?.toUpperCase() === DETAILS_ARTIFACTS_TAB && (
            <Select
              density="dense"
              key="Iteration"
              label="Iteration:"
              onClick={option => {
                setIteration(option)
              }}
              options={detailsStore.iterationOptions}
              selectedId={detailsStore.iteration}
            />
          )}
          {![JOBS_PAGE, FUNCTIONS_PAGE].includes(pageData.page) &&
            ![
              FEATURE_SETS_TAB,
              FEATURE_VECTORS_TAB,
              MODEL_ENDPOINTS_TAB
            ].includes(match.params.pageTab) && (
              <Tooltip template={<TextTooltipTemplate text="Download" />}>
                <Download
                  path={`${selectedItem.target_path}${selectedItem.model_file ||
                    ''}`}
                  user={selectedItem.producer?.owner}
                />
              </Tooltip>
            )}
          <ActionsMenu dataItem={selectedItem} menu={actionsMenu} time={500} />
          <Link
            data-testid="details-close-btn"
            to={`/projects/${
              match.params.projectName
            }/${pageData.page.toLowerCase()}${
              match.params.pageTab ? `/${match.params.pageTab}` : ''
            }`}
            onClick={() => {
              if (detailsStore.changes.counter > 0) {
                handleShowWarning(true)
              } else {
                handleCancel()
              }
            }}
          >
            <Tooltip template={<TextTooltipTemplate text="Close" />}>
              <Close />
            </Tooltip>
          </Link>
        </div>
        <ul className="item-menu">
          {detailsMenu.map(link => (
            <DetailsMenuItem
              hash={selectedItem.hash}
              id={pageData.page === JOBS_PAGE ? selectedItem.uid : ''}
              iter={selectedItem.iter}
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
        {detailsStore.showWarning && (
          <PopUpDialog
            headerText={`You have unsaved changes. ${
              detailsStore.refreshWasHandled
                ? 'Refreshing the list'
                : 'Leaving this page'
            } will discard your changes.`}
            closePopUp={() => {
              handleShowWarning(false)
              setRefreshWasHandled(false)
            }}
          >
            <div className="pop-up-dialog__footer-container">
              <Button
                variant="tertiary"
                label="Don't Leave"
                onClick={() => {
                  handleShowWarning(false)
                  setRefreshWasHandled(false)
                }}
              />
              <Button
                variant="primary"
                label="Leave"
                className="pop-up-dialog__btn_cancel"
                onClick={leavePage}
              />
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
  actionsMenu: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({})),
    PropTypes.func
  ]).isRequired,
  applyChanges: PropTypes.func.isRequired,
  cancelChanges: PropTypes.func.isRequired,
  detailsMenu: PropTypes.array.isRequired,
  detailsMenuClick: PropTypes.func,
  detailsStore: PropTypes.shape({}).isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleShowWarning: PropTypes.func.isRequired,
  leavePage: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  pageData: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  setIteration: PropTypes.func.isRequired,
  setRefreshWasHandled: PropTypes.func.isRequired,
  tabsContent: PropTypes.element
}

export default DetailsView
