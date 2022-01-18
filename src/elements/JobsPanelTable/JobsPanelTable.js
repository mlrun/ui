import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'

import { ReactComponent as Edit } from '../../images/edit.svg'
import { ReactComponent as Delete } from '../../images/delete.svg'

import JobsPanelTableView from './JobsPanelTableView'

import './jobsPanelTable.scss'

const JobsPanelTable = ({
  addNewItem,
  children,
  className,
  content,
  handleDeleteItems,
  handleEditItems,
  headers,
  match,
  section,
  sectionData,
  sectionDispatch,
  sectionState,
  selectedItem,
  setSelectedItem,
  setValidation,
  validation
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
      match={match}
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

JobsPanelTable.defaultProps = {
  className: '',
  headers: [],
  handleDeleteItems: null,
  handleSetSelectedVolume: null,
  sectionData: {},
  sectionDispatch: () => {},
  sectionState: {},
  setValidation: () => {},
  validation: {}
}

JobsPanelTable.propTypes = {
  addNewItem: PropTypes.bool.isRequired,
  className: PropTypes.string,
  content: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({})),
    PropTypes.shape({})
  ]).isRequired,
  handleDeleteItems: PropTypes.func,
  handleEditItems: PropTypes.func.isRequired,
  handleSetSelectedVolume: PropTypes.func,
  headers: PropTypes.arrayOf(PropTypes.shape({})),
  match: PropTypes.shape({}).isRequired,
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
