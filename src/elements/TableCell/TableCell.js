import React from 'react'
import { Link } from 'react-router-dom'
import ChipCell from '../ChipCell/ChipCell'

const TableCell = ({ item, selectItem, selectedItem, link, data }) => {
  if (link) {
    return (
      <div className={`table_body__row__cell cell_${data.size}`}>
        <Link to={link} onClick={() => selectItem(item)}>
          {data.value}
          <span>
            {selectedItem.uid &&
              `...${selectedItem.uid.slice(selectedItem.uid.length - 7)}`}
          </span>
        </Link>
      </div>
    )
  } else if (data.type === 'state') {
    return (
      <div className={`table_body__row__cell cell_${data.size}`}>
        <i
          className={data.value}
          title={`${data.value[0].toUpperCase()}${data.value.slice(1)}`}
        />
      </div>
    )
  } else if (Array.isArray(data.value)) {
    return (
      <div className={`table_body__row__cell cell_${data.size}`}>
        <ChipCell
          elements={data.value}
          className={`table_body__${data.type}`}
        />
      </div>
    )
  } else {
    return (
      <div className={`table_body__row__cell cell_${data.size}`}>
        <span title={data.value}>{data.value}</span>
      </div>
    )
  }
}

export default TableCell
