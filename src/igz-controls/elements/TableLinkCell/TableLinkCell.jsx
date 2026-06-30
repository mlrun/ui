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
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Tooltip from '../../components/Tooltip/Tooltip'
import TextTooltipTemplate from '../../components/TooltipTemplate/TextTooltipTemplate'

import { formatDatetime } from '../../utils/datetime.util'
import { truncateUid } from '../../utils/string.util'

import Arrow from '../../images/arrow.svg?react'

import './tableLinkCell.scss'

const TableLinkCell = ({
  cellData = {},
  className = '',
  item,
  link,
  selectItem,
  selectedItem = {},
  showExpandButton = false,
  toggleRow = null
}) => {
  const tableCellClassNames = classnames(
    'table-body__cell',
    cellData.className,
    className,
    cellData.bodyCellClassName
  )
  const itemNameClassNames = classnames('item-name')
  const { value: stateValue, label: stateLabel, className: stateClassName } = item.state ?? {}

  return (
    <td data-testid={cellData.headerId} className={tableCellClassNames}>
      {cellData.linkIsExternal ? (
        <div className="data-ellipsis">
          <a href={link} className="link" target="_top">
            <Tooltip
              className={itemNameClassNames}
              template={<TextTooltipTemplate text={cellData.tooltip || cellData.value || ''} />}
            >
              {cellData.value}
            </Tooltip>

            {cellData.showStatus && stateValue && stateLabel && (
              <Tooltip className="status" template={<TextTooltipTemplate text={stateLabel} />}>
                <i className={stateClassName} />
              </Tooltip>
            )}
          </a>

          {cellData.showTag && (
            <Tooltip className="item-tag" template={<TextTooltipTemplate text={item.tag} />}>
              <span className="link-subtext">{item.tag}</span>
            </Tooltip>
          )}
        </div>
      ) : (
        <Link to={link} onClick={() => selectItem(item)} className="data-ellipsis">
          <div className="name-wrapper">
            <div className="link">
              <Tooltip
                className={itemNameClassNames}
                template={<TextTooltipTemplate text={cellData.tooltip || cellData.value || ''} />}
              >
                {cellData.value}
              </Tooltip>

              {cellData.showStatus && stateValue && stateLabel && (
                <Tooltip className="status" template={<TextTooltipTemplate text={stateLabel} />}>
                  <i className={stateClassName} />
                </Tooltip>
              )}
            </div>
            {cellData.showTag && (
              <Tooltip className="item-tag" template={<TextTooltipTemplate text={item.tag} />}>
                <span className="link-subtext">{item.tag}</span>
              </Tooltip>
            )}
          </div>
          {(cellData.showUid ||
            (cellData.showSelectedUid && Object.values(selectedItem).length !== 0)) && (
            <div className="date-uid-row">
              {(item.startTime || item.created || item.updated) &&
                cellData.type !== 'date' &&
                (cellData.showDate || cellData.showUpdatedDate) && (
                  <span className="link-subtext">
                    {cellData.showUpdatedDate
                      ? formatDatetime(item.updated, 'N/A')
                      : formatDatetime(
                          item.startTime || item.created,
                          stateValue === 'aborted' ? 'N/A' : 'Not yet started'
                        )}
                  </span>
                )}
              {cellData.value !== item.uid && cellData.value !== item.hash && (
                <span className="link-subtext">{truncateUid(item.uid || item.hash)}</span>
              )}
            </div>
          )}
          {cellData.additionalInfo && Object.values(selectedItem).length !== 0 && (
            <span className="link-subtext">{cellData.additionalInfo}</span>
          )}
        </Link>
      )}
      {showExpandButton && (
        <Arrow
          onClick={e => {
            toggleRow && toggleRow(e, item)
          }}
          className="expand-arrow"
        />
      )}
    </td>
  )
}

TableLinkCell.propTypes = {
  cellData: PropTypes.object,
  className: PropTypes.string,
  item: PropTypes.object.isRequired,
  link: PropTypes.string.isRequired,
  selectItem: PropTypes.func.isRequired,
  selectedItem: PropTypes.object,
  showExpandButton: PropTypes.bool,
  toggleRow: PropTypes.func
}

export default TableLinkCell
