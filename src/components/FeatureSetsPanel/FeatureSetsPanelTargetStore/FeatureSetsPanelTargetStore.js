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
import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { connect, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { cloneDeep, isEmpty } from 'lodash'

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
  targetsPathEditDataInitialState,
  handlePathChange,
  ONLINE
} from './featureSetsPanelTargetStore.util'

import { isUrlInputValid } from '../UrlPath.utils'

const FeatureSetsPanelTargetStore = ({
  disableButtons,
  featureStore,
  project,
  setDisableButtons,
  setNewFeatureSetTarget,
  setValidation,
  validation
}) => {
  const [data, setData] = useState(dataInitialState)
  const [selectedTargetKind, setSelectedTargetKind] = useState(selectedTargetKindInitialState)
  const [selectedPartitionKind, setSelectedPartitionKind] = useState(
    selectedPartitionKindInitialState
  )
  const [showAdvanced, setShowAdvanced] = useState(isShowAdvancedInitialState)
  const [partitionRadioButtonsState, setPartitionRadioButtonsState] = useState(
    partitionRadioButtonsInitialState
  )
  const [targetsPathEditData, setTargetsPathEditData] = useState(targetsPathEditDataInitialState)
  const [passthroughtEnabled, setPassThrouthEnabled] = useState(false)
  const frontendSpec = useSelector(store => store.appStore.frontendSpec)

  const onlineTarget = useMemo(
    () => featureStore.newFeatureSet.spec.targets.find(targetKind => targetKind.name === NOSQL),
    [featureStore.newFeatureSet.spec.targets]
  )

  const offlineTarget = useMemo(
    () => featureStore.newFeatureSet.spec.targets.find(targetKind => targetKind.name === PARQUET),
    [featureStore.newFeatureSet.spec.targets]
  )

  useEffect(() => {
    if (!targetsPathEditData.online.isModified && !targetsPathEditData.online.isEditMode) {
      setData(state => ({
        ...state,
        online: {
          ...state.online,
          path: generatePath(
            frontendSpec.feature_store_data_prefixes,
            project,
            NOSQL,
            featureStore.newFeatureSet.metadata.name,
            ''
          )
        }
      }))
    }

    if (!targetsPathEditData.parquet.isModified && !targetsPathEditData.parquet.isEditMode) {
      setData(state => ({
        ...state,
        parquet: {
          ...state.parquet,
          path: generatePath(
            frontendSpec.feature_store_data_prefixes,
            project,
            PARQUET,
            featureStore.newFeatureSet.metadata.name,
            state.parquet?.partitioned ? '' : PARQUET
          )
        }
      }))
    }
  }, [
    featureStore.newFeatureSet.metadata.name,
    featureStore.newFeatureSet.spec.source.kind,
    frontendSpec.feature_store_data_prefixes,
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
        !targetsPathEditData.online.isEditMode &&
        !targetsPathEditData.online.isModified) ||
      (selectedTargetKind.includes(PARQUET) &&
        offlineTarget &&
        offlineTarget.path !== data.parquet.path &&
        !targetsPathEditData.parquet.isEditMode &&
        !targetsPathEditData.parquet.isModified)
    ) {
      const targets = cloneDeep(featureStore.newFeatureSet.spec.targets).map(target => {
        if (target.kind === PARQUET && !targetsPathEditData.parquet.isModified) {
          target.path = generatePath(
            frontendSpec.feature_store_data_prefixes,
            project,
            PARQUET,
            featureStore.newFeatureSet.metadata.name,
            data.parquet.partitioned ? '' : PARQUET
          )
        } else if (target.kind === NOSQL && !targetsPathEditData.online.isModified) {
          target.path = generatePath(
            frontendSpec.feature_store_data_prefixes,
            project,
            NOSQL,
            featureStore.newFeatureSet.metadata.name,
            ''
          )
        }

        return target
      })
      setNewFeatureSetTarget(targets)
    }
  }, [
    data.online.path,
    data.parquet.partitioned,
    data.parquet.path,
    featureStore.newFeatureSet.metadata.name,
    featureStore.newFeatureSet.spec.source.kind,
    featureStore.newFeatureSet.spec.targets,
    frontendSpec.feature_store_data_prefixes,
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

  useEffect(() => {
    if (isEmpty(frontendSpec.feature_store_data_prefixes)) {
      setTargetsPathEditData(state => ({
        ...state,
        [PARQUET]: {
          ...state[PARQUET],
          isEditMode: true
        },
        [ONLINE]: {
          ...state[ONLINE],
          isEditMode: true
        }
      }))
      setDisableButtons(state => ({
        ...state,
        isOfflineTargetPathEditModeClosed: false,
        isOnlineTargetPathEditModeClosed: false
      }))
      setValidation(state => ({
        ...state,
        isOfflineTargetPathValid: false,
        isOnlineTargetPathValid: false
      }))
    }
  }, [frontendSpec.feature_store_data_prefixes, setDisableButtons, setValidation])

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
          return { ...targetKind, key_bucketing_number: key_bucketing_number }
        }

        return targetKind
      })
    )
  }

  const handleOfflineKindPathChange = () => {
    handlePathChange(
      PARQUET,
      PARQUET,
      validation.isOfflineTargetPathValid,
      targetsPathEditData,
      data,
      offlineTarget,
      featureStore.newFeatureSet.spec.targets,
      'isOfflineTargetPathEditModeClosed',
      setTargetsPathEditData,
      setDisableButtons,
      setNewFeatureSetTarget
    )
  }

  const handleOnlineKindPathChange = () => {
    handlePathChange(
      ONLINE,
      NOSQL,
      validation.isOnlineTargetPathValid,
      targetsPathEditData,
      data,
      onlineTarget,
      featureStore.newFeatureSet.spec.targets,
      'isOnlineTargetPathEditModeClosed',
      setTargetsPathEditData,
      setDisableButtons,
      setNewFeatureSetTarget
    )
  }

  const handleUrlSelectOnChange = () => {
    setValidation(state => ({
      ...state,
      isExternalOfflineTargetPathValid: true
    }))

    setNewFeatureSetTarget(
      featureStore.newFeatureSet.spec.targets.map(targetKind => {
        if (targetKind.name === EXTERNAL_OFFLINE) {
          return { ...targetKind, path: '' }
        }

        return targetKind
      })
    )
  }

  const handleExternalOfflineKindPathOnFocus = () => {
    setDisableButtons(state => ({
      ...state,
      isExternalOfflineTargetPathEditModeClosed: false
    }))
  }

  const handleExternalOfflineKindPathOnBlur = ({ selectValue, inputValue }) => {
    if (!isUrlInputValid(selectValue, inputValue, data[EXTERNAL_OFFLINE].kind)) {
      setValidation(prevState => ({
        ...prevState,
        isExternalOfflineTargetPathValid: false
      }))
    } else {
      if (!validation.isExternalOfflineTargetPathValid) {
        setValidation(prevState => ({
          ...prevState,
          isExternalOfflineTargetPathValid: true
        }))
      }

      setNewFeatureSetTarget(
        featureStore.newFeatureSet.spec.targets.map(targetKind => {
          if (targetKind.name === EXTERNAL_OFFLINE) {
            return { ...targetKind, path: `${selectValue}${inputValue}` }
          }

          return targetKind
        })
      )
    }

    setData(state => ({
      ...state,
      [EXTERNAL_OFFLINE]: { ...state[EXTERNAL_OFFLINE], path: `${selectValue}${inputValue}` }
    }))

    setDisableButtons(state => ({
      ...state,
      isExternalOfflineTargetPathEditModeClosed: true
    }))
  }

  const handleDiscardPathChange = kind => {
    const currentStoreType = kind === ONLINE ? NOSQL : kind
    const currentKind = featureStore.newFeatureSet.spec.targets.find(
      el => el.kind === currentStoreType
    )

    if (currentKind.path.length > 0) {
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
        [kind === PARQUET ? 'isOfflineTargetPathValid' : 'isOnlineTargetPathValid']: true
      }))
    }
  }

  const handleExternalOfflineKindTypeChange = kind => {
    setData(state => ({
      ...state,
      externalOffline: {
        ...state.externalOffline,
        kind
      }
    }))
    setNewFeatureSetTarget(
      featureStore.newFeatureSet.spec.targets.map(targetKind => {
        if (targetKind.name === EXTERNAL_OFFLINE) {
          const target = { ...targetKind, kind }

          if (kind === EXTERNAL_OFFLINE_KIND_DEFAULT_FILE_TYPE) {
            delete target.partitioned
            delete target.key_bucketing_number
            delete target.partition_cols
            delete target.time_partitioning_granularity
          }

          return target
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
            return {
              ...targetKind,
              partition_cols: partition_cols.split(',').map(partition_col => partition_col.trim())
            }
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

  const handleSelectTargetKind = useCallback(
    kindId => {
      let newTargets = [...featureStore.newFeatureSet.spec.targets]

      if (selectedTargetKind.find(kind => kind === kindId)) {
        newTargets = newTargets.filter(kind => kind.name !== checkboxModels[kindId].data.name)

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
          [kindId === PARQUET ? 'isOfflineTargetPathValid' : 'isOnlineTargetPathValid']: true
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

        if (kindId === checkboxModels.externalOffline.id || kindId === checkboxModels.parquet.id) {
          setData(state => ({
            ...state,
            [kindId]: { ...dataInitialState[kindId] }
          }))
          setShowAdvanced(prev => ({
            ...prev,
            [kindId]: false
          }))
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
                frontendSpec.feature_store_data_prefixes,
                project,
                dataInitialState[kindId].kind,
                featureStore.newFeatureSet.metadata.name,
                dataInitialState[kindId].kind === PARQUET ? PARQUET : ''
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
    },
    [
      featureStore.newFeatureSet.metadata.name,
      featureStore.newFeatureSet.spec.targets,
      frontendSpec.feature_store_data_prefixes,
      project,
      selectedTargetKind,
      setDisableButtons,
      setNewFeatureSetTarget,
      setValidation,
      validation.isExternalOfflineTargetPathValid
    ]
  )

  const clearTargets = useCallback(() => {
    setSelectedTargetKind([])
    setNewFeatureSetTarget([])
    setTargetsPathEditData(state => ({
      ...state,
      [PARQUET]: {
        isEditMode: false,
        isModified: false
      },
      [EXTERNAL_OFFLINE]: {
        isEditMode: false,
        isModified: false
      },
      [ONLINE]: {
        isEditMode: false,
        isModified: false
      }
    }))
    setDisableButtons(state => ({
      ...state,
      isOfflineTargetPathEditModeClosed: true,
      isOnlineTargetPathEditModeClosed: true
    }))
    setValidation(state => ({
      ...state,
      isOfflineTargetPathValid: true,
      isOnlineTargetPathValid: true,
      isExternalOfflineTargetPathValid: true
    }))
    setData(state => ({
      ...state,
      [PARQUET]: { ...dataInitialState[PARQUET] },
      [EXTERNAL_OFFLINE]: { ...dataInitialState[EXTERNAL_OFFLINE] }
    }))
    setShowAdvanced(prev => ({
      ...prev,
      [PARQUET]: false,
      [EXTERNAL_OFFLINE]: false
    }))
    setPartitionRadioButtonsState(state => ({
      ...state,
      [PARQUET]: 'districtKeys',
      [EXTERNAL_OFFLINE]: 'districtKeys'
    }))
    setSelectedPartitionKind(state => {
      return {
        ...state,
        [PARQUET]: [...selectedPartitionKindInitialState[PARQUET]],
        [EXTERNAL_OFFLINE]: [...selectedPartitionKindInitialState[EXTERNAL_OFFLINE]]
      }
    })
  }, [setDisableButtons, setNewFeatureSetTarget, setValidation])

  useEffect(() => {
    if (featureStore.newFeatureSet.spec.passthrough && !passthroughtEnabled) {
      clearTargets()
      setPassThrouthEnabled(true)
    } else if (!featureStore.newFeatureSet.spec.passthrough && passthroughtEnabled) {
      setPassThrouthEnabled(false)
    }
  }, [clearTargets, featureStore.newFeatureSet.spec.passthrough, passthroughtEnabled])

  const handlePartitionRadioButtonClick = (value, target) => {
    const keyBucketingNumber = value === 'districtKeys' ? 0 : 1

    setPartitionRadioButtonsState(state => ({
      ...state,
      [target]: value
    }))
    setData(state => ({
      ...state,
      [target]: {
        ...state[target],
        key_bucketing_number: keyBucketingNumber
      }
    }))
    setNewFeatureSetTarget(
      featureStore.newFeatureSet.spec.targets.map(targetKind => {
        if (targetKind.name === target) {
          return { ...targetKind, key_bucketing_number: keyBucketingNumber }
        }

        return targetKind
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
          return { ...targetKind, time_partitioning_granularity: time }
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
          key_bucketing_number: typeId === 'byKey' ? '' : state[kind].key_bucketing_number,
          time_partitioning_granularity:
            typeId === 'byTime' ? '' : state[kind].time_partitioning_granularity,
          partition_cols: typeId === 'byColumns' ? '' : state[kind].partition_cols
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
          key_bucketing_number: typeId === 'byKey' ? 0 : state[kind].key_bucketing_number,
          time_partitioning_granularity:
            typeId === 'byTime' ? 'hour' : state[kind].time_partitioning_granularity,
          partition_cols: typeId === 'byColumns' ? '' : state[kind].partition_cols
        }
      }))
    }

    setNewFeatureSetTarget(
      featureStore.newFeatureSet.spec.targets.map(targetKind => {
        if (targetKind.name === kind) {
          const target = { ...targetKind }
          if (typeId === 'byKey') {
            if (!selectedPartitionKind[kind].includes(typeId)) {
              target.key_bucketing_number = 0
            } else {
              delete target.key_bucketing_number
            }
          }

          if (typeId === 'byTime') {
            if (!selectedPartitionKind[kind].includes(typeId)) {
              target.time_partitioning_granularity = 'hour'
            } else {
              delete target.time_partitioning_granularity
            }
          }

          if (typeId === 'byColumns') {
            if (!selectedPartitionKind[kind].includes(typeId)) {
              target.partition_cols = ''
            } else {
              delete target.partition_cols
            }
          }

          return target
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
    setData(state => {
      let path = state[kind].path

      if (
        kind === PARQUET &&
        !targetsPathEditData.parquet.isEditMode &&
        !targetsPathEditData.parquet.isModified
      ) {
        path = generatePath(
          frontendSpec.feature_store_data_prefixes,
          project,
          data[kind].kind,
          featureStore.newFeatureSet.metadata.name,
          data[kind].partitioned ? PARQUET : ''
        )
      } else if (kind === PARQUET && targetsPathEditData.parquet.isModified) {
        path = state[kind].partitioned ? `${path}.parquet` : path.replace(/\.[^.]+$/, '')
      }

      return data[kind]?.partitioned
        ? {
            ...state,
            [kind]: {
              ...dataInitialState[kind],
              path,
              kind: PARQUET
            }
          }
        : {
            ...state,
            [kind]: {
              ...state[kind],
              path,
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

    const targets = cloneDeep(featureStore.newFeatureSet.spec.targets).map(targetKind => {
      if (targetKind.name === kind) {
        if ((kind === PARQUET || kind === EXTERNAL_OFFLINE) && data[kind].partitioned !== id) {
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
    })

    setNewFeatureSetTarget(targets)
    setValidation(state => ({
      ...state,
      isTimestampKeyValid: true
    }))
  }

  return (
    <FeatureSetsPanelTargetStoreView
      data={data}
      disableButtons={disableButtons}
      featureStore={featureStore}
      handleAdvancedLinkClick={handleAdvancedLinkClick}
      handleDiscardPathChange={handleDiscardPathChange}
      handleExternalOfflineKindPathOnBlur={handleExternalOfflineKindPathOnBlur}
      handleExternalOfflineKindPathOnFocus={handleExternalOfflineKindPathOnFocus}
      handleExternalOfflineKindTypeChange={handleExternalOfflineKindTypeChange}
      handleKeyBucketingNumberChange={handleKeyBucketingNumberChange}
      handleOfflineKindPathChange={handleOfflineKindPathChange}
      handleOnlineKindPathChange={handleOnlineKindPathChange}
      handlePartitionColsOnChange={handlePartitionColsOnChange}
      handlePartitionColsOnBlur={handlePartitionColsOnBlur}
      handlePartitionRadioButtonClick={handlePartitionRadioButtonClick}
      handleSelectTargetKind={handleSelectTargetKind}
      handleTimePartitioningGranularityChange={handleTimePartitioningGranularityChange}
      handleUrlSelectOnChange={handleUrlSelectOnChange}
      partitionRadioButtonsState={partitionRadioButtonsState}
      frontendSpecIsNotEmpty={!isEmpty(frontendSpec.feature_store_data_prefixes)}
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
  disableButtons: PropTypes.shape({}).isRequired,
  featureStore: PropTypes.shape({}).isRequired,
  project: PropTypes.string.isRequired,
  setDisableButtons: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.shape({}).isRequired
}

export default connect(featureStore => ({ ...featureStore }), {
  ...featureStoreActions
})(React.memo(FeatureSetsPanelTargetStore))
