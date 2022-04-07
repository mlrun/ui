import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import EditableDataInputsRow from '../EditableDataInputsRow/EditableDataInputsRow'
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
  section,
  sectionData,
  sectionDispatch,
  sectionState,
  selectedItem,
  setEditItem,
  setSelectedItem,
  setValidation,
  validation
}) => {
  const tableClassNames = classnames(
    'new-item-side-panel__table',
    'job-panel__table',
    addNewItem && 'no-border',
    className
  )

  return (
    <div className={tableClassNames}>
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
        if (editItem && index === selectedItem.index) {
          return section === 'data-inputs' ? (
            <EditableDataInputsRow
              comboboxMatchesList={sectionData.comboboxMatchesList}
              content={content}
              handleEdit={handleEdit}
              inputsDispatch={sectionDispatch}
              inputsState={sectionState}
              index={index}
              key={index}
              selectedDataInput={selectedItem}
              setEditItem={setEditItem}
              setSelectedDataInput={setSelectedItem}
            />
          ) : (
            <EditableAdvancedRow
              content={content}
              handleEdit={handleEdit}
              index={index}
              key={index}
              selectedItem={selectedItem}
              setEditItem={setEditItem}
              setSelectedItem={setSelectedItem}
              setValidation={setValidation}
              table={section.includes('secrets') ? 'secrets' : 'env'}
              validation={validation}
            />
          )
        } else {
          return (
            <JobsPanelTableRow
              actionsMenu={generateActionsMenu(contentItem, index)}
              contentItem={contentItem}
              editItem={editItem}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              index={index}
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

JobsPanelTableView.defaultProps = {
  sectionData: {},
  sectionDispatch: () => {},
  sectionState: {},
  setEditItem: () => {}
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
  section: PropTypes.string.isRequired,
  sectionData: PropTypes.shape({}),
  sectionDispatch: PropTypes.func,
  sectionState: PropTypes.shape({}),
  selectedItem: PropTypes.shape({}).isRequired,
  setEditItem: PropTypes.func,
  setSelectedItem: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.object.isRequired
}

export default JobsPanelTableView
