import React from 'react'
import PropTypes from 'prop-types'

import EditableParametersRow from '../EditableParametersRow/EditableParametersRow'
import EditableDataInputsRow from '../EditableDataInputsRow/EditableDataInputsRow'
import EditableVolumesRow from '../EditableVolumesRow/EditableVolumesRow'
import JobsPanelTableRow from '../JobsPanelTableRow/JobsPanelTableRow'

const JobsPanelTableView = ({
  addNewItem,
  children,
  className,
  content,
  editItem,
  generateActionsMenu,
  handleEdit,
  headers,
  match,
  section,
  selectOption,
  selectedItem,
  setSelectedDataInput,
  setSelectedParameter,
  setSelectedVolume
}) => {
  return (
    <div
      className={`job-panel__table ${addNewItem && 'no-border'} ${className}`}
    >
      {headers.length > 0 && (
        <div className="table__header table__row no-hover">
          {headers.map((header, index) => (
            <div className="table__cell" key={index}>
              {header.label}
            </div>
          ))}
          <div className="table__cell-actions" />
        </div>
      )}
      {content.map((contentItem, index) => {
        if (editItem && contentItem.data.name === selectedItem.data.name) {
          return section === 'parameters' ? (
            <EditableParametersRow
              handleEdit={handleEdit}
              key={index}
              match={match}
              selectOption={selectOption}
              selectedParameter={selectedItem}
              setSelectedParameter={setSelectedParameter}
            />
          ) : section === 'data-inputs' ? (
            <EditableDataInputsRow
              handleEdit={handleEdit}
              key={index}
              selectedDataInput={selectedItem}
              setSelectedDataInput={setSelectedDataInput}
            />
          ) : (
            <EditableVolumesRow
              handleEdit={handleEdit}
              key={index}
              selectedVolume={selectedItem}
              setSelectedVolume={setSelectedVolume}
            />
          )
        } else {
          return (
            <JobsPanelTableRow
              actionsMenu={generateActionsMenu(contentItem)}
              item={contentItem}
              key={index}
            />
          )
        }
      })}
      {children}
    </div>
  )
}

JobsPanelTableView.propTypes = {
  addNewItem: PropTypes.bool.isRequired,
  children: PropTypes.object.isRequired,
  className: PropTypes.string.isRequired,
  content: PropTypes.array.isRequired,
  editItem: PropTypes.bool.isRequired,
  generateActionsMenu: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  headers: PropTypes.array.isRequired,
  match: PropTypes.shape({}).isRequired,
  section: PropTypes.string.isRequired,
  selectOption: PropTypes.shape({}).isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  setSelectedDataInput: PropTypes.func,
  setSelectedParameter: PropTypes.func,
  setSelectedVolume: PropTypes.func
}

export default JobsPanelTableView
