import React from 'react'
import PropTypes from 'prop-types'

import JobsTableRow from '../../elements/JobsTableRow/JobsTableRow'
import ArtifactsTableRow from '../../elements/ArtifactsTableRow/ArtifactsTableRow'
import Details from '../Details/Details'
import FunctionsTableRow from '../../elements/FunctionsTableRow/FunctionsTableRow'

const TableView = ({
  content,
  convertToYaml,
  detailsMenu,
  groupLatestJob,
  handleCancel,
  handleExpandRow,
  handleSelectItem,
  handleShowElements,
  hideChips,
  match,
  page,
  selectedItem,
  tableHeaders,
  tableContent,
  groupFilter
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
              <span>{item.header}</span>
            </div>
          ))}
        </div>
        <div className="table-body">
          {groupFilter === 'None' || groupLatestJob.length === 0
            ? tableContent.map((rowItem, i) => {
                switch (page) {
                  case 'artifacts':
                    return (
                      <ArtifactsTableRow
                        key={i}
                        content={content}
                        convertToYaml={convertToYaml}
                        handleSelectItem={handleSelectItem}
                        handleShowElements={handleShowElements}
                        index={i}
                        match={match}
                        rowItem={rowItem}
                        selectedItem={selectedItem}
                      />
                    )
                  case 'functions':
                    return (
                      <FunctionsTableRow
                        key={i}
                        convertToYaml={convertToYaml}
                        content={content}
                        handleShowElements={handleShowElements}
                        match={match}
                        rowItem={rowItem}
                        index={i}
                        selectedItem={selectedItem}
                        handleSelectItem={handleSelectItem}
                      />
                    )
                  case 'jobs':
                    return (
                      <JobsTableRow
                        key={i}
                        content={content}
                        convertToYaml={convertToYaml}
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

TableView.defaultProps = {
  groupLatestJob: {}
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
  tableContent: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({})),
    PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape({})))
  ]).isRequired,
  tableHeaders: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default TableView
