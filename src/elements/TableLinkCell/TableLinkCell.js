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

import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import { formatDatetime, truncateUid } from '../../utils'

import { ReactComponent as Arrow } from 'igz-controls/images/arrow.svg'

import './tableLinkCell.scss'

const TableLinkCell = ({
  className = '',
  data = {},
  handleExpandRow,
  item,
  link,
  selectItem,
  selectedItem = {},
  showExpandButton = false
}) => {
  const tableCellClassNames = classnames(
    'table-body__cell',
    data.className,
    className,
    data.bodyCellClassName
  )
  const itemNameClassNames = classnames('item-name')
  const { value: stateValue, label: stateLabel, className: stateClassName } = item.state ?? {}

  return (
    <td data-testid={data.headerId} className={tableCellClassNames}>
      {data.linkIsExternal ? (
        <span className="data-ellipsis">
          <a href={link} className="link" target="blank">
            <Tooltip
              className={itemNameClassNames}
              template={<TextTooltipTemplate text={data.tooltip || data.value} />}
            >
              {data.value}
            </Tooltip>

            {data.showStatus && stateValue && stateLabel && (
              <Tooltip className="status" template={<TextTooltipTemplate text={stateLabel} />}>
                <i className={stateClassName} />
              </Tooltip>
            )}
          </a>
        </span>
      ) : (
        <Link to={link} onClick={() => selectItem(item)} className="data-ellipsis">
          <div className="name-wrapper">
            <div className="link">
              <Tooltip
                className={itemNameClassNames}
                template={<TextTooltipTemplate text={data.tooltip || data.value} />}
              >
                {data.value}
              </Tooltip>

              {data.showStatus && stateValue && stateLabel && (
                <Tooltip className="status" template={<TextTooltipTemplate text={stateLabel} />}>
                  <i className={stateClassName} />
                </Tooltip>
              )}
            </div>
            {data.showTag && (
              <Tooltip className="item-tag" template={<TextTooltipTemplate text={item.tag} />}>
                <span className="link-subtext">{item.tag}</span>
              </Tooltip>
            )}
          </div>
          {(data.showUidRow ||
            ((link.match(/functions/) ||
              link.match(/models/) ||
              link.match(/files/) ||
              link.match(/datasets/)) &&
              Object.values(selectedItem).length !== 0)) && (
            <div className="date-uid-row">
              {(item.startTime || item.updated) && (
                <span className="link-subtext">
                  {data.type !== 'date' &&
                    (link.match(/functions/) ||
                    link.match(/models/) ||
                    link.match(/files/) ||
                    link.match(/datasets/)
                      ? formatDatetime(item.updated, 'N/A')
                      : formatDatetime(
                          item.startTime,
                          stateValue === 'aborted' ? 'N/A' : 'Not yet started'
                        ))}
                </span>
              )}
              {data.value !== item.uid && data.value !== item.hash && (
                <span className="link-subtext">{truncateUid(item.uid || item.hash)}</span>
              )}
            </div>
          )}
        </Link>
      )}
      {showExpandButton && (
        <Arrow
          onClick={e => {
            handleExpandRow(e, item)
          }}
          className="expand-arrow"
        />
      )}
    </td>
  )
}

TableLinkCell.propTypes = {
  className: PropTypes.string,
  data: PropTypes.shape({}),
  item: PropTypes.shape({}).isRequired,
  link: PropTypes.string.isRequired,
  selectItem: PropTypes.func.isRequired,
  selectedItem: PropTypes.shape({}),
  showExpandButton: PropTypes.bool
}

export default TableLinkCell
