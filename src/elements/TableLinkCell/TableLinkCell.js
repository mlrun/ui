import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

import { formatDatetime, truncateUid } from '../../utils'

import { ReactComponent as Arrow } from '../../images/arrow.svg'
import CheckBox from '../../common/CheckBox/CheckBox'

const TableLinkCell = ({
  data,
  selectItem,
  link,
  item,
  selectedItem,
  expandLink,
  handleExpandRow,
  selectedRowId,
  setSelectedRowId,
  withCheckbox
}) => {
  const tableCellClassNames = classnames(
    'table-body__cell',
    data.type === 'date' ? 'jobs_medium' : data.class
  )
  const itemNameCLassNames = classnames(
    'item-name',
    'data-ellipsis',
    link.match(/functions/) && 'function-name'
  )

  return (
    <div className={tableCellClassNames}>
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
      <Link
        to={link}
        onClick={() => selectItem(item)}
        className="link data-ellipsis"
      >
        <div className="name-wrapper data-ellipsis">
          <Tooltip
            className={itemNameCLassNames}
            template={<TextTooltipTemplate text={data.value} />}
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
                    : formatDatetime(item.startTime, 'Not yet started'))}
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
      {withCheckbox && (
        <CheckBox
          onChange={setSelectedRowId}
          item={{ id: item.name ?? item.feature.name }}
          selectedId={selectedRowId}
        />
      )}
    </div>
  )
}

TableLinkCell.defaultProps = {
  data: {},
  expandLink: false,
  selectedRowId: '',
  setSelectedRowId: () => {},
  withCheckbox: false
}

TableLinkCell.propTypes = {
  data: PropTypes.shape({}),
  expandLink: PropTypes.bool,
  item: PropTypes.shape({}).isRequired,
  link: PropTypes.string.isRequired,
  selectItem: PropTypes.func.isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  selectedRowId: PropTypes.string,
  setSelectedRowId: PropTypes.func,
  withCheckbox: PropTypes.bool
}

export default TableLinkCell
