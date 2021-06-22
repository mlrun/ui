import React from 'react'
import PropTypes from 'prop-types'

import RangeInput from '../../common/RangeInput/RangeInput'
import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'

import { timePartitioningGranularityOptions } from '../../components/FeatureSetsPanel/FeatureSetsPanelTargetStore/featureSetsPanelTargetStore.util'

const PartitionFields = ({
  data,
  partitionColsOnBlur,
  rangeOnChange,
  setData,
  timePartitioningGranularityChange
}) => {
  return (
    <>
      <RangeInput
        density="normal"
        floatingLabel
        label="Key Bucketing Number"
        min={0}
        onChange={rangeOnChange}
        tip={
          <span>
            If you partition by key and the number of unique keys is very high
            it is recommended to use buckets for better performance. In this
            case the path would be
            <b> path/bucket-num/year=/month=/day=</b> etc.. In case the value is
            0 then no bucketing will be done and your data will be partitioned
            by key.
          </span>
        }
        value={data.key_bucketing_number}
      />
      <Input
        density="normal"
        floatingLabel
        onBlur={partitionColsOnBlur}
        onChange={partition_cols => {
          setData(state => ({
            ...state,
            partition_cols
          }))
        }}
        label="Partition Columns"
        placeholder="col1,col2,col3"
        type="text"
        value={data.partition_cols}
        wrapperClassName="partition-cols"
      />
      <Select
        density="normal"
        floatingLabel
        onClick={timePartitioningGranularityChange}
        options={timePartitioningGranularityOptions}
        label="Partition Granularity"
        selectedId={data.time_partitioning_granularity}
      />
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
  partitionColsOnBlur: PropTypes.func.isRequired,
  rangeOnChange: PropTypes.func.isRequired,
  setData: PropTypes.func.isRequired,
  timePartitioningGranularityChange: PropTypes.func.isRequired
}

export default PartitionFields
