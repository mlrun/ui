import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import JobsPanelResourcesView from './JobsPanelResourcesView'

import { panelActions } from '../JobsPanel/panelReducer'
import {
  generateCpuValue,
  generateMemoryValue
} from '../../utils/panelResources.util'
import { generateFunctionPriorityLabel } from '../../utils/generateFunctionPriorityLabel'
import { setRangeInputValidation } from './jobsPanelResources.util'
import jobsActions from '../../actions/jobs'

const JobsPanelResources = ({
  frontendSpec,
  panelDispatch,
  panelState,
  setNewJobPriorityClassName,
  setValidation,
  validation
}) => {
  const defaultPodsResources = useMemo(() => {
    return frontendSpec?.default_function_pod_resources
  }, [frontendSpec.default_function_pod_resources])
  const validFunctionPriorityClassNames = useMemo(() => {
    return (frontendSpec.valid_function_priority_class_names ?? []).map(
      className => ({
        id: className,
        label: generateFunctionPriorityLabel(className)
      })
    )
  }, [frontendSpec.valid_function_priority_class_names])

  const generateResourcesData = useCallback(
    () => ({
      limitsCpu: generateCpuValue(
        panelState.limits.cpu || defaultPodsResources?.limits?.cpu || ''
      ),
      requestsCpu: generateCpuValue(
        panelState.requests.cpu || defaultPodsResources?.requests?.cpu || ''
      ),
      requestsMemory: generateMemoryValue(
        panelState.requests.memory ||
          defaultPodsResources?.requests?.memory ||
          ''
      ),
      limitsMemory: generateMemoryValue(
        panelState.limits.memory || defaultPodsResources?.limits.memory || ''
      )
    }),
    [
      defaultPodsResources.limits.cpu,
      defaultPodsResources.limits.memory,
      defaultPodsResources.requests.cpu,
      defaultPodsResources.requests.memory,
      panelState.limits.cpu,
      panelState.limits.memory,
      panelState.requests.cpu,
      panelState.requests.memory
    ]
  )

  const handleSelectMemoryUnit = value => {
    if (value !== 'Bytes') {
      const unit = value.match(/i/)
        ? value.slice(0, value.match(/i/).index + 1)
        : value.slice(0, 1)

      if (panelState.requests.memory.length > 0) {
        panelDispatch({
          type: panelActions.SET_REQUESTS_MEMORY,
          payload: Number.parseInt(panelState.requests.memory) + unit
        })
      }

      if (panelState.limits.memory.length > 0) {
        panelDispatch({
          type: panelActions.SET_LIMITS_MEMORY,
          payload: Number.parseInt(panelState.limits.memory) + unit
        })
      }
    } else {
      if (panelState.requests.memory.match(/[a-zA-Z]/)) {
        panelDispatch({
          type: panelActions.SET_REQUESTS_MEMORY,
          payload: Number.parseInt(panelState.requests.memory)
        })
      }

      if (panelState.limits.memory.match(/[a-zA-Z]/)) {
        panelDispatch({
          type: panelActions.SET_LIMITS_MEMORY,
          payload: Number.parseInt(panelState.limits.memory)
        })
      }
    }

    panelDispatch({
      type: panelActions.SET_MEMORY_UNIT,
      payload: value
    })
  }

  const handleSelectCpuUnit = value => {
    if (value.match(/m/)) {
      if (panelState.requests.cpu > 0) {
        panelDispatch({
          type: panelActions.SET_REQUESTS_CPU,
          payload: panelState.requests.cpu + value.slice(0, 1)
        })
      }

      if (panelState.limits.cpu > 0) {
        panelDispatch({
          type: panelActions.SET_LIMITS_CPU,
          payload: panelState.limits.cpu + value.slice(0, 1)
        })
      }
    } else {
      if (panelState.requests.cpu.match(/m/)) {
        panelDispatch({
          type: panelActions.SET_REQUESTS_CPU,
          payload: Number.parseInt(panelState.requests.cpu)
        })
      }

      if (panelState.limits.cpu.match(/m/)) {
        panelDispatch({
          type: panelActions.SET_LIMITS_CPU,
          payload: Number.parseInt(panelState.limits.cpu)
        })
      }
    }

    panelDispatch({
      type: panelActions.SET_CPU_UNIT,
      payload: value
    })
  }

  const setCpuValue = (value, data, type, validationField) => {
    panelDispatch({
      type: panelActions[`SET_${type}_CPU`],
      payload: `${value}${panelState.cpuUnit === 'millicpu' ? 'm' : ''}`
    })
    setRangeInputValidation(
      data,
      setValidation,
      value,
      type,
      validationField,
      'Cpu'
    )
  }

  const setMemoryValue = (value, data, type, validationField) => {
    panelDispatch({
      type: panelActions[`SET_${type}_MEMORY`],
      payload: `${value}${
        panelState.memoryUnit.length === 0 || panelState.memoryUnit === 'Bytes'
          ? ''
          : panelState.memoryUnit.match(/i/)
          ? panelState.memoryUnit.slice(0, 2)
          : panelState.memoryUnit.slice(0, 1)
      }`
    })
    setRangeInputValidation(
      data,
      setValidation,
      value,
      type,
      validationField,
      'Memory'
    )
  }

  const setGpuValue = value => {
    let isValid = true

    if (value && Number(value) <= 0) {
      isValid = false
    }

    panelDispatch({
      type: panelActions.SET_LIMITS_NVIDIA_GPU,
      payload: `${value}`
    })
    setValidation(prevState => ({ ...prevState, isGpuLimitValid: isValid }))
  }

  const setPriorityClassName = value => {
    panelDispatch({
      type: panelActions.SET_PRIORITY_CLASS_NAME,
      payload: value
    })
    setNewJobPriorityClassName(value)
  }

  return (
    <JobsPanelResourcesView
      handleSelectCpuUnit={handleSelectCpuUnit}
      handleSelectMemoryUnit={handleSelectMemoryUnit}
      panelDispatch={panelDispatch}
      panelState={panelState}
      resourcesData={generateResourcesData()}
      setCpuValue={setCpuValue}
      setGpuValue={setGpuValue}
      setMemoryValue={setMemoryValue}
      setPriorityClassName={setPriorityClassName}
      validation={validation}
      validFunctionPriorityClassNames={validFunctionPriorityClassNames}
    />
  )
}

JobsPanelResources.propTypes = {
  panelDispatch: PropTypes.func.isRequired,
  panelState: PropTypes.shape({}).isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.shape({}).isRequired
}

export default connect(
  ({ appStore }) => ({
    frontendSpec: appStore.frontendSpec
  }),
  { setNewJobPriorityClassName: jobsActions.setNewJobPriorityClassName }
)(JobsPanelResources)
