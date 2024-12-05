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

export const isPathNotUnique = (path, volumeMounts) => {
  return volumeMounts.some(volumeMount => volumeMount.data.mountPath === path)
}

export const isNameNotUnique = (newName, content) => {
  return content.some(item => newName === item?.data.name && newName !== '')
}
