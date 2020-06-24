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
  handleDelete,
  handleEdit,
  contentItem,
  section
}) => {
  const currentTableSection =
    section.includes('data-inputs') || section.includes('env')

  return (
    (contentItem.data.name?.label !== 'context' || !contentItem.data.name) && (
      <div className="table__row">
        {map(contentItem.data, (value, property) => {
          const tableCellClassName = classNames(
            'table__cell',
            ((property === 'name' && has(contentItem.data, 'value')) ||
              property === 'valueType') &&
              contentItem.isDefault &&
              'table__cell_disabled',
            has(value, 'isEdit') && 'edit-cell'
          )

          return (
            <div
              className={tableCellClassName}
              key={property}
              onClick={
                has(value, 'isEdit')
                  ? () => handleEdit(contentItem, currentTableSection, property)
                  : null
              }
            >
              <Tooltip
                className="data-ellipsis"
                textShow={property === 'name' && contentItem.doc}
                template={
                  <TextTooltipTemplate
                    text={
                      property === 'name'
                        ? contentItem.doc || value.label
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
            <TableActionsMenu item={contentItem} menu={actionsMenu} />
          ) : (
            !contentItem.isDefault && (
              <button
                onClick={() => {
                  handleDelete(contentItem)
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
  handleDelete: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  contentItem: PropTypes.shape({}).isRequired,
  section: PropTypes.string.isRequired
}

export default JobsPanelTableRow
