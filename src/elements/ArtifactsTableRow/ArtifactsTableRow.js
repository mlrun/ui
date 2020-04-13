import React from 'react'
import PropTypes from 'prop-types'

import TableCell from '../TableCell/TableCell'
import TableActionsMenu from '../../common/TableActionsMenu/TableActionsMenu'

import artifactsData from '../../components/Artifacts/artifactsData'

import { ReactComponent as Yaml } from '../../images/yaml.svg'

const ArtifactsTableRow = ({
  content,
  toggleConvertToYaml,
  handleSelectItem,
  index,
  match,
  rowItem,
  selectedItem
}) => {
  const actionsMenu = [{ label: 'View YAML', icon: <Yaml /> }]
  return (
    <div
      className={`table-body__row ${
        selectedItem?.db_key !== undefined &&
        selectedItem?.db_key === content[index]?.db_key
          ? 'parent-row active'
          : 'parent-row'
      }`}
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
        <TableActionsMenu
          onClick={toggleConvertToYaml}
          item={content[index]}
          menu={actionsMenu}
        />
      </div>
    </div>
  )
}

ArtifactsTableRow.propTypes = {
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  toggleConvertToYaml: PropTypes.func.isRequired,
  handleSelectItem: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  match: PropTypes.shape({}).isRequired,
  rowItem: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired
}

export default ArtifactsTableRow
