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

import { ErrorMessage } from 'igz-controls/components'
import RangeInput from '../../common/RangeInput/RangeInput'
import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'
import CheckBox from '../../common/CheckBox/CheckBox'
import RadioButtons from '../../common/RadioButtons/RadioButtons'

import {
  partitionCheckboxTargetKind,
  partitionRadioButtonsData,
  timePartitioningGranularityOptions
} from '../../components/FeatureSetsPanel/FeatureSetsPanelTargetStore/featureSetsPanelTargetStore.util'

const PartitionFields = React.forwardRef(
  (
    {
      data,
      handlePartitionRadioButtonClick,
      partitionColsOnBlur,
      partitionColsOnChange,
      partitionRadioButtonsState,
      rangeOnChange,
      selectedPartitionKind,
      setPartitionColumnsValidation,
      timePartitioningGranularityChange,
      triggerPartitionAdvancedCheckboxes,
      validation
    },
    ref
  ) => {
    return (
      <>
        <div className="partition-fields__checkbox-container" ref={ref}>
          {Object.keys(partitionCheckboxTargetKind).map((type, index) => (
            <CheckBox
              item={{ id: type, label: partitionCheckboxTargetKind[type].label }}
              key={index}
              onChange={id => triggerPartitionAdvancedCheckboxes(id)}
              selectedId={selectedPartitionKind.find(
                kind => partitionCheckboxTargetKind[type].id === kind
              )}
            />
          ))}
        </div>
        {selectedPartitionKind.includes('byKey') && (
          <div className="radio-buttons-container">
            <RadioButtons
              elements={partitionRadioButtonsData}
              onChangeCallback={handlePartitionRadioButtonClick}
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
              invalid={!validation.partitionBuckets}
              min={0}
              onChange={rangeOnChange}
              tip={
                <span>
                  If you partition by key and the number of unique keys is very high it is
                  recommended to use buckets for better performance. In this case the path would be
                  <b> path/bucket-num/year=/month=/day=</b> etc.. In case the value is 0 then no
                  bucketing will be done and your data will be partitioned by key.
                </span>
              }
              value={data.key_bucketing_number}
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
              invalid={!validation.partitionColumns}
              onBlur={partitionColsOnBlur}
              onChange={partitionColsOnChange}
              label="Partition Columns"
              placeholder="col1,col2,col3"
              setInvalid={setPartitionColumnsValidation}
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
)

PartitionFields.displayName = 'PartitionFields'

PartitionFields.propTypes = {
  data: PropTypes.shape({
    key_bucketing_number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    partition_cols: PropTypes.string.isRequired,
    time_partitioning_granularity: PropTypes.string.isRequired
  }).isRequired,
  handlePartitionRadioButtonClick: PropTypes.func.isRequired,
  partitionColsOnBlur: PropTypes.func.isRequired,
  partitionColsOnChange: PropTypes.func.isRequired,
  partitionRadioButtonsState: PropTypes.string.isRequired,
  rangeOnChange: PropTypes.func.isRequired,
  selectedPartitionKind: PropTypes.arrayOf(PropTypes.string).isRequired,
  setPartitionColumnsValidation: PropTypes.func.isRequired,
  timePartitioningGranularityChange: PropTypes.func.isRequired,
  triggerPartitionAdvancedCheckboxes: PropTypes.func.isRequired,
  validation: PropTypes.object.isRequired
}

export default PartitionFields
