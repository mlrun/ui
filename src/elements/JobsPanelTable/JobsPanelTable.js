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
  match,
  section,
  selectedItem,
  setSelectedDataInput,
  setSelectedParameter,
  setSelectedVolume,
  volumes
}) => {
  const [editItem, setEditItem] = useState(false)

  const selectOption = {
    parameterType: [
      { label: 'Simple', id: 'Simple' },
      { label: 'Hyper', id: 'Hyper' }
    ]
  }

  const handleSetSelectedVolume = useCallback(
    selectedVolume => {
      const searchItem = volumes.find(
        volume => volume.name === selectedVolume.data.name
      )

      let newValue

      if (searchItem.configMap) {
        newValue = {
          value: 'Config Map',
          name: searchItem.configMap.name
        }
      } else if (searchItem.persistentVolumeClaim) {
        newValue = {
          value: 'PVC',
          name: searchItem.persistentVolumeClaim.claimName
        }
      } else if (searchItem.secret) {
        newValue = {
          value: 'Secret',
          name: searchItem.secret.secretName
        }
      } else {
        newValue = {
          value: 'V3IO',
          name: searchItem.flexVolume.options.container,
          accessKey: searchItem.flexVolume.options.accessKey,
          subPath: searchItem.flexVolume.options.subPath
        }
      }

      setSelectedVolume({
        ...selectedVolume,
        type: newValue
      })
    },
    [setSelectedVolume, volumes]
  )

  const handleEdit = useCallback(
    (item, isInput) => {
      if (editItem) {
        setEditItem(false)
        section === 'parameters'
          ? handleEditParameter()
          : handleEditItems(isInput)
      } else {
        switch (section) {
          case 'parameters':
            setSelectedParameter(item)
            break
          case 'data-inputs':
            setSelectedDataInput(item)
            break
          default:
            handleSetSelectedVolume(item)
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
      setSelectedDataInput,
      setSelectedParameter
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
      setSelectedDataInput={setSelectedDataInput}
      setSelectedParameter={setSelectedParameter}
      setSelectedVolume={setSelectedVolume}
    />
  )
}

JobsPanelTable.defaultProps = {
  className: '',
  headers: [],
  handleEditItems: null,
  handleEditParameter: null,
  etSelectedDataInput: null,
  setSelectedParameter: null,
  setSelectedVolume: null
}

JobsPanelTable.propTypes = {
  addNewItem: PropTypes.bool.isRequired,
  className: PropTypes.string,
  content: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({})),
    PropTypes.shape({})
  ]).isRequired,
  headers: PropTypes.arrayOf(PropTypes.shape({})),
  handleEditItems: PropTypes.func,
  handleEditParameter: PropTypes.func,
  match: PropTypes.shape({}).isRequired,
  section: PropTypes.string.isRequired,
  selectedItem: PropTypes.shape({}).isRequired,
  setSelectedDataInput: PropTypes.func,
  setSelectedParameter: PropTypes.func,
  setSelectedVolume: PropTypes.func,
  volumes: PropTypes.arrayOf(PropTypes.shape({}))
}

export default JobsPanelTable
