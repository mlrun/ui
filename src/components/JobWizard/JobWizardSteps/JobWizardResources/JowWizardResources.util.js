import { CONFIG_MAP, PVC, SECRET, V3IO } from '../../../../elements/VolumesTable/volumesTable.util'
import { isEmpty } from 'lodash'

export const LIMITS_NVIDIA_GPU = 'nvidia.com/gpu'

export const selectMemoryOptions = {
  unitCpu: [
    {
      id: 'cpu',
      label: 'cpu',
      unit: '',
      step: 0.001,
      minValue: 0.001,
      onChange: function (value) {
        return (parseFloat(value) / 1000).toFixed(3)
      },
      convertValue: value => parseFloat(value) * 1000
    },
    {
      id: 'millicpu',
      label: 'millicpu',
      unit: 'm',
      step: 100,
      minValue: 1,
      onChange: function (value) {
        return parseFloat(value) * 1000
      },
      convertValue: value => parseFloat(value)
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

export const getSelectedCpuOption = id =>
  selectMemoryOptions.unitCpu.find(option => option.id === id)

export const getSelectedMemoryOption = id =>
  selectMemoryOptions.unitMemory.find(option => option.id === id)

export const generateCpuValue = (cpu = '') =>
  cpu.toString().match(/m/)
    ? cpu.toString().slice(0, cpu.toString().length - 1)
    : cpu
    ? parseFloat(cpu).toFixed(3)
    : ''

export const generateFullCpuValue = (value, type, data) => {
  return isEmpty(value) ? '' : `${value}${getSelectedCpuOption(data[type].cpuUnit).unit}`
}

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

export const getLimitsGpuType = limits => {
  const reservedWords = ['cpu', 'cpuUnit', 'memory', 'memoryUnit']

  if (!limits || limits[LIMITS_NVIDIA_GPU]) {
    return LIMITS_NVIDIA_GPU
  } else {
    return (
      Object.keys(limits).find(key => key.includes('/gpu')) ||
      Object.keys(limits).find(key => !reservedWords.includes(key)) ||
      LIMITS_NVIDIA_GPU
    )
  }
}
