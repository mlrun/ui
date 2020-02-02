import React from 'react'

import Tooltip from '../../components/ArtifactsTooltip/Tooltip'

import { formatDatetime, truncateUid } from '../../utils'

import './artifactstable.scss'

const ArtifactsTable = ({ artifacts }) => {
  const tableBody = artifacts.map((item, index) => {
    const labels = item.labels.map((label, index) => {
      return (
        <span key={index} className="label">
          {label}
        </span>
      )
    })

    return (
      <tr key={item.hash + index || item.tree + index}>
        <td className="column_name">
          <div className="name_container" />
        </td>
        <td className="column_path">
          <div className="path_container">{item.target_path}</div>
        </td>
        <td className="column_type">
          <div className="type_container">{item.kind}</div>
        </td>
        <td className="column_labels">{labels}</td>
        <td className="column_producer">
          <Tooltip
            kind={item.producer.kind}
            owner={item.producer.owner}
            to={`/jobs/${item.producer.uri}`}
            name={item.producer.name}
          />
        </td>
        <td className="column_hash">
          <div className="hash_container" title={item.hash}>
            {truncateUid(item.hash)}
          </div>
        </td>
        <td className="column_started_at">
          <div className="hash_container">
            {formatDatetime(new Date(item.updated))}
          </div>
        </td>
      </tr>
    )
  })

  return (
    <div className="table_container">
      <table>
        <thead>
          <tr>
            <th className="table_header_name">Name/Tree/Iter</th>
            <th className="table_header_path">Path</th>
            <th className="table_header_type">Type</th>
            <th className="table_header_labels">Labels</th>
            <th className="table_header_producer">Producer</th>
            <th className="table_header_hash">Hash</th>
            <th className="table_header_started_at">Started at</th>
          </tr>
        </thead>
        <tbody>{tableBody}</tbody>
      </table>
    </div>
  )
}

export default ArtifactsTable
