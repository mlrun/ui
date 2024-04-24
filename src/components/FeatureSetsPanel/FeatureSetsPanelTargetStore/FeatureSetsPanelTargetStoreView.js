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
import React from 'react'
import PropTypes from 'prop-types'
import { CSSTransition } from 'react-transition-group'
import classNames from 'classnames'

import CheckBox from '../../../common/CheckBox/CheckBox'
import ErrorMessage from '../../../common/ErrorMessage/ErrorMessage'
import FeatureSetsPanelSection from '../FeatureSetsPanelSection/FeatureSetsPanelSection'
import Input from '../../../common/Input/Input'
import PartitionFields from '../../../elements/PartitionFields/PartitionFields'
import Select from '../../../common/Select/Select'
import UrlPath from '../UrlPath'
import { Tip, Tooltip, TextTooltipTemplate, RoundedIcon } from 'igz-controls/components'

import {
  MLRUN_STORAGE_INPUT_PATH_SCHEME,
  REDIS_INPUT_PATH_SCHEME,
  V3IO_INPUT_PATH_SCHEME
} from '../../../constants'

import {
  checkboxModels,
  EXTERNAL_OFFLINE,
  externalOfflineKindOptions,
  getInvalidParquetPathMessage,
  isParquetPathValid,
  onlineKindOptions,
  NOSQL,
  ONLINE,
  PARQUET,
  REDISNOSQL
} from './featureSetsPanelTargetStore.util'

import { comboboxSelectList } from '../UrlPath.utils'

import { ReactComponent as Online } from 'igz-controls/images/nosql.svg'
import { ReactComponent as Offline } from 'igz-controls/images/db-icon.svg'
import { ReactComponent as ExternalOffline } from 'igz-controls/images/other.svg'
import { ReactComponent as Edit } from 'igz-controls/images/edit.svg'
import { ReactComponent as Checkmark } from 'igz-controls/images/checkmark.svg'
import { ReactComponent as Close } from 'igz-controls/images/close.svg'

import './featureSetsPanelTargetStore.scss'

const FeatureSetsPanelTargetStoreView = ({
  data,
  disableButtons,
  externalOfflineTarget,
  featureStore,
  frontendSpecIsNotEmpty,
  handleAdvancedLinkClick,
  handleDiscardPathChange,
  handleExternalOfflineKindInputOnChange,
  handleExternalOfflineKindOnEditModeChange,
  handleExternalOfflineKindPathOnApply,
  handleExternalOfflineKindSelectOnChange,
  handleExternalOfflineKindTypeChange,
  handleKeyBucketingNumberChange,
  handleOfflineKindPathChange,
  handleOnlineKindPathChange,
  handleOnlineKindTypeChange,
  handlePartitionColsOnBlur,
  handlePartitionColsOnChange,
  handlePartitionRadioButtonClick,
  handleSelectTargetKind,
  handleTimePartitioningGranularityChange,
  partitionRadioButtonsState,
  selectedPartitionKind,
  selectedTargetKind,
  setData,
  setTargetsPathEditData,
  setValidation,
  showAdvanced,
  targetsPathEditData,
  triggerPartitionAdvancedCheckboxes,
  triggerPartitionCheckbox,
  validation
}) => {
  return (
    <div className="feature-set-panel__item new-item-side-panel__item target-store">
      <FeatureSetsPanelSection title="Target store">
        <div className="target-store__item">
          <div className="target-store__checkbox-container">
            <CheckBox
              item={checkboxModels.online}
              onChange={handleSelectTargetKind}
              selectedId={selectedTargetKind.find(kind => checkboxModels.online.id === kind)}
            >
              <Online /> Online
              <Tip
                className="checkbox__label-tip"
                text="Store the feature set in a NoSQL database"
              />
            </CheckBox>
          </div>
          {selectedTargetKind.find(kind => checkboxModels.online.id === kind) && (
            <div className="target-store__inputs-container">
              <div className="target-store__path-wrapper">
                {targetsPathEditData.online.isEditMode && (
                  <>
                    <Select
                      density="medium"
                      disabled={featureStore.newFeatureSet.spec.passthrough}
                      floatingLabel
                      label="NOSQL Kind"
                      onClick={handleOnlineKindTypeChange}
                      options={onlineKindOptions}
                      selectedId={data.online.kind}
                    />

                    <Input
                      density="medium"
                      floatingLabel
                      focused={frontendSpecIsNotEmpty}
                      invalid={!validation.isOnlineTargetPathValid}
                      invalidText={
                        data.online.kind === REDISNOSQL && /[{}]/g.test(data.online.path)
                          ? 'Invalid Redis URL, change the URL to a valid URL in the form of <redis|rediss>://<host>[:port]'
                          : ''
                      }
                      label="Path"
                      onChange={path => {
                        setTargetsPathEditData(prevState => ({
                          ...prevState,
                          online: {
                            ...prevState.online,
                            isModified: true
                          }
                        }))
                        setData(prevState => ({
                          ...prevState,
                          online: { ...prevState.online, path }
                        }))
                      }}
                      placeholder={`${
                        data.online.kind === NOSQL
                          ? V3IO_INPUT_PATH_SCHEME
                          : REDIS_INPUT_PATH_SCHEME + '{authority}/'
                      }projects/{project}/FeatureStore/{name}/${data.online.kind}/sets/{name}`}
                      required
                      setInvalid={value =>
                        setValidation(state => ({
                          ...state,
                          isOnlineTargetPathValid: value
                        }))
                      }
                      type="text"
                      value={data.online.path}
                      wrapperClassName="online-path"
                    />
                    <div className="target-store__path-actions editable">
                      <RoundedIcon tooltipText="Apply">
                        <Checkmark
                          className="target-store__apply-btn"
                          onClick={handleOnlineKindPathChange}
                        />
                      </RoundedIcon>
                      <RoundedIcon
                        onClick={() => handleDiscardPathChange(ONLINE)}
                        tooltipText="Discard changes"
                      >
                        <Close />
                      </RoundedIcon>
                    </div>
                  </>
                )}
                {!targetsPathEditData.online.isEditMode && (
                  <>
                    <Tooltip
                      className={classNames(
                        'path-data online-path',
                        !validation.isOnlineTargetPathValid && 'online-path__invalid'
                      )}
                      template={<TextTooltipTemplate text={data.online.path} />}
                    >
                      {data.online.path}
                    </Tooltip>
                    <div className="target-store__path-actions">
                      <RoundedIcon tooltipText="Edit" onClick={handleOnlineKindPathChange}>
                        <Edit />
                      </RoundedIcon>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="target-store__item">
          <div className="target-store__checkbox-container">
            <CheckBox
              disabled={featureStore.newFeatureSet.spec.passthrough}
              item={checkboxModels.parquet}
              onChange={handleSelectTargetKind}
              selectedId={selectedTargetKind.find(kind => checkboxModels.parquet.id === kind)}
            >
              <Offline /> Offline
              <Tip
                className="checkbox__label-tip"
                text="Store the feature set as a Parquet file or a partitioned Parquet directory"
              />
            </CheckBox>
          </div>
          {selectedTargetKind.find(kind => checkboxModels.parquet.id === kind) && (
            <div className="target-store__inputs-container">
              <div className="target-store__path-wrapper">
                {targetsPathEditData.parquet.isEditMode && (
                  <>
                    <Input
                      density="normal"
                      floatingLabel
                      focused={frontendSpecIsNotEmpty}
                      invalid={isParquetPathValid(
                        validation.isOfflineTargetPathValid,
                        data.parquet
                      )}
                      invalidText={getInvalidParquetPathMessage(data.parquet)}
                      label="Path"
                      onChange={path => {
                        setTargetsPathEditData(prevState => ({
                          ...prevState,
                          parquet: {
                            ...prevState.parquet,
                            isModified: true
                          }
                        }))
                        setData(state => ({
                          ...state,
                          parquet: { ...state.parquet, path }
                        }))
                      }}
                      placeholder={
                        'v3io:///projects/{project}/FeatureStore/{name}/parquet/sets/{name}.parquet'
                      }
                      required
                      setInvalid={value =>
                        setValidation(state => ({
                          ...state,
                          isOfflineTargetPathValid: value
                        }))
                      }
                      type="text"
                      value={data.parquet.path}
                      wrapperClassName="offline-path"
                    />
                    <div className="target-store__path-actions editable">
                      <RoundedIcon
                        disabled={isParquetPathValid(
                          validation.isOfflineTargetPathValid,
                          data.parquet
                        )}
                        onClick={handleOfflineKindPathChange}
                        tooltipText="Apply"
                      >
                        <Checkmark className="target-store__apply-btn" />
                      </RoundedIcon>
                      <RoundedIcon
                        onClick={() => handleDiscardPathChange(PARQUET)}
                        tooltipText="Discard changes"
                      >
                        <Close />
                      </RoundedIcon>
                    </div>
                  </>
                )}
                {!targetsPathEditData.parquet.isEditMode && (
                  <>
                    <Tooltip
                      className={classNames(
                        'path-data offline-path',
                        featureStore.newFeatureSet.spec.passthrough && 'offline-path__disabled'
                      )}
                      template={<TextTooltipTemplate text={data.parquet.path} />}
                    >
                      {data.parquet.path}
                    </Tooltip>
                    {!featureStore.newFeatureSet.spec.passthrough && (
                      <div className="target-store__path-actions">
                        <RoundedIcon onClick={handleOfflineKindPathChange} tooltipText="Edit">
                          <Edit />
                        </RoundedIcon>
                      </div>
                    )}
                  </>
                )}
                <CheckBox
                  disabled={
                    targetsPathEditData.parquet.isEditMode ||
                    featureStore.newFeatureSet.spec.passthrough
                  }
                  item={{ id: 'partitioned', label: 'Partition' }}
                  onChange={id => triggerPartitionCheckbox(id, PARQUET)}
                  selectedId={data.parquet.partitioned}
                />
              </div>
              {data.parquet.partitioned && (
                <div className="partition-fields">
                  <span
                    className="link show-advanced"
                    onClick={() => handleAdvancedLinkClick(PARQUET)}
                  >
                    {showAdvanced.parquet ? 'Hide advanced' : 'Show advanced'}
                  </span>
                  <CSSTransition
                    in={showAdvanced.parquet}
                    timeout={200}
                    classNames="fade"
                    unmountOnExit
                  >
                    <PartitionFields
                      data={data.parquet}
                      handlePartitionRadioButtonClick={value =>
                        handlePartitionRadioButtonClick(value, PARQUET)
                      }
                      partitionColsOnBlur={() => handlePartitionColsOnBlur(PARQUET)}
                      partitionColsOnChange={value => handlePartitionColsOnChange(value, PARQUET)}
                      partitionRadioButtonsState={partitionRadioButtonsState.parquet}
                      rangeOnChange={value => handleKeyBucketingNumberChange(value, PARQUET)}
                      selectedPartitionKind={selectedPartitionKind.parquet}
                      setPartitionColumnsValidation={value =>
                        setValidation(state => ({
                          ...state,
                          isOfflinePartitionColumnsValid: value
                        }))
                      }
                      timePartitioningGranularityChange={value =>
                        handleTimePartitioningGranularityChange(value, PARQUET)
                      }
                      triggerPartitionAdvancedCheckboxes={value =>
                        triggerPartitionAdvancedCheckboxes(value, PARQUET)
                      }
                      validation={{
                        partitionBuckets: validation.isOfflinePartitionBucketsValid,
                        partitionColumns: validation.isOfflinePartitionColumnsValid
                      }}
                    />
                  </CSSTransition>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="target-store__item">
          <div className="target-store__checkbox-container">
            <CheckBox
              disabled={featureStore.newFeatureSet.spec.passthrough}
              item={checkboxModels.externalOffline}
              onChange={handleSelectTargetKind}
              selectedId={selectedTargetKind.find(
                kind => checkboxModels.externalOffline.id === kind
              )}
            >
              <ExternalOffline />
              <span className="checkbox__label">External offline</span>
              <Tip
                className="checkbox__label-tip"
                text="Store the feature set in a remote object store (e.g. AWS S3 Google or Azure storage)"
              />
            </CheckBox>
          </div>
          {selectedTargetKind.find(kind => checkboxModels.externalOffline.id === kind) && (
            <div className="target-store__inputs-container">
              <div className="target-store__item v-center">
                <Select
                  density="medium"
                  disabled={featureStore.newFeatureSet.spec.passthrough}
                  floatingLabel
                  label="File type"
                  onClick={handleExternalOfflineKindTypeChange}
                  options={externalOfflineKindOptions}
                  selectedId={data.externalOffline.kind}
                />

                <UrlPath
                  comboboxSelectList={comboboxSelectList.filter(
                    option =>
                      option.id !== MLRUN_STORAGE_INPUT_PATH_SCHEME &&
                      option.id !== V3IO_INPUT_PATH_SCHEME
                  )}
                  defaultPath={externalOfflineTarget}
                  disabled={featureStore.newFeatureSet.spec.passthrough}
                  handleUrlInputOnChange={handleExternalOfflineKindInputOnChange}
                  handleUrlOnApply={handleExternalOfflineKindPathOnApply}
                  handleUrlOnEditModeChange={handleExternalOfflineKindOnEditModeChange}
                  handleUrlSelectOnChange={handleExternalOfflineKindSelectOnChange}
                  invalid={!validation.isExternalOfflineTargetPathValid}
                  previewClassName={
                    data.externalOffline.kind === PARQUET
                      ? 'external-offline_with-parquet'
                      : 'external-offline'
                  }
                  withActionButtons
                />
                {data.externalOffline.kind === PARQUET && (
                  <CheckBox
                    disabled={!disableButtons.isExternalOfflineTargetPathEditModeClosed}
                    item={{ id: 'partitioned', label: 'Partition' }}
                    onChange={id => triggerPartitionCheckbox(id, EXTERNAL_OFFLINE)}
                    selectedId={data.externalOffline.partitioned}
                  />
                )}
              </div>
              {data.externalOffline.partitioned && (
                <div className="partition-fields">
                  <span
                    className="link show-advanced"
                    onClick={() => handleAdvancedLinkClick(EXTERNAL_OFFLINE)}
                  >
                    {showAdvanced.externalOffline ? 'Hide advanced' : 'Show advanced'}
                  </span>
                  <CSSTransition
                    in={showAdvanced.externalOffline}
                    timeout={200}
                    classNames="fade"
                    unmountOnExit
                  >
                    <PartitionFields
                      data={data.externalOffline}
                      handlePartitionRadioButtonClick={value =>
                        handlePartitionRadioButtonClick(value, EXTERNAL_OFFLINE)
                      }
                      partitionColsOnBlur={() => handlePartitionColsOnBlur(EXTERNAL_OFFLINE)}
                      partitionColsOnChange={value =>
                        handlePartitionColsOnChange(value, EXTERNAL_OFFLINE)
                      }
                      partitionRadioButtonsState={partitionRadioButtonsState.externalOffline}
                      rangeOnChange={value =>
                        handleKeyBucketingNumberChange(value, EXTERNAL_OFFLINE)
                      }
                      selectedPartitionKind={selectedPartitionKind.externalOffline}
                      setPartitionColumnsValidation={value =>
                        setValidation(state => ({
                          ...state,
                          isExternalOfflinePartitionColumnsValid: value
                        }))
                      }
                      timePartitioningGranularityChange={value =>
                        handleTimePartitioningGranularityChange(value, EXTERNAL_OFFLINE)
                      }
                      triggerPartitionAdvancedCheckboxes={value =>
                        triggerPartitionAdvancedCheckboxes(value, EXTERNAL_OFFLINE)
                      }
                      validation={{
                        partitionBuckets: validation.isExternalOfflinePartitionBucketsValid,
                        partitionColumns: validation.isExternalOfflinePartitionColumnsValid
                      }}
                    />
                  </CSSTransition>
                </div>
              )}
            </div>
          )}
        </div>
        {!selectedTargetKind.length && !featureStore.newFeatureSet.spec.passthrough && (
          <ErrorMessage message="Must select at least one" />
        )}
      </FeatureSetsPanelSection>
    </div>
  )
}

FeatureSetsPanelTargetStoreView.defualtProps = {
  externalOfflineTarget: {}
}

FeatureSetsPanelTargetStoreView.propTypes = {
  data: PropTypes.shape({}).isRequired,
  disableButtons: PropTypes.shape({}).isRequired,
  externalOfflineTarget: PropTypes.shape({}),
  frontendSpecIsNotEmpty: PropTypes.bool.isRequired,
  handleAdvancedLinkClick: PropTypes.func.isRequired,
  handleDiscardPathChange: PropTypes.func.isRequired,
  handleExternalOfflineKindInputOnChange: PropTypes.func.isRequired,
  handleExternalOfflineKindOnEditModeChange: PropTypes.func.isRequired,
  handleExternalOfflineKindPathOnApply: PropTypes.func.isRequired,
  handleExternalOfflineKindSelectOnChange: PropTypes.func.isRequired,
  handleExternalOfflineKindTypeChange: PropTypes.func.isRequired,
  handleKeyBucketingNumberChange: PropTypes.func.isRequired,
  handleOfflineKindPathChange: PropTypes.func.isRequired,
  handleOnlineKindPathChange: PropTypes.func.isRequired,
  handleOnlineKindTypeChange: PropTypes.func.isRequired,
  handlePartitionColsOnBlur: PropTypes.func.isRequired,
  handlePartitionColsOnChange: PropTypes.func.isRequired,
  handlePartitionRadioButtonClick: PropTypes.func.isRequired,
  handleSelectTargetKind: PropTypes.func.isRequired,
  handleTimePartitioningGranularityChange: PropTypes.func.isRequired,
  partitionRadioButtonsState: PropTypes.shape({
    parquet: PropTypes.string.isRequired,
    externalOffline: PropTypes.string.isRequired
  }).isRequired,
  selectedPartitionKind: PropTypes.shape({
    parquet: PropTypes.arrayOf(PropTypes.string).isRequired,
    externalOffline: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  selectedTargetKind: PropTypes.arrayOf(PropTypes.string).isRequired,
  setData: PropTypes.func.isRequired,
  setTargetsPathEditData: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  showAdvanced: PropTypes.shape({
    parquet: PropTypes.bool.isRequired,
    externalOffline: PropTypes.bool.isRequired
  }).isRequired,
  triggerPartitionAdvancedCheckboxes: PropTypes.func.isRequired,
  triggerPartitionCheckbox: PropTypes.func.isRequired,
  validation: PropTypes.shape({}).isRequired
}

export default FeatureSetsPanelTargetStoreView
