import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import ChipCell from '../ChipCell/ChipCell'
import Download from '../../common/Download/Download'
import Tooltip from '../../components/ArtifactsTooltip/Tooltip'

import popoutIcon from '../../images/popout.png'

import { truncateUid } from '../../utils'

const TableCell = ({
  data,
  handleShowElements,
  item,
  link,
  selectItem,
  selectedItem,
  match
}) => {
  if (link) {
    return (
      <div className={`table_body__row__cell cell__${data.size}`}>
        <Link to={link} onClick={() => selectItem(item)}>
          {data.value}
          <span>{selectedItem.uid && truncateUid(item.uid)}</span>
        </Link>
      </div>
    )
  } else if (data.type === 'state') {
    return (
      <div className={`table_body__row__cell cell__${data.size}`}>
        <i
          className={data.value}
          title={`${data.value[0].toUpperCase()}${data.value.slice(1)}`}
        />
      </div>
    )
  } else if (Array.isArray(data.value)) {
    return (
      <div className={`table_body__row__cell cell__${data.size}`}>
        <ChipCell
          className={`table_body__${data.type}`}
          elements={data.value}
          handleShowElements={handleShowElements}
          maxLength={2}
        />
      </div>
    )
  } else if (data.type === 'producer') {
    return (
      <div className={`table_body__row__cell cell__${data.size}`}>
        <Tooltip
          kind={data.value.kind}
          name={data.value.name}
          owner={data.value.owner ? data.value.owner : ''}
          to={`/projects/${match.params.projectName}/jobs/${
            data.value.uri.split('/')[1]
          }/info`}
        />
      </div>
    )
  } else if (data.type === 'buttonPopout') {
    return (
      <div className={`table_body__row__cell cell__${data.size}`}>
        <button>
          <img src={popoutIcon} alt="Popout Icon" />
        </button>
      </div>
    )
  } else if (data.type === 'buttonDownload') {
    return (
      <div className={`table_body__row__cell cell__${data.size}`}>
        <Download
          path={item.target_path.path}
          schema={item.target_path.schema}
        />
      </div>
    )
  } else if (data.type === 'path') {
    return (
      <div className={`table_body__row__cell cell__${data.size}`}>
        <span className="table_body__row__cell_path" title={data.value.path}>
          {`${data.value.schema ? `${data.value.schema}://` : ''}${
            data.value.path
          }`}
        </span>
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

TableCell.propTypes = {
  data: PropTypes.shape({}).isRequired,
  handleShowElements: PropTypes.func.isRequired,
  item: PropTypes.shape({}).isRequired,
  link: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  selectItem: PropTypes.func.isRequired,
  selectedItem: PropTypes.shape({}).isRequired
}

export default TableCell
