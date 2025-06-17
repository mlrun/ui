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

import React, { useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

import {
  Button,
  RoundedIcon,
  TextTooltipTemplate,
  Tooltip,
  LoadButton,
  ActionsMenu
} from 'igz-controls/components'

import { ACTION_BUTTON, ACTIONS_MENU } from 'igz-controls/types'
import { TERTIARY_BUTTON, VIEW_SEARCH_PARAMETER, FULL_VIEW_MODE } from 'igz-controls/constants'
import { getFilteredSearchParams } from 'igz-controls/utils/filter.util'
import { getViewMode } from 'igz-controls/utils/common.util'

import Close from 'igz-controls/images/close.svg?react'
import EnlargeIcon from 'igz-controls/images/ml-enlarge.svg?react'
import HistoryIcon from 'igz-controls/images/history.svg?react'
import MinimizeIcon from 'igz-controls/images/ml-minimize.svg?react'
import Refresh from 'igz-controls/images/refresh.svg?react'

const DetailsHeaderContainer = ({
  actionButton = null,
  actionsMenu,
  applyChanges,
  applyChangesRef,
  cancelChanges,
  commonDetailsStore,
  getCloseDetailsLink = null,
  getDefaultCloseDetailsLink,
  handleCancelClick,
  handleRefresh = null,
  headerRef,
  isDetailsPopUp = false,
  isDetailsScreen,
  location,
  navigate,
  pageData,
  params,
  renderCustomElements = null,
  renderStatus = null,
  renderTitle,
  selectedItem,
  showAllVersions = null,
  tab = '',
  viewMode = '',
  withActionMenu = true,
  withToggleViewBtn = false
}) => {
  return (
    <div className="item-header" ref={headerRef}>
      <div className="item-header__data">
        <h3 className="item-header__title">{renderTitle && renderTitle()}</h3>
        <div className="item-header__status">{renderStatus && renderStatus()}</div>
      </div>
      <div className="item-header__custom-elements">
        {renderCustomElements && renderCustomElements()}
      </div>
      <div className="item-header__buttons">
        {commonDetailsStore.changes.counter > 0 && !isDetailsPopUp && (
          <>
            <Button
              variant={TERTIARY_BUTTON}
              label="Cancel"
              onClick={cancelChanges}
              disabled={commonDetailsStore.changes.counter === 0 || commonDetailsStore.editMode}
            />
            <Tooltip
              template={
                <TextTooltipTemplate
                  text={`${commonDetailsStore.changes.counter} ${
                    commonDetailsStore.changes.counter === 1 ? 'change pending' : 'changes pending'
                  }`}
                />
              }
            >
              <LoadButton
                ref={applyChangesRef}
                variant="primary"
                label="Apply Changes"
                className="btn_apply-changes"
                onClick={applyChanges}
                disabled={commonDetailsStore.changes.counter === 0 || commonDetailsStore.editMode}
              />
            </Tooltip>
          </>
        )}
        {actionButton && !actionButton.hidden && (
          <Button
            disabled={actionButton.disabled}
            label={actionButton.label}
            onClick={actionButton.onClick}
            tooltip={actionButton.tooltip}
            variant={actionButton.variant}
          />
        )}
        {showAllVersions && (
          <RoundedIcon
            id="showAllVersions"
            onClick={() => showAllVersions()}
            tooltipText="Show all versions"
          >
            <HistoryIcon />
          </RoundedIcon>
        )}
        {isDetailsScreen && handleRefresh && (
          <RoundedIcon
            id="refresh"
            onClick={() => handleRefresh(selectedItem)}
            tooltipText="Refresh"
          >
            <Refresh />
          </RoundedIcon>
        )}
        {withActionMenu && <ActionsMenu dataItem={selectedItem} menu={actionsMenu} time={500} />}
        <div className="item-header__navigation-buttons">
          {withToggleViewBtn && !isDetailsPopUp && (
            <>
              {viewMode !== FULL_VIEW_MODE && (
                <RoundedIcon
                  onClick={() => {
                    navigate(
                      `${location.pathname}${window.location.search}${window.location.search ? '&' : '?'}${VIEW_SEARCH_PARAMETER}=full`
                    )
                  }}
                  id="full-view"
                  tooltipText="Full view"
                >
                  <EnlargeIcon />
                </RoundedIcon>
              )}
              {viewMode === FULL_VIEW_MODE && (
                <RoundedIcon
                  onClick={() => {
                    navigate(
                      `${location.pathname}${getFilteredSearchParams(window.location.search, [VIEW_SEARCH_PARAMETER])}`
                    )
                  }}
                  id="table-view"
                  tooltipText="Table view"
                >
                  <MinimizeIcon />
                </RoundedIcon>
              )}
            </>
          )}
          {!pageData.details.hideBackBtn &&
            (isDetailsPopUp ? (
              <div
                className="details-close-btn"
                data-testid="details-close-btn"
                onClick={handleCancelClick}
              >
                <RoundedIcon tooltipText="Close" id="details-close">
                  <Close />
                </RoundedIcon>
              </div>
            ) : (
              <Link
                className="details-close-btn"
                data-testid="details-close-btn"
                to={
                  getCloseDetailsLink
                    ? getCloseDetailsLink(selectedItem.name)
                    : getDefaultCloseDetailsLink(params, pageData.page, tab)
                }
                onClick={handleCancelClick}
              >
                <RoundedIcon tooltipText="Close" id="details-close">
                  <Close />
                </RoundedIcon>
              </Link>
            ))}
        </div>
      </div>
    </div>
  )
}

DetailsHeaderContainer.propTypes = {
  actionButton: ACTION_BUTTON,
  actionsMenu: ACTIONS_MENU.isRequired,
  applyChanges: PropTypes.func.isRequired,
  applyChangesRef: PropTypes.object.isRequired,
  cancelChanges: PropTypes.func.isRequired,
  commonDetailsStore: PropTypes.object.isRequired,
  getCloseDetailsLink: PropTypes.func,
  getDefaultCloseDetailsLink: PropTypes.func.isRequired,
  handleCancelClick: PropTypes.func.isRequired,
  handleRefresh: PropTypes.func,
  headerRef: PropTypes.object.isRequired,
  isDetailsPopUp: PropTypes.bool,
  isDetailsScreen: PropTypes.bool.isRequired,
  location: PropTypes.object.isRequired,
  navigate: PropTypes.func.isRequired,
  pageData: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  renderCustomElements: PropTypes.func,
  renderStatus: PropTypes.func,
  renderTitle: PropTypes.func.isRequired,
  selectedItem: PropTypes.object.isRequired,
  showAllVersions: PropTypes.func,
  tab: PropTypes.string,
  viewMode: PropTypes.string,
  withActionMenu: PropTypes.bool,
  withToggleViewBtn: PropTypes.bool
}

export const useDetailsHeader = ({ handleCancel, handleShowWarning, isDetailsPopUp, pageData }) => {
  const commonDetailsStore = useSelector(store => store.commonDetailsStore)
  const params = useParams()
  const navigate = useNavigate()
  const viewMode = getViewMode(window.location.search)
  const { actionButton, withToggleViewBtn, showAllVersions } = pageData.details
  const headerRef = useRef()
  const location = useLocation()
  const dispatch = useDispatch()

  const handleBackClick = useCallback(() => {
    if (commonDetailsStore.changes.counter > 0) {
      handleShowWarning(true)
    } else if (handleCancel) {
      handleCancel()
    }
  }, [commonDetailsStore.changes.counter, handleCancel, handleShowWarning])

  const handleCancelClick = useCallback(() => {
    if (handleCancel && (commonDetailsStore.changes.counter === 0 || isDetailsPopUp)) {
      handleCancel()
    }
  }, [commonDetailsStore.changes.counter, handleCancel, isDetailsPopUp])

  return {
    DetailsHeaderContainer,
    actionButton,
    commonDetailsStore,
    dispatch,
    handleBackClick,
    handleCancelClick,
    headerRef,
    location,
    navigate,
    params,
    showAllVersions,
    viewMode,
    withToggleViewBtn
  }
}
