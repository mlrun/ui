import React from 'react'
import PropTypes from 'prop-types'
import { has, map } from 'lodash'
import classnames from 'classnames'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import TableActionsMenu from '../../common/TableActionsMenu/TableActionsMenu'
import Tip from '../../common/Tip/Tip'
import CheckBox from '../../common/CheckBox/CheckBox'

import { joinDataOfArrayOrObject } from '../../utils'

import { ReactComponent as Delete } from '../../images/delete.svg'

import './jobsPanelTableRow.scss'

const JobsPanelTableRow = ({
  actionsMenu,
  checkboxOnChange,
  className,
  contentItem,
  handleDelete,
  handleEdit,
  section,
  withCheckbox
}) => {
  const isInputsOrEnv =
    section.includes('data-inputs') || section.includes('env')
  const rowClassNames = classnames('table__row', className)

  return (
    (contentItem.data.name !== 'context' || !contentItem.data.name) && (
      <div className={rowClassNames}>
        {withCheckbox && (
          <CheckBox
            className=" table__cell table__cell-checkbox"
            item={{
              id: contentItem.data.name
            }}
            onChange={checkboxOnChange}
            selectedId={contentItem.isChecked ? contentItem.data.name : ''}
          />
        )}
        {map(contentItem.data, (value, property) => {
          const isEditable =
            !contentItem.isDefault ||
            (contentItem.isDefault &&
              property !== 'name' &&
              property !== 'valueType' &&
              section !== 'volumes')
          const tableCellClassName = classnames(
            'table__cell',
            ((property === 'name' && has(contentItem.data, 'value')) ||
              property === 'valueType') &&
              contentItem.isDefault &&
              'table__cell_disabled',
            isEditable && 'cursor-pointer'
          )
          const tooltipClassNames = classnames(
            property === 'name' && 'parameter-name'
          )

          return (
            <div
              className={tableCellClassName}
              key={property}
              onClick={
                isEditable ? () => handleEdit(contentItem, isInputsOrEnv) : null
              }
            >
              <Tooltip
                className={tooltipClassNames}
                template={
                  <TextTooltipTemplate
                    text={joinDataOfArrayOrObject(
                      value,
                      section.includes('data-inputs') ? '' : ', '
                    )}
                  />
                }
              >
                {joinDataOfArrayOrObject(
                  value,
                  section.includes('data-inputs') ? '' : ', '
                )}
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
                className="btn_delete"
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

JobsPanelTableRow.defaultProps = {
  checkboxOnChange: () => {},
  className: '',
  withCheckbox: false
}

JobsPanelTableRow.propTypes = {
  actionsMenu: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  contentItem: PropTypes.shape({}).isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  section: PropTypes.string.isRequired,
  withCheckbox: PropTypes.bool
}

export default JobsPanelTableRow
