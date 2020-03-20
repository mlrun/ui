import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

import { formatDatetime, truncateUid } from '../../utils'

import arrowIcon from '../../images/arrow.png'

const TableLinkCell = ({
  data,
  selectItem,
  link,
  item,
  selectedItem,
  expandLink
}) => {
  return (
    <div
      className={`table-body__cell ${
        data.type === 'date' ? 'jobs_medium' : data.size
      }`}
    >
      <Link to={link} onClick={() => selectItem(item)} className="link">
        <div className="name_status_row">
          {data.value}
          {item.state && (
            <Tooltip
              template={
                <TextTooltipTemplate
                  text={`${item.state[0].toUpperCase()}${item.state.slice(1)}`}
                />
              }
            >
              <i className={item.state} />
            </Tooltip>
          )}
        </div>
        {selectedItem.uid && (
          <div className="date__uid_row">
            <span>
              {data.type !== 'date' &&
                formatDatetime(new Date(item.startTime || item.updated))}
            </span>
            <span>{truncateUid(item.uid)}</span>
          </div>
        )}
      </Link>
      {expandLink && (
        <img src={arrowIcon} alt="Arrow" className="expand-arrow" />
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
