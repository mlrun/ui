import React from 'react'

import { ReactComponent as DB } from '../../../images/db-icon.svg'

export const PARQUET = 'parquet'
export const EXTERNAL_OFFLINE = 'externalOffline'
export const EXTERNAL_OFFLINE_KIND_DEFAULT_FILE_TYPE = 'csv'

export const checkboxModels = {
  online: {
    id: 'online',
    data: {
      name: 'nosql',
      kind: 'nosql',
      online: true,
      path:
        'v3io:///projects/my-proj/FeatureStore/my-fs/nosql/sets/my-fs-my-tag'
    }
  },
  parquet: {
    id: 'parquet',
    data: {
      name: 'parquet',
      kind: 'parquet',
      path:
        'v3io:///projects/my-proj/FeatureStore/my-fs/parquet/sets/my-fs-my-tag'
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
  path: 'v3io:///projects/my-proj/FeatureStore/my-fs/nosql/sets/my-fs-my-tag'
}

export const offlineKindDataInitialState = {
  name: 'parquet',
  kind: 'parquet',
  path: 'v3io:///projects/my-proj/FeatureStore/my-fs/parquet/sets/my-fs-my-tag'
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
