import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import ChipCell from '../ChipCell/ChipCell'
import Download from '../../common/Download/Download'
import Tooltip from '../../common/Tooltip/Tooltip'
import artifactViewIcon from '../../images/eye.png'

import { truncateUid, formatDatetime } from '../../utils'
import artifactAction from '../../actions/artifacts'

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
  match
}) => {
  const dispatch = useDispatch()
  if (link) {
    return (
      <div className={`table_body__row__cell cell__${data.size}`}>
        <Link to={link} onClick={() => selectItem(item)}>
          <div className="name_status_row">
            {data.value} {selectedItem.uid && <span className={item.state} />}
          </div>
          {selectedItem.uid && (
            <div className="date__uid_row">
              <span>{formatDatetime(new Date(item.startTime))}</span>
              <span>{truncateUid(item.uid)}</span>
            </div>
          )}
        </Link>
      </div>
    )
  } else if (data.type === 'state') {
    return (
      <div className={`table_body__row__cell cell__${data.size}`}>
        <Tooltip
          template={
            <TextTooltipTemplate
              text={`${data.value[0].toUpperCase()}${data.value.slice(1)}`}
            />
          }
        >
          <i className={data.value} />
        </Tooltip>
      </div>
    )
  } else if (Array.isArray(data.value)) {
    return (
      <div className={`table_body__row__cell cell__${data.size}`}>
        <ChipCell
          className={`table_body__${data.type}`}
          elements={data.value}
          tooltip
          handleShowElements={handleShowElements}
        />
      </div>
    )
  } else if (data.type === 'producer') {
    return (
      <div className={`table_body__row__cell cell__${data.size}`}>
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
      <div className={`table_body__row__cell cell__${data.size}`}>
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
      <div className={`table_body__row__cell cell__${data.size}`}>
        <Download
          path={item && item.target_path.path}
          schema={item && item.target_path.schema}
        />
      </div>
    )
  } else if (data.type === 'path') {
    return (
      <div className={`table_body__row__cell cell__${data.size}`}>
        <Tooltip
          className="table_body__row__cell_path"
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
      <div className={`table_body__row__cell cell__${data.size}`}>
        <Tooltip template={<TextTooltipTemplate text={data.value} />}>
          <span>{truncateUid(data.value)}</span>
        </Tooltip>
      </div>
    )
  } else {
    return (
      <div className={`table_body__row__cell cell__${data.size}`}>
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
  item: PropTypes.shape({}).isRequired,
  link: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  selectItem: PropTypes.func.isRequired,
  selectedItem: PropTypes.shape({}).isRequired
}

export default TableCell
