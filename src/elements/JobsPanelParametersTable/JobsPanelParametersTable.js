import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'

import JobsPanelParametersTableView from './JobsPanelParametersTableView'

import { ReactComponent as Edit } from '../../images/edit.svg'
import { ReactComponent as Delete } from '../../images/delete.svg'

const JobsPanelParametersTable = ({
  addNewItem,
  children,
  checkParameter,
  className,
  content,
  disabledOptions,
  handleDeleteParameter,
  handleEditParameter,
  headers,
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
    rowItem => [
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
          handleDeleteParameter(selectedItem)
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
      disabledOptions={disabledOptions}
      editItem={editItem}
      generateActionsMenu={generateActionsMenu}
      handleDeleteParameter={handleDeleteParameter}
      handleEditParameter={handleEdit}
      headers={headers}
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
  disabledOptions: PropTypes.array,
  handleDeleteParameter: PropTypes.func,
  handleEditParameter: PropTypes.func.isRequired,
  headers: PropTypes.arrayOf(PropTypes.shape({})),
  selectedItem: PropTypes.shape({}).isRequired,
  setSelectedItem: PropTypes.func.isRequired,
  tableContent: PropTypes.shape({}).isRequired
}

export default JobsPanelParametersTable
