import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import ChipCell from '../ChipCell/ChipCell'
import Download from '../../common/Download/Download'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import ProducerTooltipTemplate from '../TooltipTemplate/ProducerTooltipTemplate'

import artifactViewIcon from '../../images/eye.png'
import arrowIcon from '../../images/arrow.png'
import nuclioIcon from '../../images/nuclio.png'
import sparkIcon from '../../images/spark.png'
import horovodIcon from '../../images/horovod.png'

import { truncateUid, formatDatetime } from '../../utils'
import artifactAction from '../../actions/artifacts'
import jobsData from '../../components/JobsPage/jobsData'

const TableCell = ({
  data,
  firstRow,
  handleShowElements,
  item,
  link,
  selectItem,
  selectedItem,
  match,
  expandLink
}) => {
  const dispatch = useDispatch()
  if (link) {
    return (
      <div
        className={`table-body__cell ${
          data.type === 'date' ? 'jobs_medium' : data.size
        }`}
      >
        <Link
          to={link}
          onClick={() => {
            selectItem(item)
          }}
          className="link"
        >
          <div className="name_status_row">
            {data && data.value}
            {item.state && (
              <Tooltip
                template={
                  <TextTooltipTemplate
                    text={`${item.state[0].toUpperCase()}${item.state.slice(
                      1
                    )}`}
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
                  formatDatetime(new Date(item.startTime))}
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
  } else if (data.type === 'uid') {
    return (
      <div className={`table-body__cell ${data.size}`}>
        <Tooltip
          textShow={true}
          template={<TextTooltipTemplate text={data.value} />}
        >
          {truncateUid(data.value)}
        </Tooltip>
      </div>
    )
  } else if (firstRow) {
    return (
      <div className={`table-body__cell ${data.size}`}>
        {data && data.value}
        <img src={arrowIcon} alt="Arrow" className="expand-arrow" />
      </div>
    )
  } else if (data.type === 'type') {
    return (
      <div className={`table-body__cell ${data.size}`}>
        <Tooltip
          template={
            <TextTooltipTemplate
              text={data.value === 'mpijob' ? 'Horovod' : data.value}
            />
          }
        >
          {data.value === 'job' || data.value === '' ? (
            'Local'
          ) : data.value === 'dask' ? (
            'Dask'
          ) : (
            <img
              src={
                data.type === 'nuclio'
                  ? nuclioIcon
                  : data.type === 'spark'
                  ? sparkIcon
                  : horovodIcon
              }
              alt="Type"
            />
          )}
        </Tooltip>
      </div>
    )
  } else if (data.type === 'uid') {
    return (
      <div className={`table-body__cell ${data.size}`}>
        <Tooltip
          textShow={true}
          template={<TextTooltipTemplate text={data.value} />}
        >
          {truncateUid(data.value)}
        </Tooltip>
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
            dispatch(
              artifactAction.selectArtifact({
                isPreview: true,
                item
              })
            )
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
  },
  link: ''
}

TableCell.propTypes = {
  data: PropTypes.shape({}).isRequired,
  handleShowElements: PropTypes.func.isRequired,
  item: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.bool]),
  link: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  selectItem: PropTypes.func.isRequired,
  selectedItem: PropTypes.shape({}).isRequired
}

export default TableCell
