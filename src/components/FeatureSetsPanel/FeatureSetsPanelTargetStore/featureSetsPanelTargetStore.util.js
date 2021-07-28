import React from 'react'

import { ReactComponent as DB } from '../../../images/db-icon.svg'

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
  offline: {
    id: 'offline',
    data: {
      name: 'parquet',
      kind: 'parquet',
      path:
        'v3io:///projects/my-proj/FeatureStore/my-fs/parquet/sets/my-fs-my-tag'
    }
  },
  externalOffline: {
    id: 'externalOffline',
    data: { name: 'externalOffline', kind: 'csv' }
  }
}

export const otherKindOptions = [
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

export const OTHER_KIND_DEFAULT_FILE_TYPE = 'csv'

export const externalOfflineKindDataInitialState = {
  kind: OTHER_KIND_DEFAULT_FILE_TYPE,
  path: '',
  partitioned: '',
  key_bucketing_number: '',
  partition_cols: '',
  time_partitioning_granularity: 'hour'
}

export const offlineKindDataInitialState = {
  path: 'v3io:///projects/my-proj/FeatureStore/my-fs/parquet/sets/my-fs-my-tag',
  partitioned: '',
  key_bucketing_number: '',
  partition_cols: '',
  time_partitioning_granularity: 'hour'
}

export const onlineKindDataInitialState =
  'v3io:///projects/my-proj/FeatureStore/my-fs/nosql/sets/my-fs-my-tag'
