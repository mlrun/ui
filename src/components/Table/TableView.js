import React from 'react'
import PropTypes from 'prop-types'

import JobsTableRow from '../../elements/JobsTableRow/JobsTableRow'
import ArtifactsTableRow from '../../elements/ArtifactsTableRow/ArtifactsTableRow'
import Details from '../Details/Details'

const TableView = ({
  content,
  convertToYaml,
  detailsMenu,
  groupLatestJob,
  handleCancel,
  handleExpandRow,
  handleHoverOnRowActions,
  handleMouseLeaveFromRowActions,
  handlePreview,
  handleSelectItem,
  handleShowElements,
  hideChips,
  loading,
  match,
  page,
  selectedItem,
  tableHeaders,
  tableContent
}) => {
  return (
    <div className="table" onClick={hideChips}>
      <div className="table__content">
        <div className="table-head">
          {tableHeaders.map((item, index) => (
            <div
              className={`table-head__item ${item.size}`}
              key={item.header + index}
            >
              {item.header}
            </div>
          ))}
        </div>
        <div className="table-body">
          {Object.keys(groupLatestJob).length === 0
            ? tableContent.map((rowItem, i) => {
                if (match.path.includes('jobs')) {
                  return (
                    <JobsTableRow
                      key={i}
                      content={content}
                      convertToYaml={convertToYaml}
                      handleHoverOnRowActions={handleHoverOnRowActions}
                      handleMouseLeaveFromRowActions={
                        handleMouseLeaveFromRowActions
                      }
                      handleSelectItem={handleSelectItem}
                      handleShowElements={handleShowElements}
                      index={i}
                      match={match}
                      rowItem={rowItem}
                      selectedItem={selectedItem}
                    />
                  )
                } else {
                  return (
                    <ArtifactsTableRow
                      key={i}
                      content={content}
                      convertToYaml={convertToYaml}
                      handlePreview={handlePreview}
                      handleHoverOnRowActions={handleHoverOnRowActions}
                      handleMouseLeaveFromRowActions={
                        handleMouseLeaveFromRowActions
                      }
                      handleSelectItem={handleSelectItem}
                      handleShowElements={handleShowElements}
                      index={i}
                      match={match}
                      rowItem={rowItem}
                      selectedItem={selectedItem}
                    />
                  )
                }
              })
            : tableContent.map((group, i) => {
                return (
                  <JobsTableRow
                    key={i}
                    content={content}
                    convertToYaml={convertToYaml}
                    handleExpandRow={handleExpandRow}
                    handleHoverOnRowActions={handleHoverOnRowActions}
                    handleMouseLeaveFromRowActions={
                      handleMouseLeaveFromRowActions
                    }
                    handleSelectItem={handleSelectItem}
                    handleShowElements={handleShowElements}
                    index={i}
                    match={match}
                    rowItem={groupLatestJob[i]}
                    selectedItem={selectedItem}
                    tableContent={group}
                  />
                )
              })}
        </div>
      </div>
      {Object.keys(selectedItem).length !== 0 && (
        <Details
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

TableView.defaultProps = {
  groupLatestJob: {}
}

TableView.propTypes = {
  content: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  convertToYaml: PropTypes.func.isRequired,
  detailsMenu: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleHoverOnRowActions: PropTypes.func.isRequired,
  handleMouseLeaveFromRowActions: PropTypes.func.isRequired,
  handlePreview: PropTypes.func.isRequired,
  handleSelectItem: PropTypes.func.isRequired,
  handleShowElements: PropTypes.func.isRequired,
  hideChips: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  page: PropTypes.string.isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  tableContent: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({})),
    PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({})))
  ]).isRequired,
  tableHeaders: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default TableView
