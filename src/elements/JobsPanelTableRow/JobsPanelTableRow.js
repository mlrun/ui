import React from 'react'
import PropTypes from 'prop-types'
import { has, map } from 'lodash'
import classnames from 'classnames'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import ActionsMenu from '../../common/ActionsMenu/ActionsMenu'
import Tip from '../../common/Tip/Tip'
import CheckBox from '../../common/CheckBox/CheckBox'

import { joinDataOfArrayOrObject } from '../../utils'
import { ACTIONS_MENU } from '../../types'

import { ReactComponent as Delete } from '../../images/delete.svg'

import './jobsPanelTableRow.scss'

const JobsPanelTableRow = ({
  actionsMenu,
  checkboxOnChange,
  className,
  contentItem,
  index,
  editItem,
  handleDelete,
  handleEdit,
  section,
  withCheckbox
}) => {
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
                isEditable && !editItem
                  ? () => handleEdit(contentItem, index)
                  : null
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
            <ActionsMenu menu={actionsMenu} dataItem={contentItem} />
          ) : (
            !contentItem.isDefault && (
              <button
                className="btn_delete"
                onClick={() => {
                  handleDelete(contentItem, index)
                }}
              >
                <Tooltip template={<TextTooltipTemplate text="Delete" />}>
                  <Delete />
                </Tooltip>
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
  actionsMenu: ACTIONS_MENU.isRequired,
  contentItem: PropTypes.shape({}).isRequired,
  editItem: PropTypes.bool.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  section: PropTypes.string.isRequired,
  withCheckbox: PropTypes.bool
}

export default JobsPanelTableRow
