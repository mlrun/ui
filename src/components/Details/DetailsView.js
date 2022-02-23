import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { isEmpty } from 'lodash'

import DetailsMenu from '../../elements/DetailsMenu/DetailsMenu'
import Download from '../../common/Download/Download'
import ActionsMenu from '../../common/ActionsMenu/ActionsMenu'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import Select from '../../common/Select/Select'
import Button from '../../common/Button/Button'
import LoadButton from '../../common/LoadButton/LoadButton'
import Loader from '../../common/Loader/Loader'
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage'
import ConfirmDialog from '../../common/ConfirmDialog/ConfirmDialog'

import { formatDatetime } from '../../utils'
import {
  JOBS_PAGE,
  DETAILS_ARTIFACTS_TAB,
  FEATURE_SETS_TAB,
  FEATURE_STORE_PAGE,
  FUNCTIONS_PAGE,
  FEATURE_VECTORS_TAB,
  MODEL_ENDPOINTS_TAB,
  TERTIARY_BUTTON,
  PRIMARY_BUTTON,
  LABEL_BUTTON
} from '../../constants'
import { ACTIONS_MENU } from '../../types'

import { ReactComponent as Close } from '../../images/close.svg'
import { ReactComponent as Back } from '../../images/back-arrow.svg'
import { ReactComponent as Refresh } from '../../images/refresh.svg'

const DetailsView = React.forwardRef(
  (
    {
      actionsMenu,
      applyChanges,
      applyChangesRef,
      cancelChanges,
      getCloseDetailsLink,
      detailsMenu,
      detailsMenuClick,
      detailsStore,
      handleCancel,
      handleRefresh,
      handleShowWarning,
      isDetailsScreen,
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
      detailsStore.showWarning && 'pop-up-dialog-opened',
      isDetailsScreen && 'table__item_big'
    )
    const { value: stateValue, label: stateLabel, className: stateClassName } =
      selectedItem.state || {}

    return (
      <div className={detailsPanelClassNames} ref={ref}>
        {detailsStore.loading && <Loader />}
        {detailsStore.error && (
          <ErrorMessage message={detailsStore.error.message} />
        )}
        <div className="item-header__data">
          <h3 className="item-header__title">
            {isDetailsScreen && (
              <Link
                className="item-header__back-btn"
                to={location => {
                  const urlArray = location.pathname.split('/')

                  return (
                    getCloseDetailsLink(selectedItem.name) ??
                    urlArray.slice(0, -2).join('/')
                  )
                }}
                onClick={() => {
                  if (detailsStore.changes.counter > 0) {
                    handleShowWarning(true)
                  } else {
                    handleCancel()
                  }
                }}
              >
                <Tooltip template={<TextTooltipTemplate text="Go to list" />}>
                  <Back />
                </Tooltip>
              </Link>
            )}
            <Tooltip
              template={
                <TextTooltipTemplate
                  text={
                    selectedItem.name ||
                    selectedItem.db_key ||
                    selectedItem.spec?.model?.replace(/:.*$/, '')
                  }
                />
              }
            >
              {selectedItem.name ||
                selectedItem.db_key ||
                selectedItem.spec?.model?.replace(/:.*$/, '') // 'model-key:model-tag', remove tag
              }
            </Tooltip>
          </h3>
          <span className="left-margin">
            {/*In the Workflow page we display both Jobs and Functions items. The function contains `updated` property.
            The job contains startTime property.*/}
            {Object.keys(selectedItem).length > 0 &&
            pageData.page === JOBS_PAGE &&
            !selectedItem?.updated
              ? formatDatetime(
                  selectedItem?.startTime,
                  stateValue === 'aborted' ? 'N/A' : 'Not yet started'
                )
              : selectedItem?.updated
              ? formatDatetime(new Date(selectedItem?.updated), 'N/A')
              : selectedItem?.spec?.model.includes(':') // 'model-key:model-tag'
              ? selectedItem.spec.model.replace(/^.*:/, '') // remove key
              : selectedItem?.spec?.model
              ? selectedItem?.metadata?.uid
              : ''}
            {stateValue && stateLabel && (
              <Tooltip template={<TextTooltipTemplate text={stateLabel} />}>
                <i className={stateClassName} />
              </Tooltip>
            )}
            {!isEmpty(detailsStore.pods.podsPending) && (
              <span className="left-margin">
                {`${detailsStore.pods.podsPending.length} of ${detailsStore.pods.podsList.length} pods are pending`}
              </span>
            )}
            {detailsStore.pods.error && (
              <span className="item-header__pods-error left-margin">
                Failed to load pods
              </span>
            )}
          </span>
        </div>
        <div className="item-header__buttons">
          {pageData.page === FEATURE_STORE_PAGE && (
            <>
              <Button
                variant={LABEL_BUTTON}
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
                  ref={applyChangesRef}
                  variant="primary"
                  label="Apply Changes"
                  className="btn_apply-changes"
                  onClick={applyChanges}
                  disabled={detailsStore.changes.counter === 0}
                />
              </Tooltip>
            </>
          )}
          {match.params.tab === DETAILS_ARTIFACTS_TAB && (
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
          {isDetailsScreen && (
            <Tooltip template={<TextTooltipTemplate text="Refresh" />}>
              <button onClick={handleRefresh} id="refresh">
                <Refresh />
              </button>
            </Tooltip>
          )}
          <ActionsMenu dataItem={selectedItem} menu={actionsMenu} time={500} />
          <Link
            data-testid="details-close-btn"
            to={
              getCloseDetailsLink
                ? getCloseDetailsLink(selectedItem.name)
                : `/projects/${
                    match.params.projectName
                  }/${pageData.page.toLowerCase()}${
                    match.params.pageTab ? `/${match.params.pageTab}` : ''
                  }`
            }
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
        <DetailsMenu
          detailsMenu={detailsMenu}
          match={match}
          onClick={detailsMenuClick}
        />
        {tabsContent}
        {detailsStore.showWarning && (
          <ConfirmDialog
            cancelButton={{
              handler: () => {
                handleShowWarning(false)
                setRefreshWasHandled(false)
              },
              label: detailsStore.refreshWasHandled
                ? "Don't refresh"
                : "Don't Leave",
              variant: TERTIARY_BUTTON
            }}
            closePopUp={() => {
              handleShowWarning(false)
              setRefreshWasHandled(false)
            }}
            confirmButton={{
              handler: leavePage,
              label: detailsStore.refreshWasHandled ? 'Refresh' : 'Leave',
              variant: PRIMARY_BUTTON
            }}
            header="You have unsaved changes."
            message={`${
              detailsStore.refreshWasHandled
                ? 'Refreshing the list'
                : 'Leaving this page'
            } will discard your changes.`}
          />
        )}
      </div>
    )
  }
)

DetailsView.defaultProps = {
  detailsMenuClick: () => {},
  getCloseDetailsLink: null,
  handleRefresh: () => {},
  tabsContent: null
}

DetailsView.propTypes = {
  actionsMenu: ACTIONS_MENU.isRequired,
  applyChanges: PropTypes.func.isRequired,
  cancelChanges: PropTypes.func.isRequired,
  detailsMenu: PropTypes.array.isRequired,
  detailsMenuClick: PropTypes.func,
  detailsStore: PropTypes.shape({}).isRequired,
  getCloseDetailsLink: PropTypes.func,
  handleCancel: PropTypes.func.isRequired,
  handleRefresh: PropTypes.func,
  handleShowWarning: PropTypes.func.isRequired,
  isDetailsScreen: PropTypes.bool.isRequired,
  leavePage: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  pageData: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  setIteration: PropTypes.func.isRequired,
  setRefreshWasHandled: PropTypes.func.isRequired,
  tabsContent: PropTypes.element
}

export default DetailsView
