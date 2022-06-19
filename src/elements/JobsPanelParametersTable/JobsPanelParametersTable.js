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
  className,
  content,
  handleDeleteParameter,
  handleEditParameter,
  headers,
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

JobsPanelParametersTable.defaultProps = {
  className: '',
  handleDeleteItems: null,
  handleSetSelectedVolume: null,
  headers: []
}

JobsPanelParametersTable.propTypes = {
  addNewItem: PropTypes.bool.isRequired,
  checkParameter: PropTypes.func.isRequired,
  className: PropTypes.string,
  content: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({})),
    PropTypes.shape({})
  ]).isRequired,
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
