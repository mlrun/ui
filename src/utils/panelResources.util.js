import {
  CONFIG_MAP,
  PVC,
  SECRET,
  V3IO
} from '../elements/VolumesTable/volumesTable.util'

export const selectMemoryOptions = {
  unitCpu: [
    { label: 'cpu', id: 'cpu' },
    { label: 'millicpu', id: 'millicpu' }
  ],
  unitMemory: [
    { label: 'Bytes', id: 'Bytes' },
    { label: 'KB', id: 'KB' },
    { label: 'KiB', id: 'KiB' },
    { label: 'MB', id: 'MB' },
    { label: 'MiB', id: 'MiB' },
    { label: 'GB', id: 'GB' },
    { label: 'GiB', id: 'GiB' },
    { label: 'TB', id: 'TB' },
    { label: 'TiB', id: 'TiB' },
    { label: 'PB', id: 'PB' },
    { label: 'PiB', id: 'PiB' },
    { label: 'EB', id: 'EB' },
    { label: 'EiB', id: 'EiB' }
  ]
}

export const generateCpuValue = (cpu = '') =>
  cpu.toString().match(/m/)
    ? cpu.toString().slice(0, cpu.toString().length - 1)
    : cpu

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
