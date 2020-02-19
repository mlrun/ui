import React from 'react'
import { Link } from 'react-router-dom'

import ChipCell from '../ChipCell/ChipCell'
import Tooltip from '../../components/ArtifactsTooltip/Tooltip'

import { truncateUid } from '../../utils'

const TableCell = ({
  item,
  selectItem,
  selectedItem,
  link,
  data,
  handleShowElements
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
          elements={data.value}
          className={`table_body__${data.type}`}
          handleShowElements={handleShowElements}
        />
      </div>
    )
  } else if (data.type === 'producer') {
    return (
      <div className={`table_body__row__cell cell__${data.size}`}>
        <Tooltip
          kind={data.value.kind}
          owner={data.value.owner ? data.value.owner : ''}
          to={`/jobs/${data.value.uri}/info`}
          name={data.value.name}
        />
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

export default TableCell
