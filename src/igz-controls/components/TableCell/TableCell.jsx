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
import React, { cloneElement } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Tooltip from '../Tooltip/Tooltip'
import ReadOnlyChips from '../ReadOnlyChips/ReadOnlyChips'
import TableLinkCell from '../../elements/TableLinkCell/TableLinkCell'
import TableTypeCell from '../../elements/TableTypeCell/TableTypeCell'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

import { getChipOptions } from '../../utils/chips.util'
import { truncateUid } from '../../utils/string.util'

import Arrow from '../../images/arrow.svg?react'

const TableCell = ({
  cellData,
  className = '',
  firstCell = false,
  item,
  link = '',
  onClick = null,
  selectItem = () => {},
  selectedItem = {},
  showExpandButton = false,
  toggleRow = null
}) => {
  const { value: stateValue, label: stateLabel, className: stateClassName } = item.state ?? {}
  const cellClassNames = classnames(
    'table-body__cell',
    cellData.className,
    className,
    cellData.bodyCellClassName,
    onClick && 'link'
  )

  if (cellData.template) {
    return cloneElement(cellData.template, {
      className
    })
  } else if (link && cellData.type !== 'hidden') {
    return (
      <TableLinkCell
        className={className}
        cellData={cellData}
        item={item}
        link={link}
        selectItem={selectItem}
        selectedItem={selectedItem}
        showExpandButton={showExpandButton}
        toggleRow={toggleRow}
      />
    )
  } else if (firstCell && !link) {
    return (
      <td
        onClick={() => cellData.value && onClick && onClick(cellData.value)}
        className={cellClassNames}
      >
        <div className="data-ellipsis">
          {cellData && (
            <Tooltip
              template={<TextTooltipTemplate text={cellData.tooltip || cellData.value || ''} />}
            >
              {cellData.value}
            </Tooltip>
          )}
        </div>
        {item.state && stateValue && stateLabel && (
          <Tooltip className="status" template={<TextTooltipTemplate text={stateLabel} />}>
            <i className={stateClassName} />
          </Tooltip>
        )}
        {!item.state && item.status && (
          <Tooltip className="status" template={<TextTooltipTemplate text={item.status} />}>
            <i className={`${item.status[0].toLowerCase()}${item.status.slice(1)}`} />
          </Tooltip>
        )}
        {showExpandButton && (
          <Arrow onClick={e => toggleRow && toggleRow(e, item)} className="expand-arrow" />
        )}
      </td>
    )
  } else if (cellData.type === 'type') {
    return <TableTypeCell className={className} cellData={cellData} />
  } else if (cellData.type === 'icons') {
    return (
      <td data-testid={cellData.headerId} className={cellClassNames}>
        {cellData.value.map((valueItem, index) => (
          <Tooltip
            key={valueItem.tooltip + index}
            template={<TextTooltipTemplate text={valueItem.tooltip} />}
          >
            {valueItem.icon}
          </Tooltip>
        ))}
      </td>
    )
  } else if (Array.isArray(cellData.value)) {
    return (
      <td data-testid={cellData.headerId} className={cellClassNames}>
        <ReadOnlyChips
          chipOptions={getChipOptions(cellData.type)}
          labels={cellData.value}
          shortChips
        />
      </td>
    )
  } else if (cellData.type === 'hash') {
    return (
      <td data-testid={cellData.headerId} className={cellClassNames}>
        <Tooltip template={<TextTooltipTemplate text={cellData.value} />}>
          <span>{truncateUid(cellData.value)}</span>
        </Tooltip>
      </td>
    )
  } else if (cellData.type === 'hidden') {
    return null
  } else if (cellData.type === 'component') {
    return (
      <td data-testid={cellData.headerId} className={cellClassNames}>
        {cellData.value}
      </td>
    )
  } else {
    return (
      <td
        data-testid={cellData?.headerId}
        className={cellClassNames}
        onClick={() => cellData.value && onClick && onClick(cellData.value)}
      >
        <Tooltip
          className="text_small"
          template={<TextTooltipTemplate text={cellData.tooltip || cellData.value || ''} />}
        >
          {cellData.value}
        </Tooltip>
      </td>
    )
  }
}

TableCell.propTypes = {
  cellData: PropTypes.object.isRequired,
  className: PropTypes.string,
  firstCell: PropTypes.bool,
  item: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  link: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  onClick: PropTypes.func,
  selectItem: PropTypes.func,
  selectedItem: PropTypes.object,
  showExpandButton: PropTypes.bool,
  toggleRow: PropTypes.func
}

export default TableCell
