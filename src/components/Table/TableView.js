import React from 'react'
import PropTypes from 'prop-types'

import JobsTableRow from '../../elements/JobsTableRow/JobsTableRow'
import ArtifactsTableRow from '../../elements/ArtifactsTableRow/ArtifactsTableRow'
import Details from '../Details/Details'
import FunctionsTableRow from '../../elements/FunctionsTableRow/FunctionsTableRow'

import { JOBS_PAGE, ARTIFACTS_PAGE, FUNCTIONS_PAGE } from '../../constants'

const TableView = ({
  content,
  detailsMenu,
  groupFilter,
  groupLatestJob,
  groupedByName,
  handleCancel,
  handleExpandRow,
  handleSelectItem,
  match,
  page,
  selectedItem,
  tableHeaders,
  tableContent,
  toggleConvertToYaml
}) => {
  return (
    <div className="table">
      <div
        className={`table__content ${Object.keys(selectedItem).length !== 0 &&
          'table_opened'}`}
      >
        <div className="table-head">
          {tableHeaders.map((item, index) => (
            <div
              className={`table-head__item ${item.class}`}
              key={item.header + index}
            >
              <span>{item.header}</span>
            </div>
          ))}
        </div>
        <div className="table-body">
          {(groupFilter === 'None' &&
            Object.keys(groupedByName).length === 0) ||
          groupLatestJob.length === 0
            ? tableContent.map((rowItem, i) => {
                switch (page) {
                  case ARTIFACTS_PAGE:
                    return (
                      <ArtifactsTableRow
                        key={i}
                        content={content}
                        toggleConvertToYaml={toggleConvertToYaml}
                        handleSelectItem={handleSelectItem}
                        index={i}
                        match={match}
                        rowItem={rowItem}
                        selectedItem={selectedItem}
                      />
                    )
                  case FUNCTIONS_PAGE:
                    return (
                      <FunctionsTableRow
                        key={i}
                        toggleConvertToYaml={toggleConvertToYaml}
                        content={content}
                        match={match}
                        rowItem={rowItem}
                        index={i}
                        selectedItem={selectedItem}
                        handleSelectItem={handleSelectItem}
                      />
                    )
                  case JOBS_PAGE:
                    return (
                      <JobsTableRow
                        key={i}
                        content={content}
                        toggleConvertToYaml={toggleConvertToYaml}
                        handleSelectItem={handleSelectItem}
                        index={i}
                        match={match}
                        rowItem={rowItem}
                        selectedItem={selectedItem}
                      />
                    )
                  default:
                    return null
                }
              })
            : tableContent.map((group, i) => {
                return (
                  <JobsTableRow
                    key={i}
                    content={content}
                    toggleConvertToYaml={toggleConvertToYaml}
                    handleExpandRow={handleExpandRow}
                    handleSelectItem={handleSelectItem}
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
          toggleConvertToYaml={toggleConvertToYaml}
          detailsMenu={detailsMenu}
          handleCancel={handleCancel}
          handleSelectItem={handleSelectItem}
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
  toggleConvertToYaml: PropTypes.func.isRequired,
  detailsMenu: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleSelectItem: PropTypes.func.isRequired,
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
