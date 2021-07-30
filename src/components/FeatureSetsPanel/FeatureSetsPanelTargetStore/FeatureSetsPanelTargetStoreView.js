import React from 'react'
import PropTypes from 'prop-types'
import { CSSTransition } from 'react-transition-group'

import FeatureSetsPanelSection from '../FeatureSetsPanelSection/FeatureSetsPanelSection'
import CheckBox from '../../../common/CheckBox/CheckBox'
import Select from '../../../common/Select/Select'
import Input from '../../../common/Input/Input'
import PartitionFields from '../../../elements/PartitionFields/PartitionFields'
import Tip from '../../../common/Tip/Tip'
import ErrorMessage from '../../../common/ErrorMessage/ErrorMessage'

import { ReactComponent as Online } from '../../../images/nosql.svg'
import { ReactComponent as Offline } from '../../../images/db-icon.svg'
import { ReactComponent as ExternalOffline } from '../../../images/other.svg'
import {
  EXTERNAL_OFFLINE,
  externalOfflineKindOptions,
  PARQUET,
  checkboxModels
} from './featureSetsPanelTargetStore.util'

import './featureSetsPanelTargetStore.scss'

const FeatureSetsPanelTargetStoreView = ({
  data,
  handleAdvancedFieldsLink,
  handleExternalOfflineKindPathOnBlur,
  handleExternalOfflineKindPathOnChange,
  handleKeyBucketingNumberChange,
  handleOfflineKindPathOnBlur,
  handleOnlineKindPathOnBlur,
  handleExternalOfflineKindTypeChange,
  handlePartitionColsOnBlur,
  handlePartitionColsOnChange,
  handlePartitionRadioButtons,
  handleSelectTargetKind,
  handleTimePartitioningGranularityChange,
  isShowAdvanced,
  isTargetsPathValid,
  partitionRadioButtonsState,
  selectedPartitionKind,
  selectedTargetKind,
  setData,
  setTargetsPathValid,
  triggerPartitionAdvancedCheckboxes,
  triggerPartitionCheckbox
}) => {
  return (
    <div className="feature-set-panel__item new-item-side-panel__item target-store">
      <FeatureSetsPanelSection title="Target store">
        <div className="target-store__item">
          <div className="target-store__checkbox-container">
            <CheckBox
              item={checkboxModels.online}
              onChange={handleSelectTargetKind}
              selectedId={selectedTargetKind.find(
                kind => checkboxModels.online.id === kind
              )}
            >
              <Online /> Online
              <Tip
                className="checkbox__label-tip"
                text="Store the feature set in Iguazio NoSQL database"
              />
            </CheckBox>
          </div>
          {selectedTargetKind.find(
            kind => checkboxModels.online.id === kind
          ) && (
            <div className="target-store__inputs-container">
              <Input
                density="normal"
                floatingLabel
                label="Path"
                onBlur={handleOnlineKindPathOnBlur}
                onChange={path =>
                  setData(prevState => ({
                    ...prevState,
                    online: { ...prevState.online, path }
                  }))
                }
                placeholder={data.online.path}
                type="text"
                value={data.online.path}
              />
            </div>
          )}
        </div>
        <div className="target-store__item">
          <div className="target-store__checkbox-container">
            <CheckBox
              item={checkboxModels.parquet}
              onChange={handleSelectTargetKind}
              selectedId={selectedTargetKind.find(
                kind => checkboxModels.parquet.id === kind
              )}
            >
              <Offline /> Offline
              <Tip
                className="checkbox__label-tip"
                text="Store the feature set as a Parquet file in Iguazio object store"
              />
            </CheckBox>
          </div>
          {selectedTargetKind.find(
            kind => checkboxModels.parquet.id === kind
          ) && (
            <div className="target-store__inputs-container">
              <Input
                density="normal"
                floatingLabel
                label="Path"
                onBlur={handleOfflineKindPathOnBlur}
                onChange={path =>
                  setData(state => ({
                    ...state,
                    parquet: { ...state.parquet, path }
                  }))
                }
                placeholder={data.parquet.path}
                type="text"
                value={data.parquet.path}
                wrapperClassName="offline-path"
              />
              <CheckBox
                item={{ id: 'partitioned', label: 'Partition' }}
                onChange={id => triggerPartitionCheckbox(id, PARQUET)}
                selectedId={data.parquet.partitioned}
              />
              {data.parquet.partitioned && (
                <div className="partition-fields">
                  <span
                    className="link show-advanced"
                    onClick={() => handleAdvancedFieldsLink(PARQUET)}
                  >
                    {isShowAdvanced.parquet ? 'Hide advanced' : 'Show advanced'}
                  </span>
                  <CSSTransition
                    in={isShowAdvanced.parquet}
                    timeout={200}
                    classNames="fade"
                    unmountOnExit
                  >
                    <PartitionFields
                      data={data.parquet}
                      partitionColsOnBlur={() =>
                        handlePartitionColsOnBlur(PARQUET)
                      }
                      partitionColsOnChange={value =>
                        handlePartitionColsOnChange(value, PARQUET)
                      }
                      partitionRadioButtonsState={
                        partitionRadioButtonsState.parquet
                      }
                      rangeOnChange={value =>
                        handleKeyBucketingNumberChange(value, PARQUET)
                      }
                      selectedPartitionKind={selectedPartitionKind.parquet}
                      handlePartitionRadioButtons={value =>
                        handlePartitionRadioButtons(value, PARQUET)
                      }
                      timePartitioningGranularityChange={value =>
                        handleTimePartitioningGranularityChange(value, PARQUET)
                      }
                      triggerPartitionAdvancedCheckboxes={value =>
                        triggerPartitionAdvancedCheckboxes(value, PARQUET)
                      }
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
                text="Store the feature set in a remote object store (e.g. AWS S3 or Azure storage)"
              />
            </CheckBox>
          </div>
          {selectedTargetKind.find(
            kind => checkboxModels.externalOffline.id === kind
          ) && (
            <div className="target-store__inputs-container">
              <Select
                density="normal"
                floatingLabel
                label="File type"
                onClick={handleExternalOfflineKindTypeChange}
                options={externalOfflineKindOptions}
                selectedId={data.externalOffline.kind}
              />
              <Input
                density="normal"
                floatingLabel
                invalid={!isTargetsPathValid}
                label="URL"
                onBlur={handleExternalOfflineKindPathOnBlur}
                onChange={handleExternalOfflineKindPathOnChange}
                placeholder="s3://bucket/path"
                required
                requiredText="This field is required"
                setInvalid={value =>
                  setTargetsPathValid(state => ({
                    ...state,
                    isTargetsPathValid: value
                  }))
                }
                type="text"
                value={data.externalOffline.path}
                wrapperClassName="url"
              />
              {data.externalOffline.kind === PARQUET && (
                <CheckBox
                  item={{ id: 'partitioned', label: 'Partition' }}
                  onChange={id =>
                    triggerPartitionCheckbox(id, EXTERNAL_OFFLINE)
                  }
                  selectedId={data.externalOffline.partitioned}
                />
              )}
              {data.externalOffline.partitioned && (
                <div className="partition-fields">
                  <span
                    className="link show-advanced"
                    onClick={() => handleAdvancedFieldsLink(EXTERNAL_OFFLINE)}
                  >
                    {isShowAdvanced.externalOffline
                      ? 'Hide advanced'
                      : 'Show advanced'}
                  </span>
                  <CSSTransition
                    in={isShowAdvanced.externalOffline}
                    timeout={200}
                    classNames="fade"
                    unmountOnExit
                  >
                    <PartitionFields
                      data={data.externalOffline}
                      partitionColsOnBlur={() =>
                        handlePartitionColsOnBlur(EXTERNAL_OFFLINE)
                      }
                      partitionColsOnChange={value =>
                        handlePartitionColsOnChange(value, EXTERNAL_OFFLINE)
                      }
                      partitionRadioButtonsState={
                        partitionRadioButtonsState.externalOffline
                      }
                      rangeOnChange={value =>
                        handleKeyBucketingNumberChange(value, EXTERNAL_OFFLINE)
                      }
                      selectedPartitionKind={
                        selectedPartitionKind.externalOffline
                      }
                      handlePartitionRadioButtons={value =>
                        handlePartitionRadioButtons(value, EXTERNAL_OFFLINE)
                      }
                      timePartitioningGranularityChange={value =>
                        handleTimePartitioningGranularityChange(
                          value,
                          EXTERNAL_OFFLINE
                        )
                      }
                      triggerPartitionAdvancedCheckboxes={value =>
                        triggerPartitionAdvancedCheckboxes(
                          value,
                          EXTERNAL_OFFLINE
                        )
                      }
                    />
                  </CSSTransition>
                </div>
              )}
            </div>
          )}
        </div>
        {!selectedTargetKind.length && (
          <ErrorMessage message="Must select at least one" />
        )}
      </FeatureSetsPanelSection>
    </div>
  )
}

FeatureSetsPanelTargetStoreView.propTypes = {
  data: PropTypes.shape({}).isRequired,
  handleAdvancedFieldsLink: PropTypes.func.isRequired,
  handleExternalOfflineKindPathOnBlur: PropTypes.func.isRequired,
  handleExternalOfflineKindPathOnChange: PropTypes.func.isRequired,
  handleExternalOfflineKindTypeChange: PropTypes.func.isRequired,
  handleKeyBucketingNumberChange: PropTypes.func.isRequired,
  handleOfflineKindPathOnBlur: PropTypes.func.isRequired,
  handleOnlineKindPathOnBlur: PropTypes.func.isRequired,
  handlePartitionColsOnBlur: PropTypes.func.isRequired,
  handlePartitionColsOnChange: PropTypes.func.isRequired,
  handlePartitionRadioButtons: PropTypes.func.isRequired,
  handleSelectTargetKind: PropTypes.func.isRequired,
  handleTimePartitioningGranularityChange: PropTypes.func.isRequired,
  isShowAdvanced: PropTypes.shape({}).isRequired,
  isTargetsPathValid: PropTypes.bool.isRequired,
  partitionRadioButtonsState: PropTypes.shape({}).isRequired,
  selectedPartitionKind: PropTypes.shape({}).isRequired,
  selectedTargetKind: PropTypes.arrayOf(PropTypes.string).isRequired,
  setData: PropTypes.func.isRequired,
  setTargetsPathValid: PropTypes.func.isRequired,
  triggerPartitionAdvancedCheckboxes: PropTypes.func.isRequired,
  triggerPartitionCheckbox: PropTypes.func.isRequired
}

export default FeatureSetsPanelTargetStoreView
