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
import { isNil, map } from 'lodash'
import {
  V3IO_VOLUME_TYPE,
  CONFIG_MAP_VOLUME_TYPE,
  SECRET_VOLUME_TYPE,
  PVC_VOLUME_TYPE
} from '../../constants'

const volumeTypeInputLabels = {
  [V3IO_VOLUME_TYPE]: '',
  [CONFIG_MAP_VOLUME_TYPE]: 'Config map name',
  [SECRET_VOLUME_TYPE]: 'Secret name',
  [PVC_VOLUME_TYPE]: 'Claim name'
}

const selectVolumeTypeOptions = [
  { label: 'V3IO', id: V3IO_VOLUME_TYPE },
  { label: 'Config Map', id: CONFIG_MAP_VOLUME_TYPE },
  { label: 'Secret', id: SECRET_VOLUME_TYPE },
  { label: 'PVC', id: PVC_VOLUME_TYPE }
]

export const tableHeaders = [
  { label: 'Type', id: 'type' },
  { label: 'Volume name', id: 'name' },
  { label: 'Path', id: 'path' }
]

export const generateVolumeInputsData = (selectedItem, fields, editingItem) => {
  const editingItemIndex = editingItem?.ui?.index
  const selectedType = selectedItem.data.type
  const volumeFields = [
    'type',
    'name',
    'mountPath',
    'container',
    'accessKey',
    'subPath',
    'typeName'
  ]

  return map(volumeFields, fieldName => {
    const fieldBase = {
      fieldName,
      fieldPath: `data.${fieldName}`,
      value: selectedItem.data[fieldName] ?? '',
      inputHidden: isNil(editingItemIndex)
    }

    switch (fieldName) {
      case 'type':
        return {
          ...fieldBase,
          displayValue: selectVolumeTypeOptions.find(
            volumeType => volumeType.id === fieldBase.value
          )?.label,
          inputDisabled: !editingItem?.ui?.isNew,
          options: selectVolumeTypeOptions,
          label: 'Type',
          type: 'select'
        }
      case 'name':
        return {
          ...fieldBase,
          inputDisabled: selectedItem.isDefault,
          label: 'Volume Name',
          required: true,
          type: 'input',
          validationRules: [
            {
              name: 'uniqueness',
              label: 'Name should be unique',
              pattern: newValue => {
                return !fields.value.some(({ data: { name } }, index) => {
                  return newValue.trim() === name && index !== editingItemIndex
                })
              }
            }
          ]
        }
      case 'mountPath':
        return {
          ...fieldBase,
          label: 'Path',
          tip: 'A mount path for referencing the data from the function',
          required: true,
          type: 'input',
          validationRules: [
            {
              name: 'uniqueness',
              label: 'Multiple volumes cannot share the same path',
              pattern: newValue => {
                return !fields.value.some(({ data: { mountPath } }, index) => {
                  return newValue.trim() === mountPath && index !== editingItemIndex
                })
              }
            }
          ]
        }
      case 'container':
        return {
          ...fieldBase,
          inputHidden: selectedType !== V3IO_VOLUME_TYPE,
          label: 'Container',
          tip: 'The name of the data container that contains the data',
          textHidden: true,
          type: 'input'
        }
      case 'accessKey':
        return {
          ...fieldBase,
          inputHidden: selectedType !== V3IO_VOLUME_TYPE,
          label: 'Access Key',
          tip: 'A platform data-access key',
          required: true,
          textHidden: true,
          type: 'input'
        }
      case 'subPath':
        return {
          ...fieldBase,
          inputHidden: selectedType !== V3IO_VOLUME_TYPE,
          label: 'Resource Path',
          tip: 'A relative directory path within the data container',
          textHidden: true,
          type: 'input'
        }
      case 'typeName':
        return {
          ...fieldBase,
          inputHidden: selectedType === V3IO_VOLUME_TYPE,
          label: volumeTypeInputLabels[selectedType],
          required: true,
          textHidden: true,
          type: 'input'
        }
      default:
        return null
    }
  })
}
