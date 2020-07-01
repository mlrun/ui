import React from 'react'
import PropTypes from 'prop-types'
import { has, map } from 'lodash'
import classNames from 'classnames'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import TableActionsMenu from '../../common/TableActionsMenu/TableActionsMenu'
import Tip from '../../common/Tip/Tip'

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
    (contentItem.data.name !== 'context' || !contentItem.data.name) && (
      <div className="table__row">
        {map(contentItem.data, (value, property) => {
          const isEditable =
            !contentItem.isDefault ||
            (contentItem.isDefault &&
              property !== 'name' &&
              property !== 'valueType' &&
              section !== 'volumes')
          const tableCellClassName = classNames(
            'table__cell',
            ((property === 'name' && has(contentItem.data, 'value')) ||
              property === 'valueType') &&
              contentItem.isDefault &&
              'table__cell_disabled',
            isEditable && 'cursor-pointer'
          )

          return (
            <div
              className={tableCellClassName}
              key={property}
              onClick={
                isEditable
                  ? () => handleEdit(contentItem, currentTableSection)
                  : null
              }
            >
              <Tooltip
                className={classNames(property === 'name' && 'parameter-name')}
                template={
                  <TextTooltipTemplate
                    text={joinDataOfArrayOrObject(value, ', ')}
                  />
                }
              >
                {joinDataOfArrayOrObject(value, ', ')}
              </Tooltip>
              {property === 'name' && contentItem.doc && (
                <Tip text={contentItem.doc} />
              )}
            </div>
          )
        })}
        <div className="table__cell table__cell-actions">
          {section === 'volumes' ? (
            <TableActionsMenu item={contentItem} menu={actionsMenu} />
          ) : (
            !contentItem.isDefault && (
              <button
                className="table__cell-delete-btn"
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
