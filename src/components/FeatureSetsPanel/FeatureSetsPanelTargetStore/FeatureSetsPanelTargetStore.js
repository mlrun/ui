import React, { useState } from 'react'
import { connect } from 'react-redux'

import FeatureSetsPanelTargetStoreView from './FeatureSetsPanelTargetStoreView'

import artifactsAction from '../../../actions/artifacts'
import {
  checkboxModels,
  OTHER_KIND_DEFAULT_FILE_TYPE
} from './featureSetsPanelTargetStore.util'

const FeatureSetsPanelTargetStore = ({
  artifactsStore,
  isOfflineTargetsPathValid,
  isOnlineTargetsPathValid,
  isOtherTargetsPathValid,
  setNewFeatureSetTarget,
  setOfflineTargetsPathValid,
  setOnlineTargetsPathValid,
  setOtherTargetsPathValid
}) => {
  const [selectedTargetKind, setSelectedTargetKind] = useState(['offline'])
  const [otherKindData, setOtherKindData] = useState({
    kind: OTHER_KIND_DEFAULT_FILE_TYPE,
    path: '',
    partitioned: '',
    key_bucketing_number: '',
    partition_cols: '',
    time_partitioning_granularity: 'hour'
  })
  const [offlineKindData, setOfflineKindData] = useState({
    path: '',
    partitioned: '',
    key_bucketing_number: '',
    partition_cols: '',
    time_partitioning_granularity: 'hour'
  })
  const [onlineKindPath, setOnlineKindPath] = useState('')

  const handleKeyBucketingNumberChange = (key_bucketing_number, kind) => {
    if (kind === 'other') {
      setOtherKindData(state => ({ ...state, key_bucketing_number }))
    } else {
      setOfflineKindData(state => ({ ...state, key_bucketing_number }))
    }

    setNewFeatureSetTarget(
      artifactsStore.newFeatureSet.spec.targets.map(targetKind => {
        if (targetKind.name === kind) {
          targetKind.key_bucketing_number = key_bucketing_number
        }

        return targetKind
      })
    )
  }

  const handleOfflineKindPathOnBlur = () => {
    const offlineTarget = artifactsStore.newFeatureSet.spec.targets.find(
      targetKind => targetKind.name === 'parquet'
    )

    if (offlineKindData.path.length === 0) {
      setOfflineTargetsPathValid(false)
    } else if (offlineTarget.path !== offlineKindData.path) {
      setNewFeatureSetTarget(
        artifactsStore.newFeatureSet.spec.targets.map(targetKind => {
          if (targetKind.name === 'parquet') {
            targetKind.path = offlineKindData.path
          }

          return targetKind
        })
      )
    }
  }

  const handleOnlineKindPathOnBlur = () => {
    const onlineTarget = artifactsStore.newFeatureSet.spec.targets.find(
      targetKind => targetKind.name === 'nosql'
    )

    if (onlineKindPath.length === 0) {
      setOnlineTargetsPathValid(false)
    } else if (onlineTarget.path !== onlineKindPath) {
      setNewFeatureSetTarget(
        artifactsStore.newFeatureSet.spec.targets.map(targetKind => {
          if (targetKind.name === 'nosql') {
            targetKind.path = onlineKindPath
          }

          return targetKind
        })
      )
    }
  }

  const handleOtherKindPathOnBlur = event => {
    const otherTarget = artifactsStore.newFeatureSet.spec.targets.find(
      targetKind => targetKind.name === 'other'
    )

    if (otherKindData.path.length === 0) {
      setOtherTargetsPathValid(false)
    } else if (otherTarget.path !== otherKindData.path) {
      setNewFeatureSetTarget(
        artifactsStore.newFeatureSet.spec.targets.map(targetKind => {
          if (targetKind.name === 'other') {
            targetKind.path = event.target.value
          }

          return targetKind
        })
      )
    }
  }

  const handleOfflineKindPathOnChange = path => {
    if (!isOfflineTargetsPathValid && path.length > 0) {
      setOfflineTargetsPathValid(true)
    }

    setOfflineKindData(state => ({
      ...state,
      path
    }))
  }

  const handleOnlineKindPathOnChange = path => {
    if (!isOnlineTargetsPathValid && path.length > 0) {
      setOnlineTargetsPathValid(true)
    }

    setOnlineKindPath(path)
  }

  const handleOtherKindPathOnChange = path => {
    if (!isOtherTargetsPathValid && path.length > 0) {
      setOtherTargetsPathValid(true)
    }

    setOtherKindData(state => ({
      ...state,
      path
    }))
  }

  const handleOtherKindTypeChange = kind => {
    setOtherKindData(state => ({
      kind,
      path: state.path,
      partitioned: '',
      key_bucketing_number: '',
      partition_cols: '',
      time_partitioning_granularity: 'hour'
    }))
    setNewFeatureSetTarget(
      artifactsStore.newFeatureSet.spec.targets.map(targetKind => {
        if (targetKind.name === 'other') {
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
    const targetKind = artifactsStore.newFeatureSet.spec.targets.find(
      targetKind => targetKind.name === kind
    )
    const partition_cols =
      kind === 'parquet'
        ? offlineKindData.partition_cols
        : otherKindData.partition_cols

    if (partition_cols && targetKind.partition_cols !== partition_cols) {
      setNewFeatureSetTarget(
        artifactsStore.newFeatureSet.spec.targets.map(targetKind => {
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
    let newTargets = [...artifactsStore.newFeatureSet.spec.targets]

    if (selectedTargetKind.find(kind => kind === kindId)) {
      newTargets = newTargets.filter(
        kind => kind.name !== checkboxModels[kindId].data.name
      )
      setSelectedTargetKind(state => state.filter(kind => kind !== kindId))

      if (kindId === checkboxModels.other.id && !isOtherTargetsPathValid) {
        setOtherTargetsPathValid(true)
      }

      if (kindId === checkboxModels.online.id && !isOnlineTargetsPathValid) {
        setOnlineTargetsPathValid(true)
      }

      if (kindId === checkboxModels.offline.id && !isOfflineTargetsPathValid) {
        setOfflineTargetsPathValid(true)
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
    if (kind === 'other') {
      setOtherKindData(state => ({ ...state, time_partitioning_granularity }))
    } else {
      setOfflineKindData(state => ({ ...state, time_partitioning_granularity }))
    }

    setNewFeatureSetTarget(
      artifactsStore.newFeatureSet.spec.targets.map(targetKind => {
        if (targetKind.name === kind) {
          targetKind.time_partitioning_granularity = time_partitioning_granularity
        }

        return targetKind
      })
    )
  }

  const triggerOfflinePartition = (id, kind) => {
    if (kind === 'other') {
      setOtherKindData(state => ({
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
      artifactsStore.newFeatureSet.spec.targets.map(targetKind => {
        if (targetKind.name === kind) {
          if (
            (kind === 'parquet' && offlineKindData.partitioned !== id) ||
            (kind === 'other' && otherKindData.partitioned !== id)
          ) {
            targetKind.partitioned = true
          } else {
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
      handleKeyBucketingNumberChange={handleKeyBucketingNumberChange}
      handleOfflineKindPathOnBlur={handleOfflineKindPathOnBlur}
      handleOnlineKindPathOnBlur={handleOnlineKindPathOnBlur}
      handleOtherKindPathOnBlur={handleOtherKindPathOnBlur}
      handleOfflineKindPathOnChange={handleOfflineKindPathOnChange}
      handleOnlineKindPathOnChange={handleOnlineKindPathOnChange}
      handleOtherKindPathOnChange={handleOtherKindPathOnChange}
      handleOtherKindTypeChange={handleOtherKindTypeChange}
      handlePartitionColsOnBlur={handlePartitionColsOnBlur}
      handleSelectTargetKind={handleSelectTargetKind}
      handleTimePartitioningGranularityChange={
        handleTimePartitioningGranularityChange
      }
      isOfflineTargetsPathValid={isOfflineTargetsPathValid}
      isOnlineTargetsPathValid={isOnlineTargetsPathValid}
      isOtherTargetsPathValid={isOtherTargetsPathValid}
      offlineKindData={offlineKindData}
      onlineKindPath={onlineKindPath}
      otherKindData={otherKindData}
      selectedTargetKind={selectedTargetKind}
      setOfflineKindData={setOfflineKindData}
      setOtherKindData={setOtherKindData}
      triggerOfflinePartition={triggerOfflinePartition}
    />
  )
}

export default connect(artifactsStore => ({ ...artifactsStore }), {
  ...artifactsAction
})(React.memo(FeatureSetsPanelTargetStore))
