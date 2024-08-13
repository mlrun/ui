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
import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'

import { ReactComponent as Edit } from 'igz-controls/images/edit.svg'
import { ReactComponent as Delete } from 'igz-controls/images/delete.svg'

import JobsPanelTableView from './JobsPanelTableView'

import './jobsPanelTable.scss'

const JobsPanelTable = ({
  addNewItem,
  children,
  className = '',
  content,
  handleDeleteItems = null,
  handleEditItems,
  headers = [],
  section,
  sectionData = {},
  sectionDispatch = () => {},
  sectionState = {},
  selectedItem,
  setSelectedItem,
  setValidation = () => {},
  validation = {}
}) => {
  const [editItem, setEditItem] = useState(false)

  const handleEdit = useCallback(
    (item, index) => {
      if (editItem) {
        setEditItem(false)
        handleEditItems(index)
      } else {
        setSelectedItem({ ...item, index })
        setEditItem(true)
      }
    },
    [editItem, handleEditItems, setSelectedItem]
  )

  const handleDelete = useCallback(
    (item, index) => {
      handleDeleteItems(item, index)
    },
    [handleDeleteItems]
  )

  const generateActionsMenu = useCallback(
    (rowItem, index) => [
      {
        label: 'Edit',
        icon: <Edit />,
        onClick: param => handleEdit(param, index)
      },
      {
        label: 'Remove',
        icon: <Delete />,
        hidden: rowItem.isDefault,
        onClick: selectedItem => {
          handleDelete(selectedItem, index)
        }
      }
    ],
    [handleDelete, handleEdit]
  )

  return (
    <JobsPanelTableView
      addNewItem={addNewItem}
      children={children}
      className={className}
      content={content}
      editItem={editItem}
      generateActionsMenu={generateActionsMenu}
      handleDelete={handleDelete}
      handleEdit={handleEdit}
      headers={headers}
      section={section}
      sectionData={sectionData}
      sectionDispatch={sectionDispatch}
      sectionState={sectionState}
      selectedItem={selectedItem}
      setEditItem={setEditItem}
      setSelectedItem={setSelectedItem}
      setValidation={setValidation}
      validation={validation}
    />
  )
}

JobsPanelTable.propTypes = {
  addNewItem: PropTypes.bool.isRequired,
  className: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.shape({})), PropTypes.shape({})])
    .isRequired,
  handleDeleteItems: PropTypes.func,
  handleEditItems: PropTypes.func.isRequired,
  headers: PropTypes.arrayOf(PropTypes.shape({})),
  section: PropTypes.string.isRequired,
  sectionData: PropTypes.shape({}),
  sectionDispatch: PropTypes.func,
  sectionState: PropTypes.shape({}),
  selectedItem: PropTypes.shape({}).isRequired,
  setSelectedItem: PropTypes.func.isRequired,
  setValidation: PropTypes.func,
  validation: PropTypes.object
}

export default JobsPanelTable
