import { CONFIG_MAP, PVC, SECRET, V3IO } from '../elements/VolumesTable/volumesTable.util'
import { isEmpty } from 'lodash'

export const REQUESTS = 'requests'
export const LIMITS = 'limits'

export const selectMemoryOptions = {
  unitCpu: [
    {
      id: 'cpu',
      label: 'cpu',
      unit: '',
      step: 0.001,
      minValue: 0.001,
      onChange: function (value) {
        return (parseFloat(value) / 1000).toFixed(3) + this.unit
      },
      convertValue: value => parseInt(value) * 1000
    },
    {
      id: 'millicpu',
      label: 'millicpu',
      unit: 'm',
      step: 100,
      minValue: 1,
      onChange: function (value) {
        return parseFloat(value) * 1000 + this.unit
      },
      convertValue: value => parseInt(value)
    }
  ],
  unitMemory: [
    { label: 'Bytes', id: 'Bytes', root: 0, power: 0 },
    { label: 'KB', id: 'KB', root: 1000, power: 1 },
    { label: 'KiB', id: 'KiB', root: 1024, power: 1 },
    { label: 'MB', id: 'MB', root: 1000, power: 2 },
    { label: 'MiB', id: 'MiB', root: 1024, power: 2 },
    { label: 'GB', id: 'GB', root: 1000, power: 3 },
    { label: 'GiB', id: 'GiB', root: 1024, power: 3 },
    { label: 'TB', id: 'TB', root: 1000, power: 4 },
    { label: 'TiB', id: 'TiB', root: 1024, power: 4 }
  ]
}

export const getSelectedCpuOption = id =>
  selectMemoryOptions.unitCpu.find(option => option.id === id)

export const getSelectedMemoryOption = id =>
  selectMemoryOptions.unitMemory.find(option => option.id === id)

export const generateCpuValue = (cpu = '') =>
  cpu.toString().match(/m/) ? cpu.toString().slice(0, cpu.toString().length - 1) : cpu ? parseFloat(cpu).toFixed(3) : ''

export const generateMemoryValue = (memory = '') =>
  memory.toString().match(/[a-zA-Z]/)
    ? memory.slice(0, memory.toString().match(/[a-zA-Z]/).index)
    : memory

export const getVolumeType = volume => {
  if (volume.configMap) {
    return CONFIG_MAP
  } else if (volume.persistentVolumeClaim) {
    return PVC
  } else if (volume.secret) {
    return SECRET
  } else {
    return V3IO
  }
}

export const volumePreemptionModeOptions = [
  {
    id: 'allow',
    label: 'Allow'
  },
  {
    id: 'constrain',
    label: 'Constrain'
  },
  {
    id: 'prevent',
    label: 'Prevent'
  }
]

export const setMemoryInputValidation = (data, setValidation, type, validationField, value) => {
  const limitsValue = type === LIMITS ? value : data.limits.memory
  const requestsValue = type === REQUESTS ? value : data.requests.memory

  if (value > 0) {
    validateMemory(
      data.limits.memoryUnit,
      data.requests.memoryUnit,
      limitsValue,
      requestsValue,
      setValidation
    )
  } else {
    setValidation(prevState => ({
      ...prevState,
      [validationField]: false
    }))
  }
}

export const setMemoryDropdownValidation = (data, setValidation, type, field) => {
  const selectedLimitsUnit = type === LIMITS ? field : data.limits.memoryUnit
  const selectedRequestsUnit = type === REQUESTS ? field : data.requests.memoryUnit

  validateMemory(
    selectedLimitsUnit,
    selectedRequestsUnit,
    data.limits.memory,
    data.requests.memory,
    setValidation
  )
}

const validateMemory = (
  selectedLimitsUnit,
  selectedRequestsUnit,
  limitsValue,
  requestsValue,
  setValidation
) => {
  const convertToBites = (value, unitData) => {
    return parseInt(value) * Math.pow(unitData.root, unitData.power)
  }

  const limits = Number.parseInt(limitsValue)
  const requests = Number.parseInt(requestsValue)
  const selectedLimitsOption = getSelectedMemoryOption(selectedLimitsUnit)
  const selectedRequestsOption = getSelectedMemoryOption(selectedRequestsUnit)
  const isValid = convertToBites(limits, selectedLimitsOption) >= convertToBites(requests, selectedRequestsOption)

  setValidation(prevState => ({
    ...prevState,
    isMemoryLimitValid: isValid,
    isMemoryRequestValid: isValid
  }))
}

export const setCpuValidation = (data, setValidation, type, validationField, value) => {
  const limitsValue = type === LIMITS ? value : data.limits.cpu
  const requestsValue = type === REQUESTS ? value : data.requests.cpu
  const selectedLimitsOption = getSelectedCpuOption(data.limits.cpuUnit)
  const selectedRequestsOption = getSelectedCpuOption(data.requests.cpuUnit)

  if (value > 0) {
    const isValid =
      selectedRequestsOption.convertValue(requestsValue) <= selectedLimitsOption.convertValue(limitsValue)

    setValidation(prevState => ({
      ...prevState,
      isCpuLimitValid: isValid,
      isCpuRequestValid: isValid
    }))
  } else {
    setValidation(prevState => ({ ...prevState, [validationField]: false }))
  }
}

export const getDefaultMemoryUnit = (currentMemoryValue, defaultMemoryValue) => {
  const memoryValue = isEmpty(currentMemoryValue) ? defaultMemoryValue : currentMemoryValue.memory

  if (memoryValue?.match(/[a-zA-Z]/)) {
    return `${memoryValue.replace(/\d+/g, '')}B`
  } else if (memoryValue?.length > 0) {
    return 'Bytes'
  } else return 'MiB'
}

export const getDefaultCpuUnit = (currentCpuValue, defaultCpuValue) => {
  const cpuValue = isEmpty(currentCpuValue) ? defaultCpuValue : currentCpuValue.cpu

  if (cpuValue?.match?.(/m/)) {
    return 'millicpu'
  }

  return 'cpu'
}

export const generateFullMemoryValue = (value, type, data) => {
  return value.length === 0
    ? ''
    : `${value}${
        data[type].memoryUnit.length === 0 || data[type].memoryUnit === 'Bytes'
          ? ''
          : data[type].memoryUnit.match(/i/)
          ? data[type].memoryUnit.slice(0, 2)
          : data[type].memoryUnit.slice(0, 1)
      }`
}

export const generateFullCpuValue = (value, type, data) => {
  return isEmpty(value)
    ? ''
    : `${value}${
      getSelectedCpuOption(data[type].cpuUnit).unit
    }`
}