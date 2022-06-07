import React from 'react'
import PropTypes from 'prop-types'
import { Link, useLocation } from 'react-router-dom'
import classnames from 'classnames'
import { isEmpty } from 'lodash'

import ActionsMenu from '../../common/ActionsMenu/ActionsMenu'
import DetailsMenu from '../../elements/DetailsMenu/DetailsMenu'
import Download from '../../common/Download/Download'
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage'
import LoadButton from '../../common/LoadButton/LoadButton'
import Loader from '../../common/Loader/Loader'
import Select from '../../common/Select/Select'
import {
  Button,
  ConfirmDialog,
  Tooltip,
  TextTooltipTemplate,
  RoundedIcon
} from 'igz-controls/components'

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
import { TERTIARY_BUTTON, PRIMARY_BUTTON, LABEL_BUTTON } from 'igz-controls/constants'
import { ACTIONS_MENU } from '../../types'

import { ReactComponent as Close } from 'igz-controls/images/close.svg'
import { ReactComponent as Back } from 'igz-controls/images/back-arrow.svg'
import { ReactComponent as Refresh } from 'igz-controls/images/refresh.svg'

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
      pageData,
      params,
      selectedItem,
      setIteration,
      setRefreshWasHandled,
      tabsContent,
      tab
    },
    ref
  ) => {
    const location = useLocation()
    const detailsPanelClassNames = classnames(
      'table__item',
      detailsStore.showWarning && 'pop-up-dialog-opened',
      isDetailsScreen && 'table__item_big'
    )
    const {
      value: stateValue,
      label: stateLabel,
      className: stateClassName
    } = selectedItem.state || {}

    return (
      <div className={detailsPanelClassNames} ref={ref}>
        {detailsStore.loading && <Loader />}
        {detailsStore.error && <ErrorMessage message={detailsStore.error.message} />}
        <div className="item-header">
          <div className="item-header__data">
            <h3 className="item-header__title">
              {isDetailsScreen && (
                <Link
                  className="item-header__back-btn"
                  to={
                    getCloseDetailsLink(location, selectedItem.name) ??
                    location.pathname.split('/').slice(0, -2).join('/')
                  }
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
                {
                  selectedItem.name ||
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
                <span className="item-header__pods-error left-margin">Failed to load pods</span>
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
            {params.tab === DETAILS_ARTIFACTS_TAB && (
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
              ![FEATURE_SETS_TAB, FEATURE_VECTORS_TAB, MODEL_ENDPOINTS_TAB].includes(
                params.pageTab
              ) && (
                <Tooltip template={<TextTooltipTemplate text="Download" />}>
                  <Download
                    path={`${selectedItem.target_path}${selectedItem.model_file || ''}`}
                    user={selectedItem.producer?.owner}
                  />
                </Tooltip>
              )}
            {isDetailsScreen && (
              <RoundedIcon id="refresh" onClick={handleRefresh} tooltipText="Refresh">
                <Refresh />
              </RoundedIcon>
            )}
            <ActionsMenu dataItem={selectedItem} menu={actionsMenu} time={500} />
            <Link
              className="details-close-btn"
              data-testid="details-close-btn"
              to={
                getCloseDetailsLink
                  ? getCloseDetailsLink(selectedItem.name)
                  : `/projects/${params.projectName}/${pageData.page.toLowerCase()}${
                      params.pageTab ? `/${params.pageTab}` : tab ? `/${tab}` : ''
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
              <RoundedIcon tooltipText="Close">
                <Close />
              </RoundedIcon>
            </Link>
          </div>
        </div>
        <DetailsMenu detailsMenu={detailsMenu} onClick={detailsMenuClick} params={params} />
        {tabsContent}
        {detailsStore.showWarning && (
          <ConfirmDialog
            cancelButton={{
              handler: () => {
                handleShowWarning(false)
                setRefreshWasHandled(false)
              },
              label: detailsStore.refreshWasHandled ? "Don't refresh" : "Don't Leave",
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
              detailsStore.refreshWasHandled ? 'Refreshing the list' : 'Leaving this page'
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
  tabsContent: null,
  tab: ''
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
  pageData: PropTypes.shape({}).isRequired,
  params: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  setIteration: PropTypes.func.isRequired,
  setRefreshWasHandled: PropTypes.func.isRequired,
  tabsContent: PropTypes.element,
  tab: PropTypes.string
}

export default DetailsView
