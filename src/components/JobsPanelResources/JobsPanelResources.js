import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import JobsPanelResourcesView from './JobsPanelResourcesView'

import { panelActions } from '../JobsPanel/panelReducer'
import {
  generateFullCpuValue,
  generateFullMemoryValue,
  getLimitsGpuType,
  getSelectedCpuOption,
  LIMITS,
  setCpuValidation,
  setMemoryDropdownValidation,
  setMemoryInputValidation
} from '../../utils/panelResources.util'
import { generateFunctionPriorityLabel } from '../../utils/generateFunctionPriorityLabel'
import jobsActions from '../../actions/jobs'

const JobsPanelResources = ({
  frontendSpec,
  panelDispatch,
  panelState,
  setNewJobPreemtionMode,
  setNewJobPriorityClassName,
  setValidation,
  validation
}) => {
  const validFunctionPriorityClassNames = useMemo(() => {
    return (frontendSpec.valid_function_priority_class_names ?? []).map(
      className => ({
        id: className,
        label: generateFunctionPriorityLabel(className)
      })
    )
  }, [frontendSpec.valid_function_priority_class_names])
  const gpuType = useMemo(
      () => getLimitsGpuType(panelState.limits),
      [panelState.limits]
  )

  const handleSelectMemoryUnit = (value, type) => {
    const unit = value.match(/i/)
      ? value.slice(0, value.match(/i/).index + 1)
      : value.slice(0, 1)
    const memory =
      panelState[type].memory.length > 0
      ? `${Number.parseInt(panelState[type].memory)}${
        value !== 'Bytes' ? unit : ''
      }`
      : panelState[type].memory

    if (panelState[type].memory.length > 0) {
      if (type === LIMITS) {
        panelDispatch({
          type: panelActions.SET_LIMITS_MEMORY_UNIT,
          payload: value
        })

        panelDispatch({
          type: panelActions.SET_LIMITS_MEMORY,
          payload: memory
        })

        panelDispatch({
          type: panelActions.SET_PREVIOUS_PANEL_DATA_LIMITS,
          payload: {
            memory,
            memoryUnit: value
          }
        })
      } else {
        panelDispatch({
          type: panelActions.SET_REQUESTS_MEMORY_UNIT,
          payload: value
        })
        panelDispatch({
          type: panelActions.SET_REQUESTS_MEMORY,
          payload: memory
        })

        panelDispatch({
          type: panelActions.SET_PREVIOUS_PANEL_DATA_REQUESTS,
          payload: {
            memory,
            memoryUnit: value
          }
        })
      }
    }

    setMemoryDropdownValidation(panelState, setValidation, type, value)
  }

  const handleSelectCpuUnit = (value, type) => {
    const selectedOption = getSelectedCpuOption(value)

    if (type === LIMITS) {
      panelDispatch({
        type: panelActions.SET_LIMITS_CPU_UNIT,
        payload: value
      })

      panelDispatch({
        type: panelActions.SET_LIMITS_CPU,
        payload: selectedOption.onChange(panelState[type].cpu)
      })

      panelDispatch({
        type: panelActions.SET_PREVIOUS_PANEL_DATA_LIMITS,
        payload: {
          cpu: selectedOption.onChange(panelState[type].cpu),
          cpuUnit: value
        }
      })
    } else {
      panelDispatch({
        type: panelActions.SET_REQUESTS_CPU_UNIT,
        payload: value
      })

      panelDispatch({
        type: panelActions.SET_REQUESTS_CPU,
        payload: selectedOption.onChange(panelState[type].cpu)
      })

      panelDispatch({
        type: panelActions.SET_PREVIOUS_PANEL_DATA_REQUESTS,
        payload: {
          cpu: selectedOption.onChange(panelState[type].cpu),
          cpuUnit: value
        }
      })
    }
  }

  const handleSelectPreemptionMode = value => {
    panelDispatch({
      type: panelActions.SET_PREEMPTION_MODE,
      payload: value
    })
    panelDispatch({
      type: panelActions.SET_PREVIOUS_PANEL_DATA_PREEMPTION_MODE,
      payload: value
    })
    setNewJobPreemtionMode(value)
  }

  const setCpuValue = (value, type, validationField) => {
    const convertedCpuValue = value.toString()
    const cpu = generateFullCpuValue(convertedCpuValue, type, panelState)

    if (type === LIMITS) {
      panelDispatch({
        type: panelActions.SET_LIMITS_CPU,
        payload: cpu
      })

      panelDispatch({
        type: panelActions.SET_PREVIOUS_PANEL_DATA_LIMITS,
        payload: {
          cpu
        }
      })
    } else {
      panelDispatch({
        type: panelActions.SET_REQUESTS_CPU,
        payload: cpu
      })

      panelDispatch({
        type: panelActions.SET_PREVIOUS_PANEL_DATA_REQUESTS,
        payload: {
          cpu
        }
      })
    }

    setCpuValidation(
      panelState,
      setValidation,
      type,
      validationField,
      convertedCpuValue
    )
  }

  const setMemoryValue = (value, type, validationField) => {
    const convertedMemoryValue = value.toString()
    const memory = generateFullMemoryValue(convertedMemoryValue, type, panelState)

    if (type === LIMITS) {
      panelDispatch({
        type: panelActions.SET_LIMITS_MEMORY,
        payload: memory
      })

      panelDispatch({
        type: panelActions.SET_PREVIOUS_PANEL_DATA_LIMITS,
        payload: {
          memory
        }
      })
    } else {
      panelDispatch({
        type: panelActions.SET_REQUESTS_MEMORY,
        payload: memory
      })

      panelDispatch({
        type: panelActions.SET_PREVIOUS_PANEL_DATA_REQUESTS,
        payload: {
          memory
        }
      })
    }

    setMemoryInputValidation(
      panelState,
      setValidation,
      type,
      validationField,
      convertedMemoryValue
    )
  }

  const setGpuValue = value => {
    let isValid = true

    if (value && Number(value) <= 0) {
      isValid = false
    }

    panelDispatch({
      type: panelActions.SET_LIMITS,
      payload: {
        ...panelState.limits,
        [gpuType]: `${value}`
      }
    })
    panelDispatch({
      type: panelActions.SET_PREVIOUS_PANEL_DATA_LIMITS,
      payload: {
        [gpuType]: `${value}`
      }
    })
    setValidation(prevState => ({ ...prevState, isGpuLimitValid: isValid }))
  }

  const setPriorityClassName = value => {
    panelDispatch({
      type: panelActions.SET_PRIORITY_CLASS_NAME,
      payload: value
    })
    panelDispatch({
      type: panelActions.SET_PREVIOUS_PANEL_DATA_PRIORITY_CLASS_NAME,
      payload: value
    })
    setNewJobPriorityClassName(value)
  }

  return (
    <JobsPanelResourcesView
      data={panelState}
      gpuType={gpuType}
      handleSelectCpuUnit={handleSelectCpuUnit}
      handleSelectMemoryUnit={handleSelectMemoryUnit}
      handleSelectPreemptionMode={handleSelectPreemptionMode}
      panelDispatch={panelDispatch}
      panelState={panelState}
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
  {
    setNewJobPriorityClassName: jobsActions.setNewJobPriorityClassName,
    setNewJobPreemtionMode: jobsActions.setNewJobPreemtionMode
  }
)(JobsPanelResources)
