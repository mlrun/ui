import React from 'react'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import classnames from 'classnames'

import ActionsMenu from '../../common/ActionsMenu/ActionsMenu'
import TableCell from '../TableCell/TableCell'

import { DETAILS_OVERVIEW_TAB } from '../../constants'
import { ACTIONS_MENU } from '../../types'
import { getJobIdentifier } from '../../utils/getUniqueIdentifier'

const JobsTableRow = ({ actionsMenu, handleSelectJob, rowItem, selectedJob }) => {
  const params = useParams()
  const rowClassNames = classnames(
    'table-body__row',
    'parent-row',
    getJobIdentifier(selectedJob, true)  === rowItem.data.ui.identifierUnique && 'row_active'
  )

  return (
    <div className={rowClassNames}>
      {rowItem.content.map((rowItemProp, index) => {
        return (
          !rowItemProp.hidden && (
            <TableCell
              data={rowItemProp}
              item={rowItem.data}
              key={`${rowItem.data.id}.${rowItemProp.header}.${index}`}
              link={
                rowItemProp.type === 'link'
                  ? rowItemProp.getLink?.(params.tab ?? DETAILS_OVERVIEW_TAB)
                  : ''
              }
              selectItem={handleSelectJob}
              selectedItem={selectedJob}
            />
          )
        )
      })}
      <div className="table-body__cell action_cell">
        <ActionsMenu dataItem={rowItem.data} menu={actionsMenu} />
      </div>
    </div>
  )
}

JobsTableRow.propTypes = {
  actionsMenu: ACTIONS_MENU.isRequired,
  handleSelectJob: PropTypes.func.isRequired,
  rowItem: PropTypes.shape({}).isRequired,
  selectedJob: PropTypes.shape({}).isRequired
}
export default JobsTableRow
