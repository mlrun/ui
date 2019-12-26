import React from 'react'

import MaterialTable from 'material-table'

import Tooltip from '@material-ui/core/Tooltip'

import ChipList from '../common/ChipList'
import State from '../common/State'
import Link from '../common/Link'

import { formatDatetime, truncateUid } from '../../utils'

const JobsTable = props => (
  <MaterialTable
    columns={[
      {
        title: 'Name',
        field: 'name',
        render: rowData => (
          <Link to={`/jobs/${rowData.uid}`}>{rowData.name}</Link>
        )
      },
      {
        title: 'UID',
        field: 'uid',
        render: rowData => (
          <Tooltip title={rowData.uid}>
            <span>{truncateUid(rowData.uid)}</span>
          </Tooltip>
        )
      },
      {
        title: 'Started',
        field: 'startTime',
        type: 'datetime',
        render: rowData => formatDatetime(rowData.startTime),
        defaultSort: 'desc'
      },
      {
        title: 'State',
        field: 'state',
        render: rowData => <State state={rowData.state} />
      },
      {
        title: 'Parameters',
        field: 'parameters',
        render: rowData => (
          <ChipList list={rowData.parameters} type="parameters" />
        ),
        cellStyle: {
          overflow: 'auto',
          maxWidth: '250px'
        }
      },
      {
        title: 'Results',
        field: 'results',
        render: rowData => (
          <ChipList list={rowData.resultsChips} type="results" />
        ),
        cellStyle: {
          maxWidth: '250px'
        }
      }
    ]}
    data={props.jobs}
    isLoading={props.loading}
    options={{
      headerStyle: {
        fontSize: '0.75rem'
      },
      pageSize: 10,
      rowStyle: {
        height: '24px'
      },
      sorting: true,
      toolbar: false
    }}
    style={{
      boxShadow: 'none'
    }}
    title=""
  />
)

export default JobsTable
