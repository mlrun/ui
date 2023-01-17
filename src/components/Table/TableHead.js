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

const TableHead = React.forwardRef(
  ({ content, mainRowItemsCount, selectedItem, sortProps }, ref) => {
    const { selectedColumnName, getSortingIcon, sortTable } = sortProps

    const getHeaderClasses = (tableItemClass, headerId) =>
      classNames(
        'table-head__item',
        tableItemClass,
        'table__header-item-sortable',
        selectedColumnName === headerId && 'table__header-item-sortable-active'
      )

    return (
      <div className="table-head" ref={ref}>
        {content.map(({ headerId, isSortable, ...tableItem }, index) => {
          const cellClassNames = classnames(
            'table-head__item',
            tableItem.class,
            !isEmpty(selectedItem) && index >= mainRowItemsCount && 'table-body__cell_hidden'
          )

          return tableItem.type !== 'hidden' && !tableItem.hidden ? (
            !isSortable ? (
              <div className={cellClassNames} key={`${tableItem.header}${index}`}>
                <Tooltip template={<TextTooltipTemplate text={tableItem.header} />}>
                  {tableItem.header}
                </Tooltip>
                {tableItem.tip && <Tip text={tableItem.tip} />}
              </div>
            ) : (
              <Button
                className={getHeaderClasses(tableItem.class, headerId)}
                icon={getSortingIcon(headerId)}
                key={`${tableItem.header}${index}`}
                label={tableItem.header}
                onClick={() => sortTable(headerId)}
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
  sortProps: {}
}

TableHead.propTypes = {
  content: PropTypes.array.isRequired,
  mainRowItemsCount: PropTypes.number.isRequired,
  selectedItem: PropTypes.object.isRequired,
  sortProps: PropTypes.object
}

export default TableHead
