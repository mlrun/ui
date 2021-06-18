import React from 'react'
import PropTypes from 'prop-types'

import FeatureSetsPanelSection from '../FeatureSetsPanelSection/FeatureSetsPanelSection'
import CheckBox from '../../../common/CheckBox/CheckBox'
import Select from '../../../common/Select/Select'
import Input from '../../../common/Input/Input'

import { ReactComponent as Online } from '../../../images/nosql.svg'
import { ReactComponent as Offline } from '../../../images/db-icon.svg'
import { ReactComponent as Other } from '../../../images/other.svg'
import {
  checkboxModels,
  otherKindOptions
} from './featureSetsPanelTargetStore.util'

import './featureSetsPanelTargetStore.scss'
import PartitionFields from '../../../elements/PartitionFields/PartitionFields'

const FeatureSetsPanelTargetStoreView = ({
  handleKeyBucketingNumberChange,
  handleOfflineKindPathOnBlur,
  handleOnlineKindPathOnBlur,
  handleOtherKindPathOnBlur,
  handleOfflineKindPathOnChange,
  handleOnlineKindPathOnChange,
  handleOtherKindPathOnChange,
  handleOtherKindTypeChange,
  handlePartitionColsOnBlur,
  handleSelectTargetKind,
  handleTimePartitioningGranularityChange,
  isOfflineTargetsPathValid,
  isOnlineTargetsPathValid,
  isOtherTargetsPathValid,
  offlineKindData,
  onlineKindPath,
  otherKindData,
  selectedTargetKind,
  setOfflineKindData,
  setOtherKindData,
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
            </CheckBox>
          </div>
          {selectedTargetKind.find(
            kind => checkboxModels.online.id === kind
          ) && (
            <div className="target-store__inputs-container">
              <Input
                density="normal"
                floatingLabel
                onBlur={handleOnlineKindPathOnBlur}
                onChange={handleOnlineKindPathOnChange}
                label="Path"
                required={!isOnlineTargetsPathValid}
                requiredText="This field is required"
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
            </CheckBox>
          </div>
          {selectedTargetKind.find(
            kind => checkboxModels.offline.id === kind
          ) && (
            <div className="target-store__inputs-container">
              <Input
                density="normal"
                floatingLabel
                onBlur={handleOfflineKindPathOnBlur}
                onChange={handleOfflineKindPathOnChange}
                label="Path"
                required={!isOfflineTargetsPathValid}
                requiredText="This field is required"
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
              item={checkboxModels.other}
              onChange={handleSelectTargetKind}
              selectedId={selectedTargetKind.find(
                kind => checkboxModels.other.id === kind
              )}
            >
              <Other /> Other
            </CheckBox>
          </div>
          {selectedTargetKind.find(
            kind => checkboxModels.other.id === kind
          ) && (
            <div className="target-store__inputs-container">
              <Select
                density="medium"
                floatingLabel
                label="File type"
                onClick={handleOtherKindTypeChange}
                options={otherKindOptions}
                selectedId={otherKindData.kind}
              />
              <Input
                density="normal"
                floatingLabel
                label="URL"
                onBlur={handleOtherKindPathOnBlur}
                onChange={handleOtherKindPathOnChange}
                placeholder="s3://bucket/path"
                required={!isOtherTargetsPathValid}
                requiredText="This field is required"
                type="text"
                value={otherKindData.path}
                wrapperClassName="url"
              />
              {otherKindData.kind === 'parquet' && (
                <CheckBox
                  item={{ id: 'partitioned', label: 'Partition' }}
                  onChange={id => triggerOfflinePartition(id, 'other')}
                  selectedId={otherKindData.partitioned}
                />
              )}
              {otherKindData.partitioned && (
                <PartitionFields
                  data={otherKindData}
                  partitionColsOnBlur={() => handlePartitionColsOnBlur('other')}
                  rangeOnChange={value =>
                    handleKeyBucketingNumberChange(value, 'other')
                  }
                  setData={setOtherKindData}
                  timePartitioningGranularityChange={value =>
                    handleTimePartitioningGranularityChange(value, 'other')
                  }
                />
              )}
            </div>
          )}
        </div>
      </FeatureSetsPanelSection>
    </div>
  )
}

FeatureSetsPanelTargetStoreView.propTypes = {
  handleKeyBucketingNumberChange: PropTypes.func.isRequired,
  handleOfflineKindPathOnBlur: PropTypes.func.isRequired,
  handleOnlineKindPathOnBlur: PropTypes.func.isRequired,
  handleOtherKindPathOnBlur: PropTypes.func.isRequired,
  handleOfflineKindPathOnChange: PropTypes.func.isRequired,
  handleOnlineKindPathOnChange: PropTypes.func.isRequired,
  handleOtherKindPathOnChange: PropTypes.func.isRequired,
  handleOtherKindTypeChange: PropTypes.func.isRequired,
  handlePartitionColsOnBlur: PropTypes.func.isRequired,
  handleSelectTargetKind: PropTypes.func.isRequired,
  handleTimePartitioningGranularityChange: PropTypes.func.isRequired,
  isOfflineTargetsPathValid: PropTypes.bool.isRequired,
  isOnlineTargetsPathValid: PropTypes.bool.isRequired,
  isOtherTargetsPathValid: PropTypes.bool.isRequired,
  offlineKindData: PropTypes.shape({}).isRequired,
  onlineKindPath: PropTypes.string.isRequired,
  otherKindData: PropTypes.shape({}).isRequired,
  selectedTargetKind: PropTypes.arrayOf(PropTypes.string).isRequired,
  setOfflineKindData: PropTypes.func.isRequired,
  setOtherKindData: PropTypes.func.isRequired,
  triggerOfflinePartition: PropTypes.func.isRequired
}

export default FeatureSetsPanelTargetStoreView
