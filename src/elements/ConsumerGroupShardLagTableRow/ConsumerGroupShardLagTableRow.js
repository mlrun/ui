import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import TableCell from '../TableCell/TableCell'

import { ACTIONS_MENU } from '../../types'
import { getV3ioStreamShardLagIdentifier } from '../../utils/getUniqueIdentifier'

const ConsumerGroupShardLagTableRow = ({ content, rowItem }) => {
  const parent = useRef()
  const rowClassNames = classnames('table-body__row', 'parent-row')
  const currentItem = content.find(
    contentItem =>
      getV3ioStreamShardLagIdentifier(contentItem) ===
      rowItem.shardLagId?.identifierUnique
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

ConsumerGroupShardLagTableRow.propTypes = {
  actionsMenu: ACTIONS_MENU.isRequired,
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  rowItem: PropTypes.shape({}).isRequired
}

export default ConsumerGroupShardLagTableRow
