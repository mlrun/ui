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
import classnames from 'classnames'
import { isEmpty } from 'lodash'
import classNames from 'classnames'

import { Button, Tip, Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { SORT_PROPS } from 'igz-controls/types'

const TableHead = React.forwardRef(
  ({ content, mainRowItemsCount, selectedItem, sortProps }, ref) => {
    const getSortableHeaderCellClasses = (tableItemClass, headerId, index) =>
      classNames(
        'table-head__item',
        tableItemClass,
        'table__header-item-sortable',
        sortProps &&
          sortProps.selectedColumnName &&
          sortProps.selectedColumnName === headerId &&
          'table__header-item-sortable-active',
        !isEmpty(selectedItem) && index >= mainRowItemsCount && 'table-body__cell_hidden'
      )

    const getHeaderCellClasses = (tableItem, index) =>
      classnames(
        'table-head__item',
        tableItem.class,
        !isEmpty(selectedItem) && index >= mainRowItemsCount && 'table-body__cell_hidden'
      )

    return (
      <div className="table-head" ref={ref}>
        {content.map(({ headerId, isSortable, ...tableItem }, index) => {
          return tableItem.type !== 'hidden' && !tableItem.hidden ? (
            !isSortable || !sortProps ? (
              <div
                className={getHeaderCellClasses(tableItem, index)}
                key={`${tableItem.header}${index}`}
              >
                <Tooltip template={<TextTooltipTemplate text={tableItem.header} />}>
                  {tableItem.header}
                </Tooltip>
                {tableItem.tip && <Tip text={tableItem.tip} />}
              </div>
            ) : (
              <Button
                className={getSortableHeaderCellClasses(tableItem.class, headerId, index)}
                icon={sortProps.getSortingIcon(headerId)}
                key={`${tableItem.header}${index}`}
                label={tableItem.header}
                onClick={() => sortProps.sortTable(headerId)}
                tooltip={tableItem.header}
              />
            )
          ) : null
        })}
        <div className="table-body__cell action_cell" />
      </div>
    )
  }
)

TableHead.defaultProps = {
  sortProps: null
}

TableHead.propTypes = {
  content: PropTypes.array.isRequired,
  mainRowItemsCount: PropTypes.number.isRequired,
  selectedItem: PropTypes.object.isRequired,
  sortProps: SORT_PROPS
}

export default TableHead
