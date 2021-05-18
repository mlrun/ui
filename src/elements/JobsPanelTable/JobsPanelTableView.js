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
  match,
  section,
  sectionData,
  sectionDispatch,
  sectionState,
  selectedItem,
  setEditItem,
  setSelectedItem
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
        const contentItemName = section.includes('secrets') ? 'kind' : 'name'

        if (
          editItem &&
          contentItem.data[contentItemName] ===
            selectedItem.data[contentItemName]
        ) {
          return section === 'data-inputs' ? (
            <EditableDataInputsRow
              comboboxMatchesList={sectionData.comboboxMatchesList}
              handleEdit={handleEdit}
              inputsDispatch={sectionDispatch}
              inputsState={sectionState}
              key={index}
              selectedDataInput={selectedItem}
              setEditItem={setEditItem}
              setSelectedDataInput={setSelectedItem}
            />
          ) : (
            <EditableAdvancedRow
              handleEdit={handleEdit}
              key={index}
              match={match}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              table={section.includes('secrets') ? 'secrets' : 'env'}
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
  match: PropTypes.shape({}).isRequired,
  section: PropTypes.string.isRequired,
  sectionData: PropTypes.shape({}),
  sectionDispatch: PropTypes.func,
  sectionState: PropTypes.shape({}),
  selectedItem: PropTypes.shape({}).isRequired,
  setEditItem: PropTypes.func,
  setSelectedItem: PropTypes.func.isRequired
}

export default JobsPanelTableView
