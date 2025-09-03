/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import React, { useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { isEmpty } from 'lodash'

import Select from '../../../common/Select/Select'
import { Tooltip, TextTooltipTemplate, RoundedIcon } from 'igz-controls/components'

import { ACTIONS_MENU } from 'igz-controls/types'
import { DETAILS_ARTIFACTS_TAB, DETAILS_LOGS_TAB, JOBS_PAGE } from '../../../constants'
import { formatDatetime } from 'igz-controls/utils/datetime.util'
import { generateUrlFromRouterPath } from 'igz-controls/utils/common.util'
import { getDefaultCloseDetailsLink } from '../../../utils/link-helper.util'
import { setIteration, setRunAttempt } from '../../../reducers/detailsReducer'
import { useDetailsHeader } from 'igz-controls/hooks/useDetailsHeader.hook'

import Back from 'igz-controls/images/back-arrow.svg?react'
import InfoIcon from 'igz-controls/images/info-fill.svg?react'

const DetailsHeader = ({
  actionsMenu,
  applyChanges,
  applyChangesRef,
  cancelChanges,
  getCloseDetailsLink = null,
  handleCancel = null,
  handleRefresh = null,
  handleShowWarning,
  isDetailsPopUp = false,
  isDetailsScreen,
  pageData,
  selectedItem,
  tab = '',
  withActionMenu = true
}) => {
  const {
    DetailsHeaderContainer,
    actionButton,
    commonDetailsStore,
    handleActionClick,
    handleBackClick,
    handleCancelClick,
    headerRef,
    location,
    navigate,
    params,
    showAllVersions,
    viewMode,
    withToggleViewBtn
  } = useDetailsHeader({
    handleCancel,
    handleShowWarning,
    isDetailsPopUp,
    pageData
  })

  const detailsStore = useSelector(store => store.detailsStore)
  const dispatch = useDispatch()

  const errorMessage = useMemo(
    () =>
      selectedItem.reason
        ? `Reason: ${selectedItem.reason}`
        : selectedItem.error
          ? `Error: ${selectedItem.error}`
          : '',
    [selectedItem.error, selectedItem.reason]
  )

  const podsData = useMemo(() => {
    return isDetailsPopUp ? detailsStore.detailsJobPods : detailsStore.pods
  }, [detailsStore.detailsJobPods, detailsStore.pods, isDetailsPopUp])

  const state = useMemo(() => {
    const selectedItemState = selectedItem.state || {}

    return {
      value: selectedItemState.value,
      label: selectedItemState.label,
      className: selectedItemState.className
    }
  }, [selectedItem.state])

  const renderTitle = useCallback(() => {
    return (
      <>
        {isDetailsScreen && !pageData.details.hideBackBtn && !isDetailsPopUp && (
          <Link
            className="item-header__back-btn"
            to={
              getCloseDetailsLink
                ? getCloseDetailsLink(selectedItem.name)
                : generateUrlFromRouterPath(
                    window.location.pathname.split('/').slice(0, -2).join('/') +
                      window.location.search
                  )
            }
            onClick={handleBackClick}
          >
            <RoundedIcon id="go-back" tooltipText="Go to list">
              <Back />
            </RoundedIcon>
          </Link>
        )}
        <Tooltip template={<TextTooltipTemplate text={selectedItem.name || selectedItem.db_key} />}>
          {selectedItem.name || selectedItem.db_key}
        </Tooltip>
      </>
    )
  }, [
    isDetailsScreen,
    pageData.details.hideBackBtn,
    isDetailsPopUp,
    getCloseDetailsLink,
    selectedItem.name,
    handleBackClick,
    selectedItem.db_key
  ])

  const renderStatus = useCallback(() => {
    return (
      <>
        {/*In the Workflow page we display both Jobs and Functions items. The function contains `updated` property.
            The job contains startTime property.*/}
        <div className="item-header__status-row">
          <span className="updated data-ellipsis">
            {Object.keys(selectedItem).length > 0 &&
            pageData.page === JOBS_PAGE &&
            !selectedItem?.updated
              ? formatDatetime(
                  selectedItem?.startTime,
                  state.value === 'aborted' ? 'N/A' : 'Not yet started'
                )
              : selectedItem?.updated
                ? formatDatetime(selectedItem?.updated, 'N/A')
                : pageData.details.additionalHeaderInfo || ''}
          </span>
          {state.value && state.label && (
            <Tooltip className="state" template={<TextTooltipTemplate text={state.label} />}>
              <i className={state.className} />
            </Tooltip>
          )}
        </div>
        <div className="item-header__status-row">
          {selectedItem.ui?.customError?.title && selectedItem.ui?.customError?.message && (
            <Tooltip
              className="error-container"
              template={
                <TextTooltipTemplate
                  text={`${selectedItem.ui.customError.title} ${selectedItem.ui.customError.message}`}
                />
              }
            >
              {selectedItem.ui.customError.title} {selectedItem.ui.customError.message}
            </Tooltip>
          )}
          {errorMessage && (
            <Tooltip
              className="error-container"
              template={<TextTooltipTemplate text={errorMessage} />}
            >
              {errorMessage}
            </Tooltip>
          )}
          {!isEmpty(podsData?.podsPending) && (
            <span className="left-margin">
              {`${podsData.podsPending.length} of ${podsData.podsList.length} pods are pending`}
            </span>
          )}
          {detailsStore.pods.error && (
            <span className="item-header__pods-error left-margin">Failed to load pods</span>
          )}
        </div>
        {selectedItem.ui?.infoMessage && (
          <div className="item-header__status-row">
            <div className="info-banner">
              <InfoIcon />
              <Tooltip
                className="error-container"
                template={<TextTooltipTemplate text={selectedItem.ui.infoMessage} />}
              >
                {selectedItem.ui.infoMessage}
              </Tooltip>
            </div>
          </div>
        )}
      </>
    )
  }, [
    selectedItem,
    pageData.page,
    pageData.details.additionalHeaderInfo,
    errorMessage,
    podsData.podsPending,
    podsData.podsList.length,
    detailsStore.pods.error,
    state.value,
    state.label,
    state.className
  ])

  const renderCustomElements = useCallback(() => {
    switch (params.tab) {
      case DETAILS_ARTIFACTS_TAB: {
        return (
          detailsStore.iteration &&
          detailsStore.iterationOptions &&
          !isDetailsPopUp && (
            <Select
              density="dense"
              key="Iteration"
              label="Iteration:"
              onClick={option => {
                dispatch(setIteration(option))
              }}
              options={detailsStore.iterationOptions}
              selectedId={detailsStore.iteration}
            />
          )
        )
      }
      case DETAILS_LOGS_TAB: {
        return (
          detailsStore.runAttempt &&
          !isEmpty(detailsStore.runAttemptOptions) &&
          !isDetailsPopUp && (
            <Select
              density="dense"
              key="Attempts"
              label="Attempt:"
              onClick={option => {
                dispatch(setRunAttempt(option))
              }}
              options={detailsStore.runAttemptOptions}
              selectedId={detailsStore.runAttempt}
            />
          )
        )
      }
      default:
        return null
    }
  }, [params.tab, detailsStore.iteration, detailsStore.iterationOptions, detailsStore.runAttempt, detailsStore.runAttemptOptions, isDetailsPopUp, dispatch])

  return (
    <DetailsHeaderContainer
      actionButton={actionButton}
      actionsMenu={actionsMenu}
      applyChanges={applyChanges}
      applyChangesRef={applyChangesRef}
      cancelChanges={cancelChanges}
      commonDetailsStore={commonDetailsStore}
      getCloseDetailsLink={getCloseDetailsLink}
      getDefaultCloseDetailsLink={getDefaultCloseDetailsLink}
      handleActionClick={handleActionClick}
      handleCancelClick={handleCancelClick}
      handleRefresh={handleRefresh}
      headerRef={headerRef}
      isDetailsPopUp={isDetailsPopUp}
      isDetailsScreen={isDetailsScreen}
      location={location}
      navigate={navigate}
      pageData={pageData}
      params={params}
      renderCustomElements={renderCustomElements}
      renderStatus={renderStatus}
      renderTitle={renderTitle}
      selectedItem={selectedItem}
      showAllVersions={showAllVersions}
      tab={tab}
      viewMode={viewMode}
      withActionMenu={withActionMenu}
      withToggleViewBtn={withToggleViewBtn}
    />
  )
}

DetailsHeader.propTypes = {
  actionsMenu: ACTIONS_MENU.isRequired,
  applyChanges: PropTypes.func.isRequired,
  applyChangesRef: PropTypes.object.isRequired,
  cancelChanges: PropTypes.func.isRequired,
  getCloseDetailsLink: PropTypes.func,
  handleCancel: PropTypes.func,
  handleRefresh: PropTypes.func,
  handleShowWarning: PropTypes.func.isRequired,
  isDetailsPopUp: PropTypes.bool,
  isDetailsScreen: PropTypes.bool.isRequired,
  pageData: PropTypes.object.isRequired,
  selectedItem: PropTypes.object.isRequired,
  tab: PropTypes.string,
  withActionMenu: PropTypes.bool
}

export default React.memo(DetailsHeader)
