import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import TableCell from '../TableCell/TableCell'

import { getV3ioStreamIdentifier } from '../../utils/getUniqueIdentifier'

const ConsumerGroupTableRow = ({ content, rowItem }) => {
  const parent = useRef()
  const rowClassNames = classnames('table-body__row', 'parent-row')
  const currentItem = content.find(
    contentItem =>
      getV3ioStreamIdentifier(contentItem) ===
      rowItem.consumerGroup?.identifierUnique
  )

  return (
    <div className={rowClassNames} ref={parent}>
      {
        <>
          {Object.values(rowItem).map(rowItemProp => {
            return (
              !rowItemProp.hidden && (
                <TableCell
                  data={rowItemProp}
                  item={currentItem}
                  key={rowItemProp.id}
                  link={rowItemProp.getLink ? rowItemProp.getLink?.() : ''}
                />
              )
            )
          })}
        </>
      }
    </div>
  )
}

ConsumerGroupTableRow.propTypes = {
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  rowItem: PropTypes.shape({}).isRequired
}

export default ConsumerGroupTableRow
