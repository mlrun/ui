import React, { useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import FeatureSetsPanelTargetStoreView from './FeatureSetsPanelTargetStoreView'

import featureStoreActions from '../../../actions/featureStore'
import {
  checkboxModels,
  externalOfflineKindDataInitialState,
  offlineKindDataInitialState,
  onlineKindDataInitialState,
  OTHER_KIND_DEFAULT_FILE_TYPE
} from './featureSetsPanelTargetStore.util'

const FeatureSetsPanelTargetStore = ({
  featureStore,
  isExternalOfflineTargetsPathValid,
  setExternalOfflineTargetsPathValid,
  setNewFeatureSetTarget
}) => {
  const [selectedTargetKind, setSelectedTargetKind] = useState([
    'offline',
    'online'
  ])
  const [externalOfflineKindData, setExternalOfflineKindData] = useState(
    externalOfflineKindDataInitialState
  )
  const [offlineKindData, setOfflineKindData] = useState(
    offlineKindDataInitialState
  )
  const [onlineKindPath, setOnlineKindPath] = useState(
    onlineKindDataInitialState
  )

  const handleKeyBucketingNumberChange = (key_bucketing_number, kind) => {
    if (kind === 'externalOffline') {
      setExternalOfflineKindData(state => ({ ...state, key_bucketing_number }))
    } else {
      setOfflineKindData(state => ({ ...state, key_bucketing_number }))
    }

    setNewFeatureSetTarget(
      featureStore.newFeatureSet.spec.targets.map(targetKind => {
        if (targetKind.name === kind) {
          targetKind.key_bucketing_number = key_bucketing_number
        }

        return targetKind
      })
    )
  }

  const handleOfflineKindPathOnBlur = () => {
    const offlineTarget = featureStore.newFeatureSet.spec.targets.find(
      targetKind => targetKind.name === 'parquet'
    )

    if (offlineTarget.path !== offlineKindData.path) {
      setNewFeatureSetTarget(
        featureStore.newFeatureSet.spec.targets.map(targetKind => {
          if (targetKind.name === 'parquet') {
            targetKind.path = offlineKindData.path
          }

          return targetKind
        })
      )
    }
  }

  const handleOnlineKindPathOnBlur = () => {
    const onlineTarget = featureStore.newFeatureSet.spec.targets.find(
      targetKind => targetKind.name === 'nosql'
    )

    if (onlineTarget.path !== onlineKindPath) {
      setNewFeatureSetTarget(
        featureStore.newFeatureSet.spec.targets.map(targetKind => {
          if (targetKind.name === 'nosql') {
            targetKind.path = onlineKindPath
          }

          return targetKind
        })
      )
    }
  }

  const handleExternalOfflineKindPathOnBlur = event => {
    const otherTarget = featureStore.newFeatureSet.spec.targets.find(
      targetKind => targetKind.name === 'externalOffline'
    )

    if (externalOfflineKindData.path.length === 0) {
      setExternalOfflineTargetsPathValid(false)
    } else if (otherTarget.path !== externalOfflineKindData.path) {
      setNewFeatureSetTarget(
        featureStore.newFeatureSet.spec.targets.map(targetKind => {
          if (targetKind.name === 'externalOffline') {
            targetKind.path = event.target.value
          }

          return targetKind
        })
      )
    }
  }

  const handleExternalOfflineKindPathOnChange = path => {
    if (!isExternalOfflineTargetsPathValid && path.length > 0) {
      setExternalOfflineTargetsPathValid(true)
    }

    setExternalOfflineKindData(state => ({
      ...state,
      path
    }))
  }

  const handleExternalOfflineKindTypeChange = kind => {
    setExternalOfflineKindData(state => ({
      kind,
      path: state.path,
      partitioned: '',
      key_bucketing_number: '',
      partition_cols: '',
      time_partitioning_granularity: 'hour'
    }))
    setNewFeatureSetTarget(
      featureStore.newFeatureSet.spec.targets.map(targetKind => {
        if (targetKind.name === 'externalOffline') {
          targetKind.kind = kind

          if (kind === OTHER_KIND_DEFAULT_FILE_TYPE) {
            delete targetKind.partitioned
            delete targetKind.key_bucketing_number
            delete targetKind.partition_cols
            delete targetKind.time_partitioning_granularity
          }
        }

        return targetKind
      })
    )
  }

  const handlePartitionColsOnBlur = kind => {
    const targetKind = featureStore.newFeatureSet.spec.targets.find(
      targetKind => targetKind.name === kind
    )
    const partition_cols =
      kind === 'parquet'
        ? offlineKindData.partition_cols
        : externalOfflineKindData.partition_cols

    if (partition_cols && targetKind.partition_cols !== partition_cols) {
      setNewFeatureSetTarget(
        featureStore.newFeatureSet.spec.targets.map(targetKind => {
          if (targetKind.name === kind) {
            targetKind.partition_cols = partition_cols
              .split(',')
              .map(partition_col => partition_col.trim())
          }

          return targetKind
        })
      )
    }
  }

  const handleSelectTargetKind = kindId => {
    let newTargets = [...featureStore.newFeatureSet.spec.targets]

    if (selectedTargetKind.find(kind => kind === kindId)) {
      newTargets = newTargets.filter(
        kind => kind.name !== checkboxModels[kindId].data.name
      )
      setSelectedTargetKind(state => state.filter(kind => kind !== kindId))

      if (
        kindId === checkboxModels.externalOffline.id &&
        !isExternalOfflineTargetsPathValid
      ) {
        setExternalOfflineTargetsPathValid(true)
      }
    } else {
      newTargets.push(checkboxModels[kindId].data)
      setSelectedTargetKind(state => [...state, kindId])
    }

    setNewFeatureSetTarget(newTargets)
  }

  const handleTimePartitioningGranularityChange = (
    time_partitioning_granularity,
    kind
  ) => {
    if (kind === 'externalOffline') {
      setExternalOfflineKindData(state => ({
        ...state,
        time_partitioning_granularity
      }))
    } else {
      setOfflineKindData(state => ({ ...state, time_partitioning_granularity }))
    }

    setNewFeatureSetTarget(
      featureStore.newFeatureSet.spec.targets.map(targetKind => {
        if (targetKind.name === kind) {
          targetKind.time_partitioning_granularity = time_partitioning_granularity
        }

        return targetKind
      })
    )
  }

  const triggerOfflinePartition = (id, kind) => {
    if (kind === 'externalOffline') {
      setExternalOfflineKindData(state => ({
        ...state,
        partitioned: state.partitioned === id ? '' : id
      }))
    } else {
      setOfflineKindData(state => ({
        ...state,
        partitioned: state.partitioned === id ? '' : id
      }))
    }

    setNewFeatureSetTarget(
      featureStore.newFeatureSet.spec.targets.map(targetKind => {
        if (targetKind.name === kind) {
          if (
            (kind === 'parquet' && offlineKindData.partitioned !== id) ||
            (kind === 'externalOffline' &&
              externalOfflineKindData.partitioned !== id)
          ) {
            targetKind.partitioned = true
          } else {
            if (kind === 'parquet') {
              setOfflineKindData(state => ({
                ...state,
                key_bucketing_number: '',
                partition_cols: '',
                time_partitioning_granularity: 'hour'
              }))
            } else if (kind === 'externalOffline') {
              setExternalOfflineKindData(state => ({
                ...state,
                key_bucketing_number: '',
                partition_cols: '',
                time_partitioning_granularity: 'hour'
              }))
            }

            delete targetKind.partitioned
            delete targetKind.key_bucketing_number
            delete targetKind.partition_cols
            delete targetKind.time_partitioning_granularity
          }
        }

        return targetKind
      })
    )
  }

  return (
    <FeatureSetsPanelTargetStoreView
      externalOfflineKindData={externalOfflineKindData}
      handleExternalOfflineKindPathOnBlur={handleExternalOfflineKindPathOnBlur}
      handleExternalOfflineKindPathOnChange={
        handleExternalOfflineKindPathOnChange
      }
      handleExternalOfflineKindTypeChange={handleExternalOfflineKindTypeChange}
      handleKeyBucketingNumberChange={handleKeyBucketingNumberChange}
      handleOfflineKindPathOnBlur={handleOfflineKindPathOnBlur}
      handleOnlineKindPathOnBlur={handleOnlineKindPathOnBlur}
      handlePartitionColsOnBlur={handlePartitionColsOnBlur}
      handleSelectTargetKind={handleSelectTargetKind}
      handleTimePartitioningGranularityChange={
        handleTimePartitioningGranularityChange
      }
      isExternalOfflineTargetsPathValid={isExternalOfflineTargetsPathValid}
      offlineKindData={offlineKindData}
      onlineKindPath={onlineKindPath}
      selectedTargetKind={selectedTargetKind}
      setExternalOfflineKindData={setExternalOfflineKindData}
      setOfflineKindData={setOfflineKindData}
      setOnlineKindPath={setOnlineKindPath}
      triggerOfflinePartition={triggerOfflinePartition}
    />
  )
}

FeatureSetsPanelTargetStore.propTypes = {
  isExternalOfflineTargetsPathValid: PropTypes.bool.isRequired,
  setExternalOfflineTargetsPathValid: PropTypes.func.isRequired
}

export default connect(featureStore => ({ ...featureStore }), {
  ...featureStoreActions
})(React.memo(FeatureSetsPanelTargetStore))
