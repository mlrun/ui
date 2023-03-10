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
import React from 'react'

import { ReactComponent as DB } from 'igz-controls/images/db-icon.svg'

export const EXTERNAL_OFFLINE = 'externalOffline'
export const EXTERNAL_OFFLINE_KIND_DEFAULT_FILE_TYPE = 'csv'
export const NOSQL = 'nosql'
export const ONLINE = 'online'
export const PARQUET = 'parquet'

export const checkboxModels = {
  online: {
    id: 'online',
    data: {
      name: 'nosql',
      kind: 'nosql',
      online: true,
      path: ''
    }
  },
  parquet: {
    id: 'parquet',
    data: {
      name: 'parquet',
      kind: 'parquet',
      path: ''
    }
  },
  externalOffline: {
    id: 'externalOffline',
    data: { name: 'externalOffline', kind: 'csv', path: '' }
  }
}

export const externalOfflineKindOptions = [
  { label: 'CSV', id: 'csv', icon: <DB /> },
  { label: 'Parquet', id: 'parquet', icon: <DB /> }
]

export const timePartitioningGranularityOptions = [
  { label: 'Second', id: 'second' },
  { label: 'Minute', id: 'minute' },
  { label: 'Hour', id: 'hour' },
  { label: 'Day', id: 'day' },
  { label: 'Month', id: 'month' },
  { label: 'Year', id: 'year' }
]

export const partitionCheckboxTargetKind = {
  byKey: { id: 'byKey', label: 'By key' },
  byTime: { id: 'byTime', label: 'By time' },
  byColumns: { id: 'byColumns', label: 'By columns' }
}

export const partitionRadioButtonsData = [
  {
    value: 'districtKeys',
    label: 'Distinct keys',
    tip: 'The partition is based on key.'
  },
  {
    value: 'numberOfBuckets',
    label: 'Number of Buckets'
  }
]

export const selectedTargetKindInitialState = ['parquet', 'online']

export const selectedPartitionKindInitialState = {
  parquet: ['byTime'],
  externalOffline: ['byTime']
}

export const isShowAdvancedInitialState = {
  parquet: false,
  externalOffline: false
}

export const partitionRadioButtonsInitialState = {
  parquet: 'districtKeys',
  externalOffline: 'districtKeys'
}

export const onlineKindDataInitialState = {
  name: 'nosql',
  kind: 'nosql',
  online: true,
  path: ''
}

export const offlineKindDataInitialState = {
  name: 'parquet',
  kind: 'parquet',
  path: ''
}

export const externalOfflineKindDataInitialState = {
  name: 'externalOffline',
  kind: EXTERNAL_OFFLINE_KIND_DEFAULT_FILE_TYPE,
  path: ''
}

export const dataInitialState = {
  online: onlineKindDataInitialState,
  parquet: offlineKindDataInitialState,
  externalOffline: externalOfflineKindDataInitialState
}

export const targetsPathEditDataInitialState = {
  online: {
    isEditMode: false,
    isModified: false
  },
  parquet: {
    isEditMode: false,
    isModified: false
  }
}

export const generatePath = (prefixes, project, name, suffix, kind) => {
  if (prefixes) {
    const path = prefixes[kind] || prefixes.default

    return `${path.replace(
      /{project}|{name}|{kind}/gi,
      matchToReplace =>
        ({ '{project}': project, '{name}': name || '{name}', '{kind}': kind }[matchToReplace])
    )}/sets/${name || '{name}'}.${suffix}`
  }

  return ''
}

export const handlePathChange = (
  targetType,
  targetKindName,
  isValid,
  targetsPathEditData,
  data,
  target,
  targets,
  targetEditModeIsClosed,
  setTargetsPathEditData,
  setDisableButtons,
  setNewFeatureSetTarget
) => {
  const currentTargetPathEditData = targetsPathEditData[targetType]

  if (currentTargetPathEditData.isEditMode && isValid) {
    const isTargetPathModified = target.path !== data[targetType].path

    setTargetsPathEditData(state => ({
      ...state,
      [targetType]: {
        isEditMode: false,
        isModified: currentTargetPathEditData.isModified
          ? state[targetType].isModified
          : isTargetPathModified
      }
    }))

    setDisableButtons(state => ({
      ...state,
      [targetEditModeIsClosed]: true
    }))

    if (isTargetPathModified) {
      const updatedTargets = targets.map(targetKind => {
        if (targetKind.name === targetKindName) {
          return { ...targetKind, path: data[targetType].path }
        }
        return targetKind
      })

      setNewFeatureSetTarget(updatedTargets)
    }
  } else {
    setTargetsPathEditData(state => ({
      ...state,
      [targetType]: {
        ...currentTargetPathEditData,
        isEditMode: true
      }
    }))

    setDisableButtons(state => ({
      ...state,
      [targetEditModeIsClosed]: false
    }))
  }
}
