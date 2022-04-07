import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { cloneDeep } from 'lodash'

import FeatureSetsPanelTargetStoreView from './FeatureSetsPanelTargetStoreView'

import featureStoreActions from '../../../actions/featureStore'
import {
  EXTERNAL_OFFLINE,
  EXTERNAL_OFFLINE_KIND_DEFAULT_FILE_TYPE,
  NOSQL,
  PARQUET,
  checkboxModels,
  dataInitialState,
  generatePath,
  isShowAdvancedInitialState,
  partitionRadioButtonsInitialState,
  selectedPartitionKindInitialState,
  selectedTargetKindInitialState,
  targetsPathEditDataInitialState
} from './featureSetsPanelTargetStore.util'

const FeatureSetsPanelTargetStore = ({
  featureStore,
  project,
  setDisableButtons,
  setNewFeatureSetTarget,
  setValidation,
  validation
}) => {
  const [data, setData] = useState(dataInitialState)
  const [selectedTargetKind, setSelectedTargetKind] = useState(
    selectedTargetKindInitialState
  )
  const [selectedPartitionKind, setSelectedPartitionKind] = useState(
    selectedPartitionKindInitialState
  )
  const [showAdvanced, setShowAdvanced] = useState(isShowAdvancedInitialState)
  const [partitionRadioButtonsState, setPartitionRadioButtonsState] = useState(
    partitionRadioButtonsInitialState
  )
  const [targetsPathEditData, setTargetsPathEditData] = useState(
    targetsPathEditDataInitialState
  )

  const onlineTarget = useMemo(
    () =>
      featureStore.newFeatureSet.spec.targets.find(
        targetKind => targetKind.name === NOSQL
      ),
    [featureStore.newFeatureSet.spec.targets]
  )

  const offlineTarget = useMemo(
    () =>
      featureStore.newFeatureSet.spec.targets.find(
        targetKind => targetKind.name === PARQUET
      ),
    [featureStore.newFeatureSet.spec.targets]
  )

  useEffect(() => {
    if (
      !targetsPathEditData.online.isModified &&
      !targetsPathEditData.online.isEditMode
    ) {
      setData(state => ({
        ...state,
        online: {
          ...state.online,
          path: generatePath(
            project,
            featureStore.newFeatureSet.metadata.name,
            NOSQL
          )
        }
      }))
    }

    if (
      !targetsPathEditData.parquet.isModified &&
      !targetsPathEditData.parquet.isEditMode
    ) {
      setData(state => ({
        ...state,
        parquet: {
          ...state.parquet,
          path: generatePath(
            project,
            featureStore.newFeatureSet.metadata.name,
            PARQUET
          )
        }
      }))
    }
  }, [
    featureStore.newFeatureSet.metadata.name,
    project,
    targetsPathEditData.online.isEditMode,
    targetsPathEditData.online.isModified,
    targetsPathEditData.parquet.isEditMode,
    targetsPathEditData.parquet.isModified
  ])

  useEffect(() => {
    if (
      (onlineTarget &&
        onlineTarget.path !== data.online.path &&
        !targetsPathEditData.online.isEditMode) ||
      (selectedTargetKind.includes(PARQUET) &&
        offlineTarget &&
        offlineTarget.path !== data.parquet.path &&
        !targetsPathEditData.parquet.isEditMode)
    ) {
      const targets = cloneDeep(featureStore.newFeatureSet.spec.targets).map(
        target => {
          if (
            target.kind === PARQUET &&
            !targetsPathEditData.parquet.isModified
          ) {
            target.path = generatePath(
              project,
              featureStore.newFeatureSet.metadata.name,
              PARQUET
            )
          } else if (
            target.kind === NOSQL &&
            !targetsPathEditData.online.isModified
          ) {
            target.path = generatePath(
              project,
              featureStore.newFeatureSet.metadata.name,
              NOSQL
            )
          }

          return target
        }
      )
      setNewFeatureSetTarget(targets)
    }
  }, [
    data.online.path,
    data.parquet.path,
    featureStore.newFeatureSet.metadata.name,
    featureStore.newFeatureSet.spec.targets,
    offlineTarget,
    onlineTarget,
    project,
    selectedTargetKind,
    setNewFeatureSetTarget,
    targetsPathEditData.online.isEditMode,
    targetsPathEditData.online.isModified,
    targetsPathEditData.parquet.isEditMode,
    targetsPathEditData.parquet.isModified
  ])

  const handleAdvancedLinkClick = kind => {
    setShowAdvanced(prev => ({
      ...prev,
      [kind]: !prev[kind]
    }))
  }

  const handleKeyBucketingNumberChange = (key_bucketing_number, kind) => {
    setData(state => ({
      ...state,
      [kind]: {
        ...state[kind],
        key_bucketing_number
      }
    }))

    setNewFeatureSetTarget(
      featureStore.newFeatureSet.spec.targets.map(targetKind => {
        if (targetKind.name === kind) {
          targetKind.key_bucketing_number = key_bucketing_number
        }

        return targetKind
      })
    )
  }

  const handleOfflineKindPathChange = () => {
    if (
      targetsPathEditData.parquet.isEditMode &&
      validation.isOfflineTargetPathValid
    ) {
      setTargetsPathEditData(state => ({
        ...state,
        parquet: {
          isEditMode: false,
          isModified: targetsPathEditData.parquet.isModified
            ? state.parquet.isModified
            : offlineTarget.path !== data.parquet.path
        }
      }))
      setDisableButtons(state => ({
        ...state,
        isOfflineTargetPathEditModeClosed: true
      }))

      if (offlineTarget.path !== data.parquet.path) {
        setNewFeatureSetTarget(
          featureStore.newFeatureSet.spec.targets.map(targetKind => {
            if (targetKind.name === PARQUET) {
              targetKind.path = data.parquet.path
            }

            return targetKind
          })
        )
      }
    } else {
      setTargetsPathEditData(state => ({
        ...state,
        parquet: {
          ...state.parquet,
          isEditMode: true
        }
      }))
      setDisableButtons(state => ({
        ...state,
        isOfflineTargetPathEditModeClosed: false
      }))
    }
  }

  const handleOnlineKindPathChange = () => {
    if (
      targetsPathEditData.online.isEditMode &&
      validation.isOnlineTargetPathValid
    ) {
      setTargetsPathEditData(state => ({
        ...state,
        online: {
          isEditMode: false,
          isModified: targetsPathEditData.online.isModified
            ? state.online.isModified
            : onlineTarget.path !== data.online.path
        }
      }))
      setDisableButtons(state => ({
        ...state,
        isOnlineTargetPathEditModeClosed: true
      }))

      if (onlineTarget.path !== data.online.path) {
        setNewFeatureSetTarget(
          featureStore.newFeatureSet.spec.targets.map(targetKind => {
            if (targetKind.name === NOSQL) {
              targetKind.path = data.online.path
            }

            return targetKind
          })
        )
      }
    } else {
      setTargetsPathEditData(state => ({
        ...state,
        online: {
          ...state.online,
          isEditMode: true
        }
      }))
      setDisableButtons(state => ({
        ...state,
        isOnlineTargetPathEditModeClosed: false
      }))
    }
  }

  const handleExternalOfflineKindPathOnBlur = event => {
    const target = featureStore.newFeatureSet.spec.targets.find(
      targetKind => targetKind.name === EXTERNAL_OFFLINE
    )

    if (event.target.value !== target.path) {
      setNewFeatureSetTarget(
        featureStore.newFeatureSet.spec.targets.map(targetKind => {
          if (targetKind.name === EXTERNAL_OFFLINE) {
            targetKind.path = event.target.value
          }

          return targetKind
        })
      )
    }
  }

  const handleDiscardPathChange = kind => {
    setData(state => ({
      ...state,
      [kind]: {
        ...state[kind],
        path: kind === PARQUET ? offlineTarget.path : onlineTarget.path
      }
    }))
    setTargetsPathEditData(state => ({
      ...state,
      [kind]: {
        ...state[kind],
        isEditMode: false
      }
    }))
    setDisableButtons(state => ({
      ...state,
      [kind === PARQUET
        ? 'isOfflineTargetPathEditModeClosed'
        : 'isOnlineTargetPathEditModeClosed']: true
    }))
    setValidation(state => ({
      ...state,
      [kind === PARQUET
        ? 'isOfflineTargetPathValid'
        : 'isOnlineTargetPathValid']: true
    }))
  }

  const handleExternalOfflineKindTypeChange = kind => {
    setData(state => ({
      ...state,
      externalOffline: {
        ...dataInitialState.externalOffline,
        kind,
        path: state.externalOffline.path
      }
    }))
    setNewFeatureSetTarget(
      featureStore.newFeatureSet.spec.targets.map(targetKind => {
        if (targetKind.name === EXTERNAL_OFFLINE) {
          targetKind.kind = kind

          if (kind === EXTERNAL_OFFLINE_KIND_DEFAULT_FILE_TYPE) {
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
    const partition_cols = data[kind].partition_cols

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

  const handlePartitionColsOnChange = (cols, kind) => {
    setData(state => ({
      ...state,
      [kind]: { ...state[kind], partition_cols: cols }
    }))
  }

  const handleSelectTargetKind = kindId => {
    let newTargets = [...featureStore.newFeatureSet.spec.targets]

    if (selectedTargetKind.find(kind => kind === kindId)) {
      newTargets = newTargets.filter(
        kind => kind.name !== checkboxModels[kindId].data.name
      )

      setSelectedTargetKind(state => state.filter(kind => kind !== kindId))
      setTargetsPathEditData(state => ({
        ...state,
        [kindId]: {
          isEditMode: false,
          isModified: false
        }
      }))
      setDisableButtons(state => ({
        ...state,
        [kindId === PARQUET
          ? 'isOfflineTargetPathEditModeClosed'
          : 'isOnlineTargetPathEditModeClosed']: true
      }))
      setValidation(state => ({
        ...state,
        [kindId === PARQUET
          ? 'isOfflineTargetPathValid'
          : 'isOnlineTargetPathValid']: true
      }))

      if (
        kindId === checkboxModels.externalOffline.id &&
        !validation.isExternalOfflineTargetPathValid
      ) {
        setValidation(state => ({
          ...state,
          isExternalOfflineTargetPathValid: true
        }))
      }

      if (
        kindId === checkboxModels.externalOffline.id ||
        kindId === checkboxModels.parquet.id
      ) {
        setData(state => ({
          ...state,
          [kindId]: { ...dataInitialState[kindId] }
        }))
        setShowAdvanced({
          ...isShowAdvancedInitialState,
          [kindId]: false
        })
        setPartitionRadioButtonsState(state => ({
          ...state,
          [kindId]: 'districtKeys'
        }))
        setSelectedPartitionKind(state => {
          return {
            ...state,
            [kindId]: [...selectedPartitionKindInitialState[kindId]]
          }
        })
      }
    } else {
      const path =
        kindId === EXTERNAL_OFFLINE
          ? ''
          : generatePath(
              project,
              featureStore.newFeatureSet.metadata.name,
              dataInitialState[kindId].kind
            )
      if (kindId === checkboxModels[kindId].id) {
        setData(state => ({
          ...state,
          [kindId]: { ...dataInitialState[kindId], path }
        }))
      }

      newTargets.push({ ...dataInitialState[kindId], path })
      setSelectedTargetKind(state => [...state, kindId])
    }

    setNewFeatureSetTarget(newTargets)
  }

  const handlePartitionRadioButtonClick = (value, targetKind) => {
    const keyBucketingNumber = value === 'districtKeys' ? 0 : 1

    setPartitionRadioButtonsState(state => ({
      ...state,
      [targetKind]: value
    }))
    setData(state => ({
      ...state,
      [targetKind]: {
        ...state[targetKind],
        key_bucketing_number: keyBucketingNumber
      }
    }))
    setNewFeatureSetTarget(
      featureStore.newFeatureSet.spec.targets.map(target => {
        if (target.name === targetKind) {
          target.key_bucketing_number = keyBucketingNumber
        }

        return target
      })
    )
  }

  const handleTimePartitioningGranularityChange = (time, kind) => {
    setData(state => ({
      ...state,
      [kind]: { ...state[kind], time_partitioning_granularity: time }
    }))
    setNewFeatureSetTarget(
      featureStore.newFeatureSet.spec.targets.map(targetKind => {
        if (targetKind.name === kind) {
          targetKind.time_partitioning_granularity = time
        }

        return targetKind
      })
    )
  }

  const triggerPartitionAdvancedCheckboxes = (typeId, kind) => {
    if (selectedPartitionKind[kind].find(kind => kind === typeId)) {
      setSelectedPartitionKind(state => ({
        ...state,
        [kind]: state[kind].filter(kind => kind !== typeId)
      }))
      setData(state => ({
        ...state,
        [kind]: {
          ...state[kind],
          key_bucketing_number:
            typeId === 'byKey' ? '' : state[kind].key_bucketing_number,
          time_partitioning_granularity:
            typeId === 'byTime'
              ? ''
              : state[kind].time_partitioning_granularity,
          partition_cols:
            typeId === 'byColumns' ? '' : state[kind].partition_cols
        }
      }))

      if (typeId === 'byKey') {
        setPartitionRadioButtonsState(state => ({
          ...state,
          [kind]: 'districtKeys'
        }))
      }
    } else {
      setSelectedPartitionKind(state => ({
        ...state,
        [kind]: [...state[kind], typeId]
      }))
      setData(state => ({
        ...state,
        [kind]: {
          ...state[kind],
          key_bucketing_number:
            typeId === 'byKey' ? 0 : state[kind].key_bucketing_number,
          time_partitioning_granularity:
            typeId === 'byTime'
              ? 'hour'
              : state[kind].time_partitioning_granularity,
          partition_cols:
            typeId === 'byColumns' ? '' : state[kind].partition_cols
        }
      }))
    }

    setNewFeatureSetTarget(
      featureStore.newFeatureSet.spec.targets.map(targetKind => {
        if (targetKind.name === kind) {
          if (typeId === 'byKey') {
            if (!selectedPartitionKind[kind].includes(typeId)) {
              targetKind.key_bucketing_number = 0
            } else {
              delete targetKind.key_bucketing_number
            }
          }

          if (typeId === 'byTime') {
            if (!selectedPartitionKind[kind].includes(typeId)) {
              targetKind.time_partitioning_granularity = 'hour'
            } else {
              delete targetKind.time_partitioning_granularity
            }
          }

          if (typeId === 'byColumns') {
            if (!selectedPartitionKind[kind].includes(typeId)) {
              targetKind.partition_cols = ''
            } else {
              delete targetKind.partition_cols
            }
          }
        }

        return targetKind
      })
    )
    setValidation(state => ({
      ...state,
      isTimestampKeyValid: true
    }))
  }

  const triggerPartitionCheckbox = (id, kind) => {
    if (kind === EXTERNAL_OFFLINE || kind === PARQUET) {
      setData(state => {
        return data[kind].partitioned
          ? {
              ...state,
              [kind]: {
                ...dataInitialState[kind],
                path: state[kind].path,
                kind: PARQUET
              }
            }
          : {
              ...state,
              [kind]: {
                ...state[kind],
                partitioned: state[kind].partitioned === id ? '' : id,
                key_bucketing_number: '',
                partition_cols: '',
                time_partitioning_granularity: 'hour'
              }
            }
      })

      if (data[kind].partitioned) {
        setShowAdvanced(state => ({ ...state, [kind]: false }))
        setPartitionRadioButtonsState(state => ({
          ...state,
          [kind]: 'districtKeys'
        }))
        setSelectedPartitionKind(state => ({
          ...state,
          [kind]: [...selectedPartitionKindInitialState[kind]]
        }))
      }
    }

    const targets = cloneDeep(featureStore.newFeatureSet.spec.targets).map(
      targetKind => {
        if (targetKind.name === kind) {
          if (
            (kind === PARQUET || kind === EXTERNAL_OFFLINE) &&
            data[kind].partitioned !== id
          ) {
            targetKind.partitioned = true
            targetKind.time_partitioning_granularity = 'hour'
          } else {
            setData(state => ({
              ...state,
              [kind]: {
                ...state[kind],
                key_bucketing_number: '',
                partition_cols: '',
                time_partitioning_granularity: 'hour'
              }
            }))

            delete targetKind.partitioned
            delete targetKind.key_bucketing_number
            delete targetKind.partition_cols
            delete targetKind.time_partitioning_granularity
          }
        }

        return targetKind
      }
    )

    setNewFeatureSetTarget(targets)
    setValidation(state => ({
      ...state,
      isTimestampKeyValid: true
    }))
  }

  return (
    <FeatureSetsPanelTargetStoreView
      data={data}
      handleAdvancedLinkClick={handleAdvancedLinkClick}
      handleDiscardPathChange={handleDiscardPathChange}
      handleExternalOfflineKindPathOnBlur={handleExternalOfflineKindPathOnBlur}
      handleExternalOfflineKindTypeChange={handleExternalOfflineKindTypeChange}
      handleKeyBucketingNumberChange={handleKeyBucketingNumberChange}
      handleOfflineKindPathChange={handleOfflineKindPathChange}
      handleOnlineKindPathChange={handleOnlineKindPathChange}
      handlePartitionColsOnChange={handlePartitionColsOnChange}
      handlePartitionColsOnBlur={handlePartitionColsOnBlur}
      handlePartitionRadioButtonClick={handlePartitionRadioButtonClick}
      handleSelectTargetKind={handleSelectTargetKind}
      handleTimePartitioningGranularityChange={
        handleTimePartitioningGranularityChange
      }
      partitionRadioButtonsState={partitionRadioButtonsState}
      selectedPartitionKind={selectedPartitionKind}
      selectedTargetKind={selectedTargetKind}
      setData={setData}
      setValidation={setValidation}
      showAdvanced={showAdvanced}
      targetsPathEditData={targetsPathEditData}
      triggerPartitionAdvancedCheckboxes={triggerPartitionAdvancedCheckboxes}
      triggerPartitionCheckbox={triggerPartitionCheckbox}
      validation={validation}
    />
  )
}

FeatureSetsPanelTargetStore.propTypes = {
  project: PropTypes.string.isRequired,
  setDisableButtons: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.shape({}).isRequired
}

export default connect(featureStore => ({ ...featureStore }), {
  ...featureStoreActions
})(React.memo(FeatureSetsPanelTargetStore))
