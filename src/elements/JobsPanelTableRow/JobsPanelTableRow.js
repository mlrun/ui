import React from 'react'
import PropTypes from 'prop-types'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import TableActionsMenu from '../../common/TableActionsMenu/TableActionsMenu'

import './jobsPanelTableRow.scss'

const JobsPanelTableRow = ({ actionsMenu, item, row }) => {
  return (
    <div className="table__row">
      {row.map((cell, i) => {
        return (
          <div className="table__cell" key={i + cell}>
            <Tooltip
              className="table__cell-value"
              template={<TextTooltipTemplate text={cell} />}
            >
              {cell}
            </Tooltip>
          </div>
        )
      })}
      <div className="table__cell actions_cell">
        <TableActionsMenu menu={actionsMenu} item={item} />
      </div>
    </div>
  )
}

JobsPanelTableRow.propTypes = {
  actionsMenu: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  item: PropTypes.shape({}).isRequired,
  row: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default JobsPanelTableRow
