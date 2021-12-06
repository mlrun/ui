import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

import { FEATURE_SETS_TAB, FEATURE_VECTORS_TAB } from '../../constants'
import { formatDatetime, truncateUid } from '../../utils'

import { ReactComponent as Arrow } from '../../images/arrow.svg'

import './tableLinkCell.scss'

const TableLinkCell = ({
  data,
  selectItem,
  link,
  item,
  selectedItem,
  expandLink,
  handleExpandRow
}) => {
  const tableCellClassNames = classnames(
    'table-body__cell',
    data.type === 'date' ? 'jobs_medium' : data.class
  )
  const itemNameCLassNames = classnames(
    'link',
    'item-name',
    link.match(/functions/) && 'function-name'
  )
  const { value: stateValue, label: stateLabel, className: stateClassName } =
    item.state ?? {}

  return (
    <div className={tableCellClassNames}>
      {stateValue && stateLabel && (
        <Tooltip
          className="status"
          template={<TextTooltipTemplate text={stateLabel} />}
        >
          <i className={stateClassName} />
        </Tooltip>
      )}
      <Link
        to={link}
        onClick={() => selectItem(item)}
        className="data-ellipsis"
      >
        <div className="name-wrapper">
          <span className="link">
            <Tooltip
              className={itemNameCLassNames}
              template={
                <TextTooltipTemplate text={data.tooltip || data.value} />
              }
            >
              {data.value}
            </Tooltip>
          </span>
          {link.match(
            new RegExp(`functions|${FEATURE_SETS_TAB}|${FEATURE_VECTORS_TAB}`)
          ) &&
            data.value !== item.tag && (
              <Tooltip
                className="item-tag"
                template={<TextTooltipTemplate text={item.tag} />}
              >
                <span className="link-subtext">{item.tag}</span>
              </Tooltip>
            )}
        </div>
        {(link.match(/jobs/) ||
          (link.match(/functions/) &&
            Object.values(selectedItem).length !== 0)) && (
          <div className="date-uid-row">
            {(item.startTime || item.updated) && (
              <span className="link-subtext">
                {data.type !== 'date' &&
                  (link.match(/functions/)
                    ? formatDatetime(item.updated, 'N/A')
                    : formatDatetime(
                        item.startTime,
                        stateValue === 'aborted' ? 'N/A' : 'Not yet started'
                      ))}
              </span>
            )}
            <span className="link-subtext">
              {truncateUid(item.uid || item.hash)}
            </span>
          </div>
        )}
      </Link>
      {expandLink && (
        <Arrow
          onClick={e => {
            if (expandLink) {
              handleExpandRow(e, item)
            }
          }}
          className="expand-arrow"
        />
      )}
    </div>
  )
}

TableLinkCell.defaultProps = {
  data: {},
  expandLink: false
}

TableLinkCell.propTypes = {
  data: PropTypes.shape({}),
  expandLink: PropTypes.bool,
  item: PropTypes.shape({}).isRequired,
  link: PropTypes.string.isRequired,
  selectItem: PropTypes.func.isRequired,
  selectedItem: PropTypes.shape({}).isRequired
}

export default TableLinkCell
