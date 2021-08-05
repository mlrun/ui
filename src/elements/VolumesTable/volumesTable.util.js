export const V3IO = 'V3IO'
export const CONFIG_MAP = 'Config Map'
export const SECRET = 'Secret'
export const PVC = 'PVC'

export const volumeTypeInputLabels = {
  [V3IO]: 'Container',
  [CONFIG_MAP]: 'Config map name',
  [SECRET]: 'Secret name',
  [PVC]: 'Claim name'
}

export const volumeTypeInputTips = {
  [V3IO]: 'The name of the data container that contains the data'
}

export const tableHeaders = [
  { label: 'Type', id: 'type' },
  { label: 'Volume name', id: 'name' },
  { label: 'Path', id: 'path' }
]

export const selectTypeOptions = {
  volumeType: [
    { label: 'V3IO', id: V3IO },
    { label: 'Config Map', id: CONFIG_MAP },
    { label: 'Secret', id: SECRET },
    { label: 'PVC', id: PVC }
  ]
}

export const getVolumeTypeInput = type => {
  return {
    label: volumeTypeInputLabels[type],
    tip: volumeTypeInputTips[type]
  }
}
