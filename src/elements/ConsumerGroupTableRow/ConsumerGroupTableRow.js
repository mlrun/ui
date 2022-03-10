import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import ActionsMenu from '../../common/ActionsMenu/ActionsMenu'
import TableCell from '../TableCell/TableCell'

import { ACTIONS_MENU } from '../../types'
import { getV3ioStreamIdentifier } from '../../utils/getUniqueIdentifier'

const ConsumerGroupTableRow = ({ actionsMenu, content, rowItem }) => {
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
          <div className="table-body__cell action_cell">
            <ActionsMenu dataItem={currentItem} menu={actionsMenu} />
          </div>
        </>
      }
    </div>
  )
}

ConsumerGroupTableRow.propTypes = {
  actionsMenu: ACTIONS_MENU.isRequired,
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  rowItem: PropTypes.shape({}).isRequired
}

export default ConsumerGroupTableRow
