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
  pageData,
  selectedItem
}) => {
  const rowClassNames = classnames(
    'table-body__row',
    'parent-row',
    ((selectedItem?.db_key &&
      selectedItem?.db_key === content[index]?.db_key) ||
      (selectedItem?.name && selectedItem?.name === content[index]?.name)) &&
      'row_active'
  )

  return (
    <div className={rowClassNames}>
      {Object.values(rowItem).map((value, i) => {
        return (
          <TableCell
            data={value}
            item={content[index]}
            key={Math.random() + i}
            link={
              value.link &&
              (value.link === 'info'
                ? `/projects/${
                    match.params.projectName
                  }/${pageData.page.toLowerCase()}${
                    match.params.pageTab ? `/${match.params.pageTab}` : ''
                  }/${rowItem.key.value}/${
                    match.params.tab
                      ? match.params.tab
                      : `${artifactsData.detailsMenu[0]}`
                  }`
                : value.link)
            }
            match={match}
            selectedItem={selectedItem}
            selectItem={handleSelectItem}
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

export default React.memo(ArtifactsTableRow)
