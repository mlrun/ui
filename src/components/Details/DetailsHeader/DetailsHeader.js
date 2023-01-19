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
import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Link, useLocation, useParams } from 'react-router-dom'
import { isEmpty } from 'lodash'
import { useSelector } from 'react-redux'

import { Button, Tooltip, TextTooltipTemplate, RoundedIcon } from 'igz-controls/components'
import LoadButton from '../../../common/LoadButton/LoadButton'
import Select from '../../../common/Select/Select'
import Download from '../../../common/Download/Download'
import ActionsMenu from '../../../common/ActionsMenu/ActionsMenu'

import {
  DATASETS_PAGE,
  DETAILS_ARTIFACTS_TAB,
  FILES_PAGE,
  JOBS_PAGE,
  MODEL_ENDPOINTS_TAB,
  MODELS_PAGE
} from '../../../constants'
import { formatDatetime } from '../../../utils'
import { LABEL_BUTTON } from 'igz-controls/constants'
import { ACTIONS_MENU } from '../../../types'

import { ReactComponent as Close } from 'igz-controls/images/close.svg'
import { ReactComponent as Back } from 'igz-controls/images/back-arrow.svg'
import { ReactComponent as Refresh } from 'igz-controls/images/refresh.svg'

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
  const detailsStore = useSelector(store => store.detailsStore)
  const location = useLocation()
  const params = useParams()

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
    if (detailsStore.changes.counter > 0) {
      handleShowWarning(true)
    } else {
      handleCancel()
    }
  }, [detailsStore.changes.counter, handleCancel, handleShowWarning])

  return (
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
              onClick={handleBackClick}
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
          <span className="updated">
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
        </span>
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
                disabled={detailsStore.changes.counter === 0 || detailsStore.editMode}
              />
            </Tooltip>
          </>
        )}
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
        {[FILES_PAGE, DATASETS_PAGE, MODELS_PAGE].includes(pageData.page) &&
          pageData.details.type !== MODEL_ENDPOINTS_TAB && (
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
          onClick={handleCancelClick}
        >
          <RoundedIcon tooltipText="Close">
            <Close />
          </RoundedIcon>
        </Link>
      </div>
    </div>
  )
}

DetailsHeader.propTypes = {
  actionsMenu: ACTIONS_MENU.isRequired,
  applyChanges: PropTypes.func.isRequired,
  cancelChanges: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleRefresh: PropTypes.func,
  handleShowWarning: PropTypes.func.isRequired,
  isDetailsScreen: PropTypes.bool.isRequired,
  pageData: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  setIteration: PropTypes.func.isRequired,
  tab: PropTypes.string
}

export default React.memo(DetailsHeader)
