/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import React from 'react'
import PropTypes from 'prop-types'
import { has, map } from 'lodash'
import classnames from 'classnames'

import ActionsMenu from '../../common/ActionsMenu/ActionsMenu'
import CheckBox from '../../common/CheckBox/CheckBox'
import { Tip, Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { joinDataOfArrayOrObject } from '../../utils'
import { ACTIONS_MENU } from '../../types'

import { ReactComponent as Delete } from 'igz-controls/images/delete.svg'

import './jobsPanelTableRow.scss'

const JobsPanelTableRow = ({
  actionsMenu,
  checkboxOnChange = () => {},
  className = '',
  contentItem,
  index,
  isPanelEditMode = false,
  editItem,
  handleDelete,
  handleEdit,
  section,
  withCheckbox = false
}) => {
  const rowClassNames = classnames('table__row', className)

  return (
    (contentItem.data.name !== 'context' || !contentItem.data.name) && (
      <div className={rowClassNames}>
        {withCheckbox && (
          <CheckBox
            className=" table__cell table__cell-checkbox"
            disabled={isPanelEditMode}
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
            ((property === 'name' && has(contentItem.data, 'value')) || property === 'valueType') &&
              contentItem.isDefault &&
              'table__cell_disabled',
            isEditable && 'cursor-pointer'
          )
          const tooltipClassNames = classnames(property === 'name' && 'parameter-name')

          return (
            <div
              className={tableCellClassName}
              key={property}
              onClick={isEditable && !editItem ? () => handleEdit(contentItem, index) : null}
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
                {joinDataOfArrayOrObject(value, section.includes('data-inputs') ? '' : ', ')}
              </Tooltip>
              {property === 'name' && contentItem.doc && <Tip text={contentItem.doc} />}
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

JobsPanelTableRow.propTypes = {
  actionsMenu: ACTIONS_MENU.isRequired,
  contentItem: PropTypes.shape({}).isRequired,
  editItem: PropTypes.bool.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  isPanelEditMode: PropTypes.bool,
  section: PropTypes.string.isRequired,
  withCheckbox: PropTypes.bool
}

export default JobsPanelTableRow
