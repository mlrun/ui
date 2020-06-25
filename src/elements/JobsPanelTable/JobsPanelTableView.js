import React from 'react'
import PropTypes from 'prop-types'

import EditableParametersRow from '../EditableParametersRow/EditableParametersRow'
import EditableDataInputsRow from '../EditableDataInputsRow/EditableDataInputsRow'
import EditableVolumesRow from '../EditableVolumesRow/EditableVolumesRow'
import JobsPanelTableRow from '../JobsPanelTableRow/JobsPanelTableRow'
import EditableAdvancedRow from '../EditableAdvancedRow/EditableAdvancedRow'

const JobsPanelTableView = ({
  addNewItem,
  children,
  className,
  content,
  editItem,
  generateActionsMenu,
  handleDelete,
  handleEdit,
  headers,
  match,
  section,
  selectedItem,
  setSelectedItem
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
      {content?.map((contentItem, index) => {
        const contentItemName = section.includes('secrets') ? 'kind' : 'name'

        if (
          editItem &&
          contentItem.data[contentItemName] ===
            selectedItem.data[contentItemName]
        ) {
          return section === 'parameters' ? (
            <EditableParametersRow
              handleEdit={handleEdit}
              key={index}
              match={match}
              selectedParameter={selectedItem}
              setSelectedParameter={setSelectedItem}
            />
          ) : section === 'data-inputs' ? (
            <EditableDataInputsRow
              handleEdit={handleEdit}
              key={index}
              selectedDataInput={selectedItem}
              setSelectedDataInput={setSelectedItem}
            />
          ) : section.includes('advanced') ? (
            <EditableAdvancedRow
              handleEdit={handleEdit}
              key={index}
              match={match}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              table={section.includes('secrets') ? 'secrets' : 'env'}
            />
          ) : (
            <EditableVolumesRow
              handleEdit={handleEdit}
              key={index}
              selectedVolume={selectedItem}
              setSelectedVolume={setSelectedItem}
            />
          )
        } else {
          return (
            <JobsPanelTableRow
              actionsMenu={generateActionsMenu(contentItem)}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              contentItem={contentItem}
              key={index}
              section={section}
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
  handleDelete: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  headers: PropTypes.array.isRequired,
  match: PropTypes.shape({}).isRequired,
  section: PropTypes.string.isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  setSelectedItem: PropTypes.func.isRequired
}

export default JobsPanelTableView
