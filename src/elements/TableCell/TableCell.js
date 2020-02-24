import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import ChipCell from '../ChipCell/ChipCell'
import Tooltip from '../../components/ArtifactsTooltip/Tooltip'

import { truncateUid } from '../../utils'

import popoutIcon from '../../images/popout.png'
import Download from '../../common/Download/Download'

const TableCell = ({
  data,
  handleShowElements,
  item,
  link,
  selectItem,
  selectedItem
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
          to={`/jobs/${data.value.uri}/info`}
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
        <span>schema: {data.value.schema}</span> <br />
        <span>path: {data.value.path}</span>
      </div>
    )
  } else {
    return (
      <div className={`table_body__row__cell cell__${data.size}`}>
        <span title={data.value}>{data.value}</span>
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
