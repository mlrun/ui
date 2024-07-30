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

import JobsPanelParametersTableView from './JobsPanelParametersTableView'

import { SELECT_OPTIONS } from '../../types'

import { ReactComponent as Edit } from 'igz-controls/images/edit.svg'
import { ReactComponent as Delete } from 'igz-controls/images/delete.svg'

const JobsPanelParametersTable = ({
  addNewItem,
  checkParameter,
  children,
  className = '',
  content,
  handleDeleteParameter,
  handleEditParameter,
  headers = [],
  isPanelEditMode,
  parameterTypeOptions,
  selectedItem,
  setSelectedItem,
  tableContent
}) => {
  const [editItem, setEditItem] = useState(false)

  const handleEdit = useCallback(
    item => {
      if (!isPanelEditMode) {
        if (editItem) {
          setEditItem(false)
          handleEditParameter()
        } else {
          setSelectedItem(item)
          setEditItem(true)
        }
      }
    },
    [editItem, handleEditParameter, setSelectedItem, isPanelEditMode]
  )

  const generateActionsMenu = useCallback(
    (rowItem, index) => [
      {
        label: 'Edit',
        icon: <Edit />,
        onClick: param => handleEdit(param)
      },
      {
        label: 'Remove',
        icon: <Delete />,
        hidden: rowItem.isDefault,
        onClick: selectedItem => {
          handleDeleteParameter(selectedItem, index)
        }
      }
    ],
    [handleDeleteParameter, handleEdit]
  )

  return (
    <JobsPanelParametersTableView
      addNewItem={addNewItem}
      checkParameter={checkParameter}
      children={children}
      className={className}
      content={content}
      editItem={editItem}
      generateActionsMenu={generateActionsMenu}
      handleDeleteParameter={handleDeleteParameter}
      handleEditParameter={handleEdit}
      headers={headers}
      isPanelEditMode={isPanelEditMode}
      parameterTypeOptions={parameterTypeOptions}
      selectedItem={selectedItem}
      setEditItem={setEditItem}
      setSelectedItem={setSelectedItem}
      tableContent={tableContent}
    />
  )
}

JobsPanelParametersTable.propTypes = {
  addNewItem: PropTypes.bool.isRequired,
  checkParameter: PropTypes.func.isRequired,
  className: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.shape({})), PropTypes.shape({})])
    .isRequired,
  handleDeleteParameter: PropTypes.func,
  handleEditParameter: PropTypes.func.isRequired,
  headers: PropTypes.arrayOf(PropTypes.shape({})),
  isPanelEditMode: PropTypes.bool.isRequired,
  parameterTypeOptions: SELECT_OPTIONS.isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  setSelectedItem: PropTypes.func.isRequired,
  tableContent: PropTypes.shape({}).isRequired
}

export default JobsPanelParametersTable
