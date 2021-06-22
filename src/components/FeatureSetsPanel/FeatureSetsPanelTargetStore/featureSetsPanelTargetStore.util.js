import React from 'react'

import { ReactComponent as DB } from '../../../images/db-icon.svg'

export const checkboxModels = {
  online: {
    id: 'online',
    data: {
      name: 'nosql',
      kind: 'nosql',
      online: true
    }
  },
  offline: {
    id: 'offline',
    data: {
      name: 'parquet',
      kind: 'parquet'
    }
  },
  other: {
    id: 'other',
    data: { name: 'other', kind: 'csv' }
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
