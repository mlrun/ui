import React from 'react'
import PropTypes from 'prop-types'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import TableActionsMenu from '../../common/TableActionsMenu/TableActionsMenu'

import { ReactComponent as Edit } from '../../images/edit.svg'
import { ReactComponent as Delete } from '../../images/delete.svg'

import './jobsPanelTable.scss'

const JobsPanelTable = ({
  addNewItem,
  children,
  className,
  content,
  headers
}) => {
  const actionsMenu = [
    { label: 'Edit', icon: <Edit /> },
    { label: 'Remove', icon: <Delete /> }
  ]

  return (
    <div
      className={`job-panel__table ${addNewItem && 'no-border'} ${className}`}
    >
      {headers.length > 0 && (
        <div className="table__header table__row no-hover">
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
              <div className="table__cell actions_cell">
                <TableActionsMenu onClick={() => {}} menu={actionsMenu} />
              </div>
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
                <div className="table__cell actions_cell">
                  <TableActionsMenu onClick={() => {}} menu={actionsMenu} />
                </div>
              </div>
            )
          })}
      {children}
    </div>
  )
}

JobsPanelTable.defaultProps = {
  className: '',
  headers: []
}

JobsPanelTable.propTypes = {
  addNewItem: PropTypes.bool.isRequired,
  className: PropTypes.string,
  content: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({})),
    PropTypes.shape({})
  ]).isRequired,
  headers: PropTypes.arrayOf(PropTypes.string)
}

export default JobsPanelTable
