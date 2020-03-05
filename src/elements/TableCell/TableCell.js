import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import ChipCell from '../ChipCell/ChipCell'
import Download from '../../common/Download/Download'
import Tooltip from '../../common/Tooltip/Tooltip'
import artifactViewIcon from '../../images/eye.png'
import arrowIcon from '../../images/arrow.png'

import { formatDatetime, truncateUid } from '../../utils'

import jobsData from '../../components/JobsPage/jobsData'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import ProducerTooltipTemplate from '../TooltipTemplate/ProducerTooltipTemplate'

const TableCell = ({
  data,
  handleShowElements,
  item,
  link,
  selectItem,
  selectedItem,
  match,
  handlePreview,
  expandLink
}) => {
  if (link) {
    return (
      <div className={`table-body__cell ${data.size}`}>
        <Link to={link} onClick={() => selectItem(item)} className="link">
          <div className="name_status_row">
            {data && data.value}{' '}
            {selectedItem.uid && <span className={item.state} />}
          </div>
          {selectedItem.uid && (
            <div className="date__uid_row">
              <span>
                {expandLink
                  ? item.startTime.value
                  : formatDatetime(new Date(item.startTime))}
              </span>
              <span>
                {expandLink
                  ? truncateUid(item.uid.value)
                  : truncateUid(item.uid)}
              </span>
            </div>
          )}
        </Link>
        {expandLink && (
          <img src={arrowIcon} alt="Arrow" className="expand-arrow" />
        )}
      </div>
    )
  } else if (data.type === 'state') {
    return (
      <div className={`table-body__cell ${data.size}`}>
        <i
          className={data.value}
          title={`${data.value[0].toUpperCase()}${data.value.slice(1)}`}
        />
      </div>
    )
  } else if (Array.isArray(data.value)) {
    return (
      <div className={`table-body__cell ${data.size}`}>
        <ChipCell
          className={`table-body__${data.type}`}
          elements={data.value}
          tooltip
          handleShowElements={handleShowElements}
          maxLength={2}
        />
      </div>
    )
  } else if (data.type === 'producer') {
    return (
      <div className={`table-body__cell ${data.size}`}>
        <Tooltip
          template={
            <ProducerTooltipTemplate
              kind={data.value.kind}
              owner={data.value.owner ? data.value.owner : ''}
            />
          }
        >
          <Link
            to={`/projects/${match.params.projectName}/jobs/${
              data.value.uri.split('/')[1]
            }/${jobsData.detailsMenu[0]}`}
          >
            {data.value.name}
          </Link>
        </Tooltip>
      </div>
    )
  } else if (data.type === 'buttonPopout') {
    return (
      <div className={`table-body__cell ${data.size}`}>
        <button
          onClick={() => {
            handlePreview(item)
          }}
        >
          <img src={artifactViewIcon} alt="Popout Icon" />
        </button>
      </div>
    )
  } else if (data.type === 'buttonDownload') {
    return (
      <div className={`table-body__cell ${data.size}`}>
        <Download
          path={item && item.target_path.path}
          schema={item && item.target_path.schema}
        />
      </div>
    )
  } else if (data.type === 'path') {
    return (
      <div className={`table-body__cell ${data.size}`}>
        <Tooltip
          className="table-body__cell_path"
          template={<TextTooltipTemplate text={data.value.path} />}
        >
          {`${data.value.schema ? `${data.value.schema}://` : ''}${
            data.value.path
          }`}
        </Tooltip>
      </div>
    )
  } else if (data.type === 'hash') {
    return (
      <div className={`table-body__cell ${data.size}`}>
        <Tooltip template={<TextTooltipTemplate text={data.value} />}>
          <span>{truncateUid(data.value)}</span>
        </Tooltip>
      </div>
    )
  } else if (data.type === 'hidden') {
    return null
  } else {
    return (
      <div className={`table-body__cell ${data.size}`}>
        <span>{data.value}</span>
      </div>
    )
  }
}

TableCell.defaultProps = {
  item: {
    target_path: '',
    schema: ''
  }
}

TableCell.propTypes = {
  data: PropTypes.shape({}).isRequired,
  handleShowElements: PropTypes.func.isRequired,
  item: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.bool]),
  link: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  selectItem: PropTypes.func.isRequired,
  selectedItem: PropTypes.shape({}).isRequired
}

export default TableCell
