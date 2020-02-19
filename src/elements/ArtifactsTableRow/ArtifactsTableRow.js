import React from 'react'

import TableCell from '../TableCell/TableCell'
import ActionsMenu from '../../common/ActionsMenu/ActionsMenu'

const ArtifactsTableRow = ({
  rowItem,
  index,
  match,
  content,
  convertToYaml,
  selectedItem,
  handleHoverOnRowActions,
  handleMouseLeaveFromRowActions,
  handleSelectItem,
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
              `/projects/${match.params.projectName}/artifacts/${
                rowItem.key.value
              }/${match.params.tab ? match.params.tab : 'info'}`
            }
            selectItem={handleSelectItem}
            key={value.value + i}
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

export default ArtifactsTableRow
