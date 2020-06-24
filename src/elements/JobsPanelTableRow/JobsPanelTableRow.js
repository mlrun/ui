import React from 'react'
import PropTypes from 'prop-types'
import { has, map } from 'lodash'
import classNames from 'classnames'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import TableActionsMenu from '../../common/TableActionsMenu/TableActionsMenu'

import { joinDataOfArrayOrObject } from '../../utils'

import { ReactComponent as Delete } from '../../images/delete.svg'

import './jobsPanelTableRow.scss'

const JobsPanelTableRow = ({
  actionsMenu,
  handleEdit,
  handleDelete,
  item,
  section
}) => {
  const currentTableSection =
    section.includes('data-inputs') || section.includes('env')

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
          {section === 'volumes' ? (
            <TableActionsMenu item={item} menu={actionsMenu} />
          ) : (
            !item.isDefault && (
              <button
                onClick={() => {
                  handleDelete(item)
                }}
              >
                <Delete />
              </button>
            )
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
