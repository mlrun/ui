import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import ChipCell from '../ChipCell/ChipCell'
import Download from '../../common/Download/Download'
import Tooltip from '../../components/ArtifactsTooltip/Tooltip'

import artifactViewIcon from '../../images/eye.png'
import arrowIcon from '../../images/arrow.png'

import { truncateUid } from '../../utils'

import jobsData from '../../components/JobsPage/jobsData'

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
          {data && data.value}
          <span>{selectedItem.uid && truncateUid(item.uid.value)}</span>
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
          handleShowElements={handleShowElements}
          maxLength={2}
        />
      </div>
    )
  } else if (data.type === 'producer') {
    return (
      <div className={`table-body__cell ${data.size}`}>
        <Tooltip
          kind={data.value.kind}
          name={data.value.name}
          owner={data.value.owner ? data.value.owner : ''}
          to={`/projects/${match.params.projectName}/jobs/${
            data.value.uri.split('/')[1]
          }/${jobsData.detailsMenu[0]}`}
        />
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
          path={item.target_path.path}
          schema={item.target_path.schema}
        />
      </div>
    )
  } else if (data.type === 'path') {
    return (
      <div className={`table-body__cell ${data.size}`}>
        <span className="table-body__cell_path" title={data.value.path}>
          {`${data.value.schema ? `${data.value.schema}://` : ''}${
            data.value.path
          }`}
        </span>
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

TableCell.defaultProp = {
  item: {}
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
