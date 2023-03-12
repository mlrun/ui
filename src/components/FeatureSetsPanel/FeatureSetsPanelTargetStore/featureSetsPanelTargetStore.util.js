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
  path: '',
  partitioned: ''
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

/**
 * Generates a path based on the given parameters.
 * @param {Object} prefixes - An object containing prefix paths for each kind of path or a default path.
 * @param {string} project - The project name to include in the path.
 * @param {string} kind - The kind of path to generate.
 * @param {string} [name] - Optional. The name to include in the path. If not provided, "{name}" will be used.
 * @param {string} [suffix] - Optional. The suffix to add to the end of the path.
 * @returns {string} The generated path.
 */
export const generatePath = (prefixes, project, kind, name = '{name}', suffix = '') => {
  const path = prefixes[kind] || prefixes.default

  return `${path.replace(
    /{project}|{name}|{kind}/gi,
    matchToReplace =>
      ({ '{project}': project, '{name}': name || '{name}', '{kind}': kind }[matchToReplace])
  )}/sets/${name || '{name}'}${suffix ? '.' + suffix : ''}`
}
