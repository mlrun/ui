import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

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
  return (
    <div
      className={`table-body__cell ${
        data.type === 'date' ? 'jobs_medium' : data.class
      }`}
    >
      <Link to={link} onClick={() => selectItem(item)} className="link">
        {item.state && (
          <Tooltip
            className="status"
            template={
              <TextTooltipTemplate
                text={`${item.state[0].toUpperCase()}${item.state.slice(1)}`}
              />
            }
          >
            <i className={item.state} />
          </Tooltip>
        )}
        <div className="name_status_row">{data.value}</div>
        {link.match(/jobs|functions/) &&
          Object.values(selectedItem).length !== 0 && (
            <div className="date__uid_row">
              <span>
                {data.type !== 'date' &&
                  formatDatetime(new Date(item.startTime || item.updated))}
              </span>
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
