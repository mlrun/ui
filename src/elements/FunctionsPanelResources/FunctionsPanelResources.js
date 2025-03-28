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
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isNumber } from 'lodash'
import PropTypes from 'prop-types'

import FunctionsPanelResourcesView from './FunctionsPanelResourcesView'

import { createNewVolume } from '../../utils/createNewVolume'
import {
  getDefaultVolumeMounts,
  VOLUME_MOUNT_AUTO_TYPE,
  VOLUME_MOUNT_NONE_TYPE
} from './functionsPanelResources.util'
import {
  generateFullCpuValue,
  generateFullMemoryValue,
  getDefaultCpuUnit,
  getDefaultMemoryUnit,
  getLimitsGpuType,
  getSelectedCpuOption,
  setCpuValidation,
  setMemoryDropdownValidation,
  setMemoryInputValidation
} from '../../utils/panelResources.util'
import { generateFunctionPriorityLabel } from '../../utils/generateFunctionPriorityLabel'
import { FUNCTION_PANEL_MODE } from '../../types'
import { PANEL_CREATE_MODE } from '../../constants'
import { getPreemptionMode } from '../../utils/getPreemptionMode'
import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'
import {
  setNewFunctionDisableAutoMount,
  setNewFunctionPreemtionMode,
  setNewFunctionPriorityClassName,
  setNewFunctionResources,
  setNewFunctionVolumeMounts,
  setNewFunctionVolumes
} from '../../reducers/functionReducer'

const FunctionsPanelResources = ({ defaultData, mode, setValidation, validation }) => {
  const dispatch = useDispatch()
  const gpuType = useMemo(
    () => getLimitsGpuType(defaultData.resources?.limits),
    [defaultData.resources?.limits]
  )
  const functionsStore = useSelector(store => store.functionsStore)
  const frontendSpec = useSelector(store => store.appStore.frontendSpec)
  const [podsPriorityClassName, setPodsPriorityClassName] = useState(
    defaultData.priority_class_name ||
      functionsStore.newFunction.spec.priority_class_name ||
      frontendSpec.default_function_priority_class_name ||
      ''
  )
  const defaultPodsResources = useMemo(() => {
    return frontendSpec?.default_function_pod_resources ?? {}
  }, [frontendSpec.default_function_pod_resources])

  const preemptionMode = useMemo(() => {
    return getPreemptionMode(
      frontendSpec.feature_flags?.preemption_nodes,
      defaultData.preemption_mode,
      frontendSpec.default_function_preemption_mode
    )
  }, [
    defaultData.preemption_mode,
    frontendSpec.default_function_preemption_mode,
    frontendSpec.feature_flags
  ])

  const [data, setData] = useState({
    disable_auto_mount: defaultData.disable_auto_mount ?? true,
    volumeMounts: getDefaultVolumeMounts(
      defaultData.volume_mounts ?? [],
      defaultData.volumes ?? [],
      mode
    ),
    volumeMount: VOLUME_MOUNT_AUTO_TYPE,
    volumes: defaultData.volumes ?? [],
    limits: {
      cpu: defaultData.resources?.limits?.cpu ?? defaultPodsResources?.limits?.cpu ?? '',
      cpuUnit: getDefaultCpuUnit(
        defaultData.resources?.limits ?? {},
        defaultPodsResources?.limits?.cpu
      ),
      memory: defaultData.resources?.limits?.memory ?? defaultPodsResources?.limits?.memory ?? '',
      [gpuType]:
        defaultData.resources?.limits?.[gpuType] ?? defaultPodsResources?.limits?.gpu ?? '',
      memoryUnit: getDefaultMemoryUnit(
        defaultData.resources?.limits ?? {},
        defaultPodsResources?.limits?.memory
      )
    },
    preemptionMode,
    requests: {
      cpu: defaultData.resources?.requests?.cpu ?? defaultPodsResources?.requests?.cpu ?? '',
      cpuUnit: getDefaultCpuUnit(
        defaultData.resources?.requests ?? {},
        defaultPodsResources?.requests?.cpu
      ),
      memory:
        defaultData.resources?.requests?.memory ?? defaultPodsResources?.requests?.memory ?? '',
      memoryUnit: getDefaultMemoryUnit(
        defaultData.resources?.requests ?? {},
        defaultPodsResources?.requests?.memory
      )
    }
  })

  const validFunctionPriorityClassNames = useMemo(() => {
    return (frontendSpec.valid_function_priority_class_names ?? []).map(className => ({
      id: className,
      label: generateFunctionPriorityLabel(className)
    }))
  }, [frontendSpec.valid_function_priority_class_names])

  useEffect(() => {
    if (mode === PANEL_CREATE_MODE) {
      dispatch(setNewFunctionPreemtionMode(preemptionMode))
      dispatch(
        setNewFunctionPriorityClassName(frontendSpec.default_function_priority_class_name ?? '')
      )

      dispatch(setNewFunctionDisableAutoMount(false))
    }
  }, [dispatch, frontendSpec.default_function_priority_class_name, mode, preemptionMode])

  useEffect(() => {
    if (isEveryObjectValueEmpty(functionsStore.newFunction.spec.resources)) {
      dispatch(
        setNewFunctionResources({
          limits: {
            cpu: defaultData.resources?.limits?.cpu ?? defaultPodsResources?.limits?.cpu ?? '',
            memory:
              defaultData.resources?.limits?.memory ?? defaultPodsResources?.limits?.memory ?? '',
            [gpuType]:
              defaultData.resources?.limits?.[gpuType] ?? defaultPodsResources?.limits?.gpu ?? ''
          },
          requests: {
            cpu: defaultData.resources?.requests?.cpu ?? defaultPodsResources?.requests?.cpu ?? '',
            memory:
              defaultData.resources?.requests?.memory ??
              defaultPodsResources?.requests?.memory ??
              ''
          }
        })
      )
    }
  }, [
    defaultData.resources,
    defaultPodsResources,
    dispatch,
    functionsStore.newFunction.spec.resources,
    gpuType
  ])

  const handleAddNewVolume = newVolume => {
    const generatedVolume = createNewVolume(newVolume)
    const generatedVolumeMount = {
      isDefault: false,
      data: {
        type: newVolume.type,
        name: newVolume.name,
        mountPath: newVolume.path
      },
      canBeModified: true
    }

    setData(state => ({
      ...state,
      volumeMounts: [...state.volumeMounts, generatedVolumeMount],
      volumes: [...state.volumes, generatedVolume]
    }))
    dispatch(
      setNewFunctionVolumeMounts([
        ...functionsStore.newFunction.spec.volume_mounts,
        {
          name: generatedVolumeMount.data.name,
          mountPath: generatedVolumeMount.data.mountPath
        }
      ])
    )
    dispatch(setNewFunctionVolumes([...functionsStore.newFunction.spec.volumes, generatedVolume]))
  }

  const handleEditVolume = (volumes, volumeMounts) => {
    setData(state => ({
      ...state,
      volumeMounts,
      volumes
    }))
    dispatch(setNewFunctionVolumes([...volumes]))
    dispatch(
      setNewFunctionVolumeMounts(
        volumeMounts.map(volume => ({
          name: volume.data.name,
          mountPath: volume.data.mountPath
        }))
      )
    )
  }

  const handleDeleteVolume = (volumes, volumeMounts) => {
    setData(state => ({
      ...state,
      volumeMounts,
      volumes
    }))
    dispatch(
      setNewFunctionVolumeMounts(
        volumeMounts.map(volume => ({
          name: volume.data.name,
          mountPath: volume.data.mountPath
        }))
      )
    )
    dispatch(setNewFunctionVolumes(volumes))
  }

  const handleSelectPreemptionMode = value => {
    setData(state => ({
      ...state,
      preemptionMode: value
    }))
    dispatch(setNewFunctionPreemtionMode(value))
  }

  const handleSelectVolumeMount = value => {
    switch (value) {
      case VOLUME_MOUNT_AUTO_TYPE:
        setData(state => ({
          ...state,
          volumes: [],
          volumeMounts: [],
          volumeMount: value
        }))
        dispatch(setNewFunctionVolumes([]))
        dispatch(setNewFunctionVolumeMounts([]))
        dispatch(setNewFunctionDisableAutoMount(false))
        break
      case VOLUME_MOUNT_NONE_TYPE:
        setData(state => ({
          ...state,
          volumes: [],
          volumeMounts: [],
          volumeMount: value
        }))
        dispatch(setNewFunctionVolumes([]))
        dispatch(setNewFunctionVolumeMounts([]))
        dispatch(setNewFunctionDisableAutoMount(true))
        break
      default:
        setData(state => ({
          ...state,
          volumeMount: value
        }))
        dispatch(setNewFunctionDisableAutoMount(true))
    }
  }

  const selectPodsPriorityClassName = value => {
    dispatch(setNewFunctionPriorityClassName(value))
    setPodsPriorityClassName(value)
  }

  const handleSelectMemoryUnit = (value, type) => {
    const unit = value.match(/i/) ? value.slice(0, value.match(/i/).index + 1) : value.slice(0, 1)

    setData(state => ({
      ...state,
      [type]: {
        ...state[type],
        memory:
          state[type].memory.length > 0
            ? `${Number.parseInt(state[type].memory)}${value !== 'Bytes' ? unit : ''}`
            : state[type].memory,
        memoryUnit: value
      }
    }))

    if (data[type].memory.length > 0) {
      dispatch(
        setNewFunctionResources({
          [type]:
            data[type].memory.length > 0
              ? {
                  ...functionsStore.newFunction.spec.resources[type],
                  memory: `${Number.parseInt(data[type].memory)}${value !== 'Bytes' ? unit : ''}`
                }
              : functionsStore.newFunction.spec.resources[type]
        })
      )
    }

    setMemoryDropdownValidation(data, setValidation, type, value)
  }

  const setMemoryValue = (value, type, validationField) => {
    const convertedMemoryValue = value.toString()
    const memory = generateFullMemoryValue(convertedMemoryValue, type, data)

    setData(state => ({
      ...state,
      [type]: {
        ...state[type],
        memory
      }
    }))
    dispatch(
      setNewFunctionResources({
        ...functionsStore.newFunction.spec.resources,
        [type]: {
          ...functionsStore.newFunction.spec.resources[type],
          memory
        }
      })
    )
    setMemoryInputValidation(data, setValidation, type, validationField, convertedMemoryValue)
  }

  const handleSelectCpuUnit = (value, type) => {
    const selectedOption = getSelectedCpuOption(value)

    setData(state => ({
      ...state,
      [type]:
        state[type].cpu.length > 0
          ? {
              ...state[type],
              cpu: selectedOption.onChange(state[type].cpu),
              cpuUnit: value
            }
          : {
              ...state[type],
              cpuUnit: value
            }
    }))

    if (data[type].cpu.length > 0) {
      dispatch(
        setNewFunctionResources({
          [type]:
            data[type].cpu.length > 0
              ? {
                  ...functionsStore.newFunction.spec.resources[type],
                  cpu: selectedOption.onChange(data[type].cpu)
                }
              : functionsStore.newFunction.spec.resources[type]
        })
      )
    }
  }

  const setCpuValue = (value, type, validationField) => {
    const convertedValue = value.toString()

    setData(state => ({
      ...state,
      [type]: {
        ...state[type],
        cpu: generateFullCpuValue(convertedValue, type, state)
      }
    }))
    dispatch(
      setNewFunctionResources({
        ...functionsStore.newFunction.spec.resources,
        [type]: {
          ...functionsStore.newFunction.spec.resources[type],
          cpu: generateFullCpuValue(convertedValue, type, data)
        }
      })
    )

    setCpuValidation(data, setValidation, type, validationField, convertedValue)
  }

  const setGpuValue = value => {
    let isValid = true

    if (isNumber(value) && Number(value) <= 0) {
      isValid = false
    }

    setData(state => ({
      ...state,
      limits: {
        ...state.limits,
        [gpuType]: String(value)
      }
    }))
    dispatch(
      setNewFunctionResources({
        ...functionsStore.newFunction.spec.resources,
        limits: {
          ...functionsStore.newFunction.spec.resources.limits,
          [gpuType]: String(value)
        }
      })
    )
    setValidation(prevState => ({ ...prevState, isGpuLimitValid: isValid }))
  }

  return (
    <FunctionsPanelResourcesView
      data={data}
      gpuType={gpuType}
      handleAddNewVolume={handleAddNewVolume}
      handleDeleteVolume={handleDeleteVolume}
      handleEditVolume={handleEditVolume}
      handleSelectCpuUnit={handleSelectCpuUnit}
      handleSelectMemoryUnit={handleSelectMemoryUnit}
      handleSelectPreemptionMode={handleSelectPreemptionMode}
      handleSelectVolumeMount={handleSelectVolumeMount}
      mode={mode}
      podsPriorityClassName={podsPriorityClassName}
      selectPodsPriorityClassName={selectPodsPriorityClassName}
      setCpuValue={setCpuValue}
      setData={setData}
      setGpuValue={setGpuValue}
      setMemoryValue={setMemoryValue}
      setValidation={setValidation}
      validFunctionPriorityClassNames={validFunctionPriorityClassNames}
      validation={validation}
    />
  )
}

FunctionsPanelResources.defaultProp = {
  defaultData: {}
}

FunctionsPanelResources.propTypes = {
  defaultData: PropTypes.shape({}),
  mode: FUNCTION_PANEL_MODE.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.shape({})
}

export default FunctionsPanelResources
