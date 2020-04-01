import React from 'react'
import PropTypes from 'prop-types'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

import './jobsPanelTable.scss'

const JobsPanelTable = ({ headers, content, addNewItem, children }) => {
  return (
    <div className={`job-panel__table ${addNewItem && 'no-border'}`}>
      {headers.length > 0 && (
        <div className="table__header table__row">
          {headers.map((header, i) => (
            <div className="table__cell" key={i}>
              {header}
            </div>
          ))}
        </div>
      )}
      {Array.isArray(content)
        ? content.map((item, i) => (
            <div className="table__row" key={i}>
              {Object.values(item).map((cell, i) => {
                return (
                  <div className="table__cell" key={i + cell}>
                    <Tooltip
                      className="tooltip"
                      template={<TextTooltipTemplate text={cell} />}
                    >
                      {cell}
                    </Tooltip>
                  </div>
                )
              })}
            </div>
          ))
        : Object.entries(content).map((row, i) => {
            return (
              <div className="table__row" key={i}>
                {row.map(cell => (
                  <div className="table__cell" key={i + cell}>
                    <Tooltip
                      className="tooltip"
                      template={<TextTooltipTemplate text={cell} />}
                    >
                      {cell}
                    </Tooltip>
                  </div>
                ))}
              </div>
            )
          })}
      {children}
    </div>
  )
}

JobsPanelTable.defaultProps = {
  headers: []
}

JobsPanelTable.propTypes = {
  addNewItem: PropTypes.bool.isRequired,
  content: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({})),
    PropTypes.shape({})
  ]).isRequired,
  headers: PropTypes.arrayOf(PropTypes.string)
}

export default JobsPanelTable
