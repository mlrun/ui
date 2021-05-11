import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { capitalize } from 'lodash'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

import { formatDatetime, truncateUid } from '../../utils'

import { ReactComponent as Arrow } from '../../images/arrow.svg'

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
    'data-ellipsis',
    link.match(/functions/) && 'function-name'
  )
  const state = item.state || item.endpoint?.status?.state

  return (
    <div className={tableCellClassNames}>
      {state && (
        <Tooltip
          className="status"
          template={<TextTooltipTemplate text={capitalize(state)} />}
        >
          <i className={state} />
        </Tooltip>
      )}
      <Link
        to={link}
        onClick={() => selectItem(item)}
        className="data-ellipsis"
      >
        <div className="name-wrapper data-ellipsis">
          <Tooltip
            className={itemNameCLassNames}
            template={<TextTooltipTemplate text={data.tooltip || data.value} />}
          >
            {data.value}
          </Tooltip>
          {link.match(/functions|feature-sets|feature-vectors/) &&
            data.value !== item.tag && (
              <Tooltip
                className="item-tag"
                template={<TextTooltipTemplate text={item.tag} />}
              >
                <span>{item.tag}</span>
              </Tooltip>
            )}
        </div>
        {(link.match(/jobs/) ||
          (link.match(/functions/) &&
            Object.values(selectedItem).length !== 0)) && (
          <div className="date__uid_row">
            {(item.startTime || item.updated) && (
              <span>
                {data.type !== 'date' &&
                  (link.match(/functions/)
                    ? formatDatetime(item.updated, 'N/A')
                    : formatDatetime(
                        item.startTime,
                        state === 'aborted' ? 'N/A' : 'Not yet started'
                      ))}
              </span>
            )}
            <span>{truncateUid(item.uid || item.hash)}</span>
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
