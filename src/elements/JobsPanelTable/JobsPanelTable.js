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
  headers,
  handleDeleteItems,
  handleEditItems,
  handleEditParameter,
  handleSetSelectedVolume,
  match,
  section,
  selectedItem,
  setSelectedItem
}) => {
  const [editItem, setEditItem] = useState(false)

  const selectOption = {
    parameterType: [
      { label: 'Simple', id: 'Simple' },
      { label: 'Hyper', id: 'Hyper' }
    ]
  }

  const handleEdit = useCallback(
    (item, isInput) => {
      if (editItem) {
        setEditItem(false)
        section === 'parameters'
          ? handleEditParameter()
          : handleEditItems(isInput)
      } else {
        if (section === 'volumes') {
          handleSetSelectedVolume(item)
        } else {
          setSelectedItem(item)
        }

        setEditItem(true)
      }
    },
    [
      editItem,
      handleEditItems,
      handleEditParameter,
      handleSetSelectedVolume,
      section,
      setSelectedItem
    ]
  )

  const handleDelete = useCallback(
    item => {
      handleDeleteItems(section === 'data-inputs', item)
    },
    [handleDeleteItems, section]
  )

  const generateActionsMenu = useCallback(
    item => {
      return [
        {
          label: 'Edit',
          icon: <Edit />,
          visible: item.isValueEmpty,
          onClick: param => handleEdit(param)
        },
        {
          label: 'Remove',
          icon: <Delete />,
          visible: item.isValueEmpty && !item.isDefault,
          onClick: item => {
            handleDelete(item)
          }
        }
      ]
    },
    [handleEdit, handleDelete]
  )

  return (
    <JobsPanelTableView
      addNewItem={addNewItem}
      children={children}
      className={className}
      content={content}
      editItem={editItem}
      generateActionsMenu={generateActionsMenu}
      handleEdit={handleEdit}
      headers={headers}
      match={match}
      section={section}
      selectOption={selectOption}
      selectedItem={selectedItem}
      setSelectedItem={setSelectedItem}
    />
  )
}

JobsPanelTable.defaultProps = {
  className: '',
  headers: [],
  handleDeleteItems: null,
  handleEditItems: null,
  handleEditParameter: null,
  handleSetSelectedVolume: null
}

JobsPanelTable.propTypes = {
  addNewItem: PropTypes.bool.isRequired,
  className: PropTypes.string,
  content: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({})),
    PropTypes.shape({})
  ]).isRequired,
  headers: PropTypes.arrayOf(PropTypes.shape({})),
  handleDeleteItems: PropTypes.func,
  handleEditItems: PropTypes.func,
  handleEditParameter: PropTypes.func,
  handleSetSelectedVolume: PropTypes.func,
  match: PropTypes.shape({}).isRequired,
  section: PropTypes.string.isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  setSelectedItem: PropTypes.func.isRequired
}

export default JobsPanelTable
