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
export const LIMITS_NVIDIA_GPU = 'nvidia.com/gpu'

export const selectUnitOptions = {
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
    { label: 'Bytes', id: 'Bytes', unit: '', root: 0, power: 0 },
    { label: 'KB', id: 'KB', unit: 'K', root: 1000, power: 1 },
    { label: 'KiB', id: 'KiB', unit: 'Ki', root: 1024, power: 1 },
    { label: 'MB', id: 'MB', unit: 'M', root: 1000, power: 2 },
    { label: 'MiB', id: 'MiB', unit: 'Mi', root: 1024, power: 2 },
    { label: 'GB', id: 'GB', unit: 'G', root: 1000, power: 3 },
    { label: 'GiB', id: 'GiB', unit: 'Gi', root: 1024, power: 3 },
    { label: 'TB', id: 'TB', unit: 'T', root: 1000, power: 4 },
    { label: 'TiB', id: 'TiB', unit: 'Ti', root: 1024, power: 4 }
  ]
}

export const getSelectedCpuOption = id => selectUnitOptions.unitCpu.find(option => option.id === id)

export const getSelectedMemoryOption = id =>
  selectUnitOptions.unitMemory.find(option => option.id === id)

export const getMemoryData = (currentMemory, defaultMemory) => {
  let memory = ''
  let memoryUnit = ''
  let memoryUnitId = 'Bytes'
  const currentMemoryValue = parseFloat(currentMemory)
  const defaultMemoryValue = parseFloat(defaultMemory)

  if (isFinite(currentMemoryValue)) {
    memory = String(currentMemoryValue)
    memoryUnit = currentMemory.replace(memory, '')
  } else if (isFinite(defaultMemoryValue)) {
    memory = String(defaultMemoryValue)
    memoryUnit = defaultMemory.replace(memory, '')
  }

  if (memoryUnit) {
    memoryUnitId =
      selectUnitOptions.unitMemory.find(option => option.unit === memoryUnit)?.id ?? memoryUnitId
  }

  return [memory, memoryUnitId]
}

export const getMemoryUnit = unitId => {
  return selectUnitOptions.unitMemory.find(option => option.id === unitId)?.unit ?? ''
}

export const getCpuData = (currentCpu, defaultCpu) => {
  let cpu = ''
  let cpuUnit = ''
  let cpuUnitId = 'cpu'
  const currentCpuValue = parseFloat(currentCpu)
  const defaultCpuValue = parseFloat(defaultCpu)

  if (isFinite(currentCpuValue)) {
    cpu = String(currentCpuValue)
    cpuUnit = currentCpu.replace(cpu, '')
  } else if (isFinite(defaultCpuValue)) {
    cpu = String(defaultCpuValue)
    cpuUnit = defaultCpu.replace(cpu, '')
  }

  if (cpuUnit) {
    cpuUnitId = selectUnitOptions.unitCpu.find(option => option.unit === cpuUnit)?.id ?? cpuUnitId
  }

  return [cpu, cpuUnitId]
}

export const getCpuUnit = unitId => {
  return selectUnitOptions.unitCpu.find(option => option.id === unitId)?.unit ?? ''
}

export const generateMemoryWithUnit = (memoryValue, memoryUnitId) => {
  const memoryUnit =
    selectUnitOptions.unitMemory.find(option => option.id === memoryUnitId)?.unit ?? ''

  return `${memoryValue}${memoryUnit}`
}
export const generateCpuWithUnit = (cpuValue, cpuUnitId) => {
  const cpuUnit = selectUnitOptions.unitCpu.find(option => option.id === cpuUnitId)?.unit ?? ''

  return `${cpuValue}${cpuUnit}`
}

export const getLimitsGpuType = limits => {
  const reservedWords = ['cpu', 'cpuUnitId', 'memory', 'memoryUnitId']

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
