import React from 'react'
import PropTypes from 'prop-types'

import './jobsPanelTable.scss'

const JobsPanelTable = ({ headers, content, addNewItem, children }) => {
  return (
    <div className={`job-panel__table ${addNewItem && 'no-border'}`}>
      <div className="table__header table__row">
        {headers.map((header, i) => (
          <div className="table__cell" key={i}>
            {header}
          </div>
        ))}
      </div>
      {Object.entries(content).map((row, i) => {
        return (
          <div className="table__row" key={i}>
            {row.map(cell => (
              <div className="table__cell" key={i + cell}>
                {cell}
              </div>
            ))}
          </div>
        )
      })}
      {children}
    </div>
  )
}

JobsPanelTable.propTypes = {
  addNewItem: PropTypes.bool.isRequired,
  content: PropTypes.shape({}).isRequired,
  headers: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default JobsPanelTable
