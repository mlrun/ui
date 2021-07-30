import React from 'react'
import PropTypes from 'prop-types'

import RangeInput from '../../common/RangeInput/RangeInput'
import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'
import CheckBox from '../../common/CheckBox/CheckBox'
import ErrorMessage from '../../common/ErrorMessage/ErrorMessage'
import RadioButtons from '../../common/RadioButtons/RadioButtons'

import {
  partitionCheckboxTargetKind,
  partitionRadioButtonsData,
  timePartitioningGranularityOptions
} from '../../components/FeatureSetsPanel/FeatureSetsPanelTargetStore/featureSetsPanelTargetStore.util'

const PartitionFields = ({
  data,
  handlePartitionRadioButtons,
  partitionColsOnBlur,
  partitionColsOnChange,
  partitionRadioButtonsState,
  rangeOnChange,
  selectedPartitionKind,
  timePartitioningGranularityChange,
  triggerPartitionAdvancedCheckboxes
}) => {
  return (
    <>
      <div className="partition-fields__checkbox-container">
        <CheckBox
          item={{ id: 'byKey' }}
          onChange={id => triggerPartitionAdvancedCheckboxes(id)}
          selectedId={selectedPartitionKind.find(
            kind => partitionCheckboxTargetKind.byKey.id === kind
          )}
        >
          By key
        </CheckBox>
        <CheckBox
          item={{ id: 'byTime' }}
          onChange={id => triggerPartitionAdvancedCheckboxes(id)}
          selectedId={selectedPartitionKind.find(
            kind => partitionCheckboxTargetKind.byTime.id === kind
          )}
        >
          By time
        </CheckBox>
        <CheckBox
          item={{ id: 'byColumns' }}
          onChange={id => triggerPartitionAdvancedCheckboxes(id)}
          selectedId={selectedPartitionKind.find(
            kind => partitionCheckboxTargetKind.byColumns.id === kind
          )}
        >
          By columns
        </CheckBox>
      </div>
      {selectedPartitionKind.includes('byKey') && (
        <div className="radio-buttons-container">
          <RadioButtons
            elements={partitionRadioButtonsData}
            onChangeCallback={value => handlePartitionRadioButtons(value)}
            selectedValue={partitionRadioButtonsState}
          />
        </div>
      )}
      <div className="partition-fields__inputs-container">
        {partitionRadioButtonsState === 'numberOfBuckets' && (
          <RangeInput
            density="normal"
            labelType="floatingLabel"
            label="Number of Buckets"
            required
            min={0}
            onChange={rangeOnChange}
            tip={
              <span>
                If you partition by key and the number of unique keys is very
                high it is recommended to use buckets for better performance. In
                this case the path would be
                <b> path/bucket-num/year=/month=/day=</b> etc.. In case the
                value is 0 then no bucketing will be done and your data will be
                partitioned by key.
              </span>
            }
            value={data.key_bucketing_number || 1}
          />
        )}
        {selectedPartitionKind.includes('byTime') && (
          <Select
            density="normal"
            floatingLabel
            onClick={timePartitioningGranularityChange}
            options={timePartitioningGranularityOptions}
            label="Partition Granularity"
            selectedId={data.time_partitioning_granularity}
          />
        )}
        {selectedPartitionKind.includes('byColumns') && (
          <Input
            density="normal"
            floatingLabel
            onBlur={partitionColsOnBlur}
            onChange={partitionColsOnChange}
            label="Partition Columns"
            placeholder="col1,col2,col3"
            type="text"
            value={data.partition_cols}
            wrapperClassName="partition-cols"
          />
        )}
      </div>
      {selectedPartitionKind.length === 0 && (
        <ErrorMessage message="Must select at least one partitioning option" />
      )}
    </>
  )
}

PartitionFields.propTypes = {
  data: PropTypes.shape({
    key_bucketing_number: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired,
    partition_cols: PropTypes.string.isRequired,
    time_partitioning_granularity: PropTypes.string.isRequired
  }).isRequired,
  handlePartitionRadioButtons: PropTypes.func.isRequired,
  partitionColsOnBlur: PropTypes.func.isRequired,
  partitionColsOnChange: PropTypes.func.isRequired,
  partitionRadioButtonsState: PropTypes.string.isRequired,
  rangeOnChange: PropTypes.func.isRequired,
  selectedPartitionKind: PropTypes.arrayOf(PropTypes.string).isRequired,
  timePartitioningGranularityChange: PropTypes.func.isRequired,
  triggerPartitionAdvancedCheckboxes: PropTypes.func.isRequired
}

export default PartitionFields
