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
import React, { useCallback, useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { isEmpty } from 'lodash'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import { Button, Tooltip, TextTooltipTemplate, RoundedIcon } from 'igz-controls/components'
import LoadButton from '../../../common/LoadButton/LoadButton'
import Select from '../../../common/Select/Select'
import ActionsMenu from '../../../common/ActionsMenu/ActionsMenu'

import { DETAILS_ARTIFACTS_TAB, FULL_VIEW_MODE, JOBS_PAGE } from '../../../constants'
import { formatDatetime } from '../../../utils'
import { LABEL_BUTTON } from 'igz-controls/constants'
import { ACTIONS_MENU } from '../../../types'
import { getViewMode } from '../../../utils/helper'

import { ReactComponent as Close } from 'igz-controls/images/close.svg'
import { ReactComponent as Back } from 'igz-controls/images/back-arrow.svg'
import { ReactComponent as Refresh } from 'igz-controls/images/refresh.svg'
import { ReactComponent as EnlargeIcon } from 'igz-controls/images/ml-enlarge.svg'
import { ReactComponent as MinimizeIcon } from 'igz-controls/images/ml-minimize.svg'

const DetailsHeader = ({
  actionsMenu,
  applyChanges,
  applyChangesRef,
  cancelChanges,
  getCloseDetailsLink,
  handleCancel,
  handleRefresh,
  handleShowWarning,
  isDetailsScreen,
  pageData,
  selectedItem,
  setIteration,
  tab
}) => {
  const [headerIsMultiline, setHeaderIsMultiline] = useState(false)
  const detailsStore = useSelector(store => store.detailsStore)
  const location = useLocation()
  const params = useParams()
  const navigate = useNavigate()
  const viewMode = getViewMode(window.location.search)
  const { actionButton, withToggleViewBtn } = pageData.details
  const headerRef = useRef()

  const {
    value: stateValue,
    label: stateLabel,
    className: stateClassName
  } = selectedItem.state || {}

  const handleBackClick = useCallback(() => {
    if (detailsStore.changes.counter > 0) {
      handleShowWarning(true)
    } else {
      handleCancel()
    }
  }, [detailsStore.changes.counter, handleCancel, handleShowWarning])

  const handleCancelClick = useCallback(() => {
    if (detailsStore.changes.counter === 0) {
      handleCancel()
    }
  }, [detailsStore.changes.counter, handleCancel])

  useEffect(() => {
    if (!headerRef.current) return

    let prevHeaderHeight = 0
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.contentRect.height !== prevHeaderHeight) {
          prevHeaderHeight = entry.contentRect.height
          if (entry.contentRect.height > 100) {
            setHeaderIsMultiline(true)
          } else {
            setHeaderIsMultiline(false)
          }
        }
      }
    })

    resizeObserver.observe(headerRef.current)

    return () => resizeObserver.disconnect()
  }, [])

  return (
    <div
      className={classNames('item-header', headerIsMultiline && 'item-header_multiline')}
      ref={headerRef}
    >
      <div className="item-header__data">
        <h3 className="item-header__title">
          {isDetailsScreen && !pageData.details.hideBackBtn && (
            <Link
              className="item-header__back-btn"
              to={
                getCloseDetailsLink(location, selectedItem.name) ??
                location.pathname.split('/').slice(0, -2).join('/')
              }
              onClick={handleBackClick}
            >
              <RoundedIcon id="go-back" tooltipText="Go to list">
                <Back />
              </RoundedIcon>
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
        <div className="item-header__status">
          {/*In the Workflow page we display both Jobs and Functions items. The function contains `updated` property.
            The job contains startTime property.*/}
          <span className="updated data-ellipsis">
            {Object.keys(selectedItem).length > 0 &&
            pageData.page === JOBS_PAGE &&
            !selectedItem?.updated
              ? formatDatetime(
                  selectedItem?.startTime,
                  stateValue === 'aborted' ? 'N/A' : 'Not yet started'
                )
              : selectedItem?.updated
                ? formatDatetime(selectedItem?.updated, 'N/A')
                : selectedItem?.spec?.model.includes(':') // 'model-key:model-tag'
                  ? selectedItem.spec.model.replace(/^.*:/, '') // remove key
                  : selectedItem?.spec?.model
                    ? selectedItem?.metadata?.uid
                    : ''}
          </span>
          {stateValue && stateLabel && (
            <Tooltip className="state" template={<TextTooltipTemplate text={stateLabel} />}>
              <i className={stateClassName} />
            </Tooltip>
          )}
          {selectedItem.error && (
            <Tooltip
              className="error-container"
              template={<TextTooltipTemplate text={`Error - ${selectedItem.error}`} />}
            >
              Error - {selectedItem.error}
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
        </div>
      </div>
      <div className="item-header__custom-elements">
        {params.tab === DETAILS_ARTIFACTS_TAB && detailsStore.iteration && (
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
      </div>
      <div className="item-header__buttons">
        {detailsStore.changes.counter > 0 && (
          <>
            <Button
              variant={LABEL_BUTTON}
              label="Cancel"
              onClick={cancelChanges}
              disabled={detailsStore.changes.counter === 0 || detailsStore.editMode}
            />
            <Tooltip
              template={
                <TextTooltipTemplate
                  text={`${detailsStore.changes.counter} ${
                    detailsStore.changes.counter === 1 ? 'change pending' : 'changes pending'
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
                disabled={detailsStore.changes.counter === 0 || detailsStore.editMode}
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
        {isDetailsScreen && (
          <RoundedIcon
            id="refresh"
            onClick={() => handleRefresh(selectedItem.project)}
            tooltipText="Refresh"
          >
            <Refresh />
          </RoundedIcon>
        )}
        <ActionsMenu dataItem={selectedItem} menu={actionsMenu} time={500} />
        <div className="item-header__navigation-buttons">
          {withToggleViewBtn && (
            <>
              {viewMode !== FULL_VIEW_MODE && (
                <RoundedIcon
                  onClick={() => {
                    navigate(`${location.pathname}${location.search ? '&' : '?'}view=full`)
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
                    navigate(`${location.pathname.replace(/(\?|&)view=full(&|$)/, '$1')}`)
                  }}
                  id="table-view"
                  tooltipText="Table view"
                >
                  <MinimizeIcon />
                </RoundedIcon>
              )}
            </>
          )}
          {!pageData.details.hideBackBtn && (
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
              onClick={handleCancelClick}
            >
              <RoundedIcon tooltipText="Close" id="details-close">
                <Close />
              </RoundedIcon>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

DetailsHeader.defaultProps = {
  handleCancel: null
}

DetailsHeader.propTypes = {
  actionsMenu: ACTIONS_MENU.isRequired,
  applyChanges: PropTypes.func.isRequired,
  cancelChanges: PropTypes.func.isRequired,
  handleCancel: PropTypes.func,
  handleRefresh: PropTypes.func,
  handleShowWarning: PropTypes.func.isRequired,
  isDetailsScreen: PropTypes.bool.isRequired,
  pageData: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  setIteration: PropTypes.func.isRequired,
  tab: PropTypes.string
}

export default React.memo(DetailsHeader)
