import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import EditableParametersRow from '../EditableParametersRow/EditableParametersRow'
import JobsPanelTableRow from '../JobsPanelTableRow/JobsPanelTableRow'

import { SELECT_OPTIONS } from '../../types'

import './jobsPanelParametersTable.scss'

const JobsPanelParametersTableView = ({
  addNewItem,
  checkParameter,
  children,
  className,
  content,
  editItem,
  generateActionsMenu,
  handleDeleteParameter,
  handleEditParameter,
  headers,
  parameterTypeOptions,
  selectedItem,
  setEditItem,
  setSelectedItem,
  tableContent
}) => {
  const tableClassNames = classnames(
    'new-item-side-panel__table job-panel__parameters-table',
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
      {Object.entries(tableContent)?.map(([key, value], index) =>
        value.length > 0 ? (
          <div key={key}>
            <div className="table__row no-hover">
              <div className="table__cell table__subheader">{key}</div>
            </div>
            {value.map(contentItem => {
              if (
                editItem &&
                contentItem.data.name === selectedItem.data.name
              ) {
                return (
                  <EditableParametersRow
                    content={content}
                    handleEdit={handleEditParameter}
                    key={`${contentItem.data.name}${index}`}
                    parameterTypeOptions={parameterTypeOptions}
                    selectedParameter={selectedItem}
                    setEditItem={setEditItem}
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
                    editItem={editItem}
                    handleDelete={handleDeleteParameter}
                    handleEdit={handleEditParameter}
                    index={index}
                    key={`${contentItem.data.name}${index}`}
                    section="parameters"
                    withCheckbox
                  />
                )
              }
            })}
          </div>
        ) : null
      )}
      {children}
    </div>
  )
}

JobsPanelParametersTableView.propTypes = {
  addNewItem: PropTypes.bool.isRequired,
  children: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired,
  content: PropTypes.array.isRequired,
  editItem: PropTypes.bool.isRequired,
  generateActionsMenu: PropTypes.func.isRequired,
  handleDeleteParameter: PropTypes.func.isRequired,
  handleEditParameter: PropTypes.func.isRequired,
  headers: PropTypes.array.isRequired,
  parameterTypeOptions: SELECT_OPTIONS.isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  setEditItem: PropTypes.func.isRequired,
  setSelectedItem: PropTypes.func.isRequired,
  tableContent: PropTypes.shape({}).isRequired
}

export default JobsPanelParametersTableView
