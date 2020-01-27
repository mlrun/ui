import React from 'react'
import './artifactstable.scss'
import { formatDatetime } from '../../utils'
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
        <td className="column-name-or-tree-or-iter">
          <div className="name-container"></div>
        </td>
        <td className="column-path">
          <div className="path-container">{item.target_path}</div>
        </td>
        <td className="column-type">
          <div className="type-container">{item.kind}</div>
        </td>
        <td className="column-labels">{labels}</td>
        <td className="column-producer">
          <div>{item.producer.name}</div>
        </td>
        <td className="column-hash">
          <div className="hash-container">{item.hash}</div>
        </td>
        <td className="column-started-at">
          <div className="hash-container">
            {formatDatetime(new Date(item.updated))}
          </div>
        </td>
      </tr>
    )
  })

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th className="table-header-name">Name/Tree/Iter</th>
            <th className="table-header-path">Path</th>
            <th className="table-header-type">Type</th>
            <th className="table-header-labels">Labels</th>
            <th className="table-header-producer">Producer</th>
            <th className="table-header-hash">Hash</th>
            <th className="table-header-started-at">Started at</th>
          </tr>
        </thead>
        <tbody>{tableBody}</tbody>
      </table>
    </div>
  )
}

export default ArtifactsTable
