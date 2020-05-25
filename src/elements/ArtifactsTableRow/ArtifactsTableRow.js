import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import TableCell from '../TableCell/TableCell'
import TableActionsMenu from '../../common/TableActionsMenu/TableActionsMenu'

import artifactsData from '../../components/Artifacts/artifactsData'

const ArtifactsTableRow = ({
  actionsMenu,
  content,
  handleSelectItem,
  index,
  match,
  rowItem,
  selectedItem
}) => {
  const classNames = classnames(
    'table-body__row',
    'parent-row',
    selectedItem?.db_key &&
      selectedItem?.db_key === content[index]?.db_key &&
      'row_active'
  )

  return (
    <div className={classNames}>
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
              }/${
                match.params.tab
                  ? match.params.tab
                  : `${artifactsData.detailsMenu[0]}`
              }`
            }
            selectItem={handleSelectItem}
            key={Math.random() + i}
            match={match}
          />
        )
      })}
      <div className="table-body__cell action_cell">
        <TableActionsMenu item={content[index]} menu={actionsMenu} />
      </div>
    </div>
  )
}

ArtifactsTableRow.propTypes = {
  actionsMenu: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleSelectItem: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  match: PropTypes.shape({}).isRequired,
  rowItem: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired
}

export default ArtifactsTableRow
