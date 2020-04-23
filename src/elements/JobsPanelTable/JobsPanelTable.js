import React, { useState } from 'react'
import PropTypes from 'prop-types'

import EditableDataInputsRow from '../EditableDataInputsRow/EditableDataInputsRow'
import JobsPanelTableRow from '../JobsPanelTableRow/JobsPanelTableRow'
import EditableParametersRow from '../EditableParametersRow/EditableParametersRow'
import EditableVolumesRow from '../EditableVolumesRow/EditableVolumesRow'

import { ReactComponent as Edit } from '../../images/edit.svg'
import { ReactComponent as Delete } from '../../images/delete.svg'

import './jobsPanelTable.scss'

const JobsPanelTable = ({
  addNewItem,
  children,
  className,
  content,
  headers,
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

  const actionsMenu = [
    {
      label: 'Edit',
      icon: <Edit />,
      onClick: param => handleEdit(param)
    },
    { label: 'Remove', icon: <Delete />, onClick: () => {} }
  ]

  const handleEdit = (item, isInput) => {
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
  }

  const handleSetSelectedVolume = selectedVolume => {
    const searchItem = volumes.find(
      volume => volume.name === selectedVolume.name
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
  }

  return (
    <div
      className={`job-panel__table ${addNewItem && 'no-border'} ${className}`}
    >
      {headers.length > 0 && (
        <div className="table__header table__row no-hover">
          {headers.map((header, i) => (
            <div className="table__cell" key={i}>
              {header}
            </div>
          ))}
        </div>
      )}
      {Array.isArray(content)
        ? content.map((contentItem, i) => {
            if (editItem && contentItem.name === selectedItem.name) {
              return section === 'parameters' ? (
                <EditableParametersRow
                  key={i}
                  handleEdit={handleEdit}
                  match={match}
                  selectedParameter={selectedItem}
                  setSelectedParameter={setSelectedParameter}
                />
              ) : (
                <EditableVolumesRow
                  handleEdit={handleEdit}
                  key={i}
                  selectedVolume={selectedItem}
                  setSelectedVolume={setSelectedVolume}
                />
              )
            } else {
              return (
                <JobsPanelTableRow
                  actionsMenu={actionsMenu}
                  item={contentItem}
                  key={i}
                  row={Object.values(contentItem)}
                />
              )
            }
          })
        : Object.entries(content).map((row, i) => {
            if (editItem && row[0] === selectedItem.name) {
              return (
                <EditableDataInputsRow
                  handleEdit={handleEdit}
                  key={i}
                  selectedDataInput={selectedItem}
                  setSelectedDataInput={setSelectedDataInput}
                />
              )
            }
            return (
              <JobsPanelTableRow
                actionsMenu={actionsMenu}
                item={{ name: row[0], path: row[1] }}
                key={i}
                row={row}
              />
            )
          })}
      {children}
    </div>
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
  headers: PropTypes.arrayOf(PropTypes.string),
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
