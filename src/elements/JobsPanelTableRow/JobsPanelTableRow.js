import React from 'react'
import PropTypes from 'prop-types'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import TableActionsMenu from '../../common/TableActionsMenu/TableActionsMenu'

import { has, map } from 'lodash'
import classNames from 'classnames'

import { joinDataOfArrayOrObject } from '../../utils'

import './jobsPanelTableRow.scss'

const JobsPanelTableRow = ({ actionsMenu, handleEdit, item, section }) => {
  const currentTableSection =
    section.includes('data-inputs') || section.includes('env')
  console.log(item.data)

  return (
    (item.data.name?.label !== 'context' || !item.data.name) && (
      <div className="table__row">
        {map(item.data, (value, property) => {
          const tableCellClassName = classNames({
            table__cell: true,
            table__cell_disabled:
              ((property === 'name' && has(item.data, 'value')) ||
                property === 'type') &&
              item.isDefault
          })

          return (
            <div
              className={tableCellClassName}
              key={property}
              onClick={
                has(value, 'isEdit')
                  ? () => handleEdit(item, currentTableSection, property)
                  : null
              }
            >
              <Tooltip
                className="data-ellipsis"
                textShow={property === 'name' && item.doc}
                template={
                  <TextTooltipTemplate
                    text={
                      property === 'name'
                        ? item.doc || value.label
                        : joinDataOfArrayOrObject(value.label, ', ')
                    }
                  />
                }
              >
                {joinDataOfArrayOrObject(value.label, ', ')}
              </Tooltip>
            </div>
          )
        })}
        <div className="table__cell table__cell-actions">
          {!item.isDefault && (
            <TableActionsMenu item={item} menu={actionsMenu} />
          )}
        </div>
      </div>
    )
  )
}

JobsPanelTableRow.propTypes = {
  actionsMenu: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  item: PropTypes.shape({}).isRequired
}

export default JobsPanelTableRow
