import React from 'react'

import { ReactComponent as DB } from '../../../images/db-icon.svg'
import { ReactComponent as TSDB } from '../../../images/tsdb-icon.svg'
import { ReactComponent as NoSQL } from '../../../images/nosql.svg'

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
  { label: 'TSDB', id: 'tsdb', icon: <TSDB /> },
  { label: 'Parquet', id: 'parquet', icon: <DB /> },
  { label: 'NoSql', id: 'nosql', icon: <NoSQL /> },
  // { label: 'Stream', id: 'stream', icon: <Stream /> }, @erann 2021-05-04 removed until further notice
  { label: 'Dataframe', id: 'dataframe', icon: <DB /> },
  { label: 'Custom', id: 'custom', icon: <DB /> }
]
