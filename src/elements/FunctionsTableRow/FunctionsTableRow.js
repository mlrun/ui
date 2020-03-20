import React from 'react'
import PropTypes from 'prop-types'

import TableCell from '../TableCell/TableCell'
import ActionsMenu from '../../common/ActionsMenu/ActionsMenu'

import functionsData from '../../components/FunctionsPage/functionsData'

const FunctionsTableRow = ({
  content,
  toggleConvertToYaml,
  handleSelectItem,
  handleShowElements,
  index,
  match,
  rowItem,
  selectedItem
}) => {
  return (
    <div className="table-body__row parent-row">
      {Object.values(rowItem).map((value, i) => {
        return (
          <TableCell
            selectedItem={selectedItem}
            data={value}
            item={content[index]}
            link={
              i === 0 &&
              `/projects/${match.params.projectName}/functions/${
                rowItem.name.value
              }/${
                match.params.tab
                  ? match.params.tab
                  : `${functionsData.detailsMenu[0].toLowerCase()}`
              }`
            }
            selectItem={handleSelectItem}
            key={value.value + i}
            handleShowElements={handleShowElements}
            match={match}
          />
        )
      })}
      <div className="table-body__cell row__actions">
        <ActionsMenu
          toggleConvertToYaml={toggleConvertToYaml}
          item={content[index]}
        />
      </div>
    </div>
  )
}

FunctionsTableRow.propTypes = {
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  toggleConvertToYaml: PropTypes.func.isRequired,
  handleSelectItem: PropTypes.func.isRequired,
  handleShowElements: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  match: PropTypes.shape({}).isRequired,
  rowItem: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired
}

export default FunctionsTableRow
