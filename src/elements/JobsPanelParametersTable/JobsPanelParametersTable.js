import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'

import JobsPanelParametersTableView from './JobsPanelParametersTableView'

import { SELECT_OPTIONS } from '../../types'

import { ReactComponent as Edit } from '../../images/edit.svg'
import { ReactComponent as Delete } from '../../images/delete.svg'

const JobsPanelParametersTable = ({
  addNewItem,
  children,
  checkParameter,
  className,
  content,
  handleDeleteParameter,
  handleEditParameter,
  headers,
  parameterTypeOptions,
  selectedItem,
  setSelectedItem,
  tableContent
}) => {
  const [editItem, setEditItem] = useState(false)

  const handleEdit = useCallback(
    item => {
      if (editItem) {
        setEditItem(false)
        handleEditParameter()
      } else {
        setSelectedItem(item)
        setEditItem(true)
      }
    },
    [editItem, handleEditParameter, setSelectedItem]
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
  headers: [],
  handleDeleteItems: null,
  handleSetSelectedVolume: null
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
  parameterTypeOptions: SELECT_OPTIONS.isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  setSelectedItem: PropTypes.func.isRequired,
  tableContent: PropTypes.shape({}).isRequired
}

export default JobsPanelParametersTable
