import React from 'react'
import PropTypes from 'prop-types'

import JobsTableRow from '../../elements/JobsTableRow/JobsTableRow'
import ArtifactsTableRow from '../../elements/ArtifactsTableRow/ArtifactsTableRow'
import Details from '../Details/Details'

const TableView = ({
  detailsMenu,
  handleCancel,
  handleShowElements,
  hideChips,
  loading,
  match,
  page,
  tableHeaders,
  tableContent,
  selectedItem,
  convertToYaml,
  ...props
}) => {
  return (
    <div className="table " onClick={hideChips}>
      <div className="table__content">
        <div className="table_head">
          {tableHeaders.map((item, index) => (
            <div
              className={`table_head_item header__${item.size}`}
              key={item.header + index}
            >
              <span>{item.header}</span>
            </div>
          ))}
        </div>
        <div className="table_body">
          {tableContent.map((rowItem, i) => {
            if (match.path.includes('jobs')) {
              return (
                <JobsTableRow
                  key={i}
                  match={match}
                  selectedItem={selectedItem}
                  index={i}
                  rowItem={rowItem}
                  handleShowElements={handleShowElements}
                  convertToYaml={convertToYaml}
                  {...props}
                />
              )
            } else {
              return (
                <ArtifactsTableRow
                  key={i}
                  handleShowElements={handleShowElements}
                  index={i}
                  match={match}
                  rowItem={rowItem}
                  selectedItem={selectedItem}
                  convertToYaml={convertToYaml}
                  {...props}
                />
              )
            }
          })}
        </div>
      </div>
      {Object.keys(selectedItem).length !== 0 && (
        <Details
          convertToYaml={convertToYaml}
          detailsMenu={detailsMenu}
          handleCancel={handleCancel}
          handleShowElements={handleShowElements}
          hideChips={hideChips}
          item={selectedItem}
          match={match}
          page={page}
        />
      )}
    </div>
  )
}

TableView.propTypes = {
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  convertToYaml: PropTypes.func.isRequired,
  detailsMenu: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleSelectItem: PropTypes.func.isRequired,
  handleShowElements: PropTypes.func.isRequired,
  hideChips: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  page: PropTypes.string.isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  tableContent: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  tableHeaders: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default TableView
