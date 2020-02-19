import React from 'react'

import TableCell from '../TableCell/TableCell'
import ActionsMenu from '../../common/ActionsMenu/ActionsMenu'

const JobsTableRow = ({
  rowItem,
  handleHoverOnRowActions,
  handleMouseLeaveFromRowActions,
  selectedItem,
  content,
  index,
  match,
  handleSelectItem,
  convertToYaml,
  handleShowElements
}) => {
  return (
    <div
      className="table_body__row parent_row"
      onMouseEnter={handleHoverOnRowActions}
      onMouseLeave={handleMouseLeaveFromRowActions}
    >
      {Object.values(rowItem).map((value, i) => {
        return (
          <TableCell
            selectedItem={selectedItem}
            data={value}
            item={content[index]}
            link={
              i === 0 &&
              `/projects/${match.params.projectName}/jobs/${
                content[index].uid
              }${match.params.tab ? `/${match.params.tab}` : '/info'}`
            }
            selectItem={handleSelectItem}
            key={value.value}
            handleShowElements={handleShowElements}
          />
        )
      })}
      <div className="table_body__row__cell row__actions">
        <ActionsMenu convertToYaml={convertToYaml} item={content[index]} />
      </div>
    </div>
  )
}

export default JobsTableRow
