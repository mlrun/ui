import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import EditableParametersRow from '../EditableParametersRow/EditableParametersRow'
import JobsPanelTableRow from '../JobsPanelTableRow/JobsPanelTableRow'

import './jobsPanelParametersTable.scss'

const JobsPanelParametersTableView = ({
  addNewItem,
  children,
  checkParameter,
  className,
  disabledOptions,
  editItem,
  generateActionsMenu,
  handleDeleteParameter,
  handleEditParameter,
  headers,
  selectedItem,
  setSelectedItem,
  tableContent
}) => {
  const tableClassNames = classnames(
    'job-panel__parameters-table',
    addNewItem && 'no-border',
    className
  )

  return (
    <div className={tableClassNames}>
      {headers.length > 0 && (
        <div className="table__header table__row no-hover">
          <div className="table__cell table__cell-checkbox" />
          {headers.map((header, index) => (
            <div className="table__cell" key={index}>
              {header.label}
            </div>
          ))}
          <div className="table__cell-actions" />
        </div>
      )}
      {Object.entries(tableContent)?.map((contentCategory, index) => {
        return contentCategory[1].length > 0 ? (
          <div key={contentCategory[0]}>
            <div className="table__row no-hover">
              <div className="table__cell table__subheader">
                {contentCategory[0]}
              </div>
            </div>
            {contentCategory[1].map(contentItem => {
              if (
                editItem &&
                contentItem.data.name === selectedItem.data.name
              ) {
                return (
                  <EditableParametersRow
                    disabledOptions={disabledOptions}
                    handleEdit={handleEditParameter}
                    key={contentItem.data.name + index}
                    selectedParameter={selectedItem}
                    setSelectedParameter={setSelectedItem}
                  />
                )
              } else {
                const tableRowClassNames = classnames(
                  !contentItem.isChecked && 'table__parameters-row_unchecked'
                )

                return (
                  <JobsPanelTableRow
                    actionsMenu={generateActionsMenu(contentItem)}
                    checkboxOnChange={checkParameter}
                    className={tableRowClassNames}
                    contentItem={contentItem}
                    handleDelete={handleDeleteParameter}
                    handleEdit={handleEditParameter}
                    key={contentItem.data.name + index}
                    section="parameters"
                    withCheckbox
                  />
                )
              }
            })}
          </div>
        ) : null
      })}
      {children}
    </div>
  )
}

JobsPanelParametersTableView.propTypes = {
  addNewItem: PropTypes.bool.isRequired,
  children: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired,
  content: PropTypes.array.isRequired,
  disabledOptions: PropTypes.array,
  editItem: PropTypes.bool.isRequired,
  generateActionsMenu: PropTypes.func.isRequired,
  handleDeleteParameter: PropTypes.func.isRequired,
  handleEditParameter: PropTypes.func.isRequired,
  headers: PropTypes.array.isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  setSelectedItem: PropTypes.func.isRequired,
  tableContent: PropTypes.shape({}).isRequired
}

export default JobsPanelParametersTableView
