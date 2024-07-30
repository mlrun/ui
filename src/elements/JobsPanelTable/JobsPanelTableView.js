/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
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
  sectionData = {},
  sectionDispatch = () => {},
  sectionState = {},
  selectedItem,
  setEditItem = () => {},
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
