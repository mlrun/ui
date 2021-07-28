import React from 'react'
import PropTypes from 'prop-types'

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
  checkboxModels,
  otherKindOptions
} from './featureSetsPanelTargetStore.util'

import './featureSetsPanelTargetStore.scss'

const FeatureSetsPanelTargetStoreView = ({
  externalOfflineKindData,
  handleExternalOfflineKindPathOnBlur,
  handleExternalOfflineKindPathOnChange,
  handleKeyBucketingNumberChange,
  handleOfflineKindPathOnBlur,
  handleOnlineKindPathOnBlur,
  handleExternalOfflineKindTypeChange,
  handlePartitionColsOnBlur,
  handleSelectTargetKind,
  handleTimePartitioningGranularityChange,
  isExternalOfflineTargetsPathValid,
  offlineKindData,
  onlineKindPath,
  selectedTargetKind,
  setExternalOfflineKindData,
  setOfflineKindData,
  setOnlineKindPath,
  triggerOfflinePartition
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
                onChange={path => setOnlineKindPath(path)}
                placeholder={checkboxModels.online.data.path}
                type="text"
                value={onlineKindPath}
              />
            </div>
          )}
        </div>
        <div className="target-store__item">
          <div className="target-store__checkbox-container">
            <CheckBox
              item={checkboxModels.offline}
              onChange={handleSelectTargetKind}
              selectedId={selectedTargetKind.find(
                kind => checkboxModels.offline.id === kind
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
            kind => checkboxModels.offline.id === kind
          ) && (
            <div className="target-store__inputs-container">
              <Input
                density="normal"
                floatingLabel
                label="Path"
                onBlur={handleOfflineKindPathOnBlur}
                onChange={path =>
                  setOfflineKindData(state => ({
                    ...state,
                    path
                  }))
                }
                placeholder={checkboxModels.offline.data.path}
                type="text"
                value={offlineKindData.path}
                wrapperClassName="offline-path"
              />
              <CheckBox
                item={{ id: 'partitioned', label: 'Partition' }}
                onChange={id => triggerOfflinePartition(id, 'parquet')}
                selectedId={offlineKindData.partitioned}
              />
              {offlineKindData.partitioned && (
                <PartitionFields
                  data={offlineKindData}
                  partitionColsOnBlur={() =>
                    handlePartitionColsOnBlur('parquet')
                  }
                  rangeOnChange={value =>
                    handleKeyBucketingNumberChange(value, 'parquet')
                  }
                  setData={setOfflineKindData}
                  timePartitioningGranularityChange={value =>
                    handleTimePartitioningGranularityChange(value, 'parquet')
                  }
                />
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
                options={otherKindOptions}
                selectedId={externalOfflineKindData.kind}
              />
              <Input
                density="normal"
                floatingLabel
                invalid={!isExternalOfflineTargetsPathValid}
                label="URL"
                onBlur={handleExternalOfflineKindPathOnBlur}
                onChange={handleExternalOfflineKindPathOnChange}
                placeholder="s3://bucket/path"
                required
                requiredText="This field is required"
                type="text"
                value={externalOfflineKindData.path}
                wrapperClassName="url"
              />
              {externalOfflineKindData.kind === 'parquet' && (
                <CheckBox
                  item={{ id: 'partitioned', label: 'Partition' }}
                  onChange={id =>
                    triggerOfflinePartition(id, 'externalOffline')
                  }
                  selectedId={externalOfflineKindData.partitioned}
                />
              )}
              {externalOfflineKindData.partitioned && (
                <PartitionFields
                  data={externalOfflineKindData}
                  partitionColsOnBlur={() =>
                    handlePartitionColsOnBlur('externalOffline')
                  }
                  rangeOnChange={value =>
                    handleKeyBucketingNumberChange(value, 'externalOffline')
                  }
                  setData={setExternalOfflineKindData}
                  timePartitioningGranularityChange={value =>
                    handleTimePartitioningGranularityChange(
                      value,
                      'externalOffline'
                    )
                  }
                />
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
  externalOfflineKindData: PropTypes.shape({}).isRequired,
  handleExternalOfflineKindPathOnBlur: PropTypes.func.isRequired,
  handleExternalOfflineKindPathOnChange: PropTypes.func.isRequired,
  handleExternalOfflineKindTypeChange: PropTypes.func.isRequired,
  handleKeyBucketingNumberChange: PropTypes.func.isRequired,
  handleOfflineKindPathOnBlur: PropTypes.func.isRequired,
  handleOnlineKindPathOnBlur: PropTypes.func.isRequired,
  handlePartitionColsOnBlur: PropTypes.func.isRequired,
  handleSelectTargetKind: PropTypes.func.isRequired,
  handleTimePartitioningGranularityChange: PropTypes.func.isRequired,
  isExternalOfflineTargetsPathValid: PropTypes.bool.isRequired,
  offlineKindData: PropTypes.shape({}).isRequired,
  onlineKindPath: PropTypes.string.isRequired,
  selectedTargetKind: PropTypes.arrayOf(PropTypes.string).isRequired,
  setExternalOfflineKindData: PropTypes.func.isRequired,
  setOfflineKindData: PropTypes.func.isRequired,
  setOnlineKindPath: PropTypes.func.isRequired,
  triggerOfflinePartition: PropTypes.func.isRequired
}

export default FeatureSetsPanelTargetStoreView
