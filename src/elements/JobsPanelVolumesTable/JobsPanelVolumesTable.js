import React, { useCallback } from 'react'
import { find } from 'lodash'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import JobsPanelTableAddItemRow from '../JobsPanelTableAddItemRow/JobsPanelTableAddItemRow'
import JobsPanelTable from '../JobsPanelTable/JobsPanelTable'

import panelData from '../../components/JobsPanel/panelData'
import { selectTypeOptions } from '../../components/JobsPanelResources/jobsPanelResources.util'
import { resourcesActions } from '../../components/JobsPanelResources/jobsPanelResourcesReducer'

import { ReactComponent as Plus } from '../../images/plus.svg'

export const JobsPanelVolumesTable = ({
  handleAddNewItem,
  handleEditItems,
  handleDeleteItems,
  resourcesDispatch,
  resourcesState,
  match,
  panelState
}) => {
  const volumeTypeNameLabel =
    resourcesState.newVolume.type === 'V3IO'
      ? 'Container'
      : resourcesState.newVolume.type === 'PVC'
      ? 'Claim name'
      : resourcesState.newVolume.type.length > 0
      ? `${resourcesState.newVolume.type} name`
      : ''

  const handleSetSelectedVolume = useCallback(
    selectedVolume => {
      let newValue = {}
      const searchItem = panelState.tableData.volumes.find(
        volume => volume.name === selectedVolume.data.name
      )

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

      resourcesDispatch({
        type: resourcesActions.SET_SELECTED_VOLUME,
        payload: {
          ...selectedVolume,
          type: newValue
        }
      })
    },
    [panelState.tableData.volumes, resourcesDispatch]
  )

  return (
    <JobsPanelTable
      addNewItem={resourcesState.addNewVolume}
      className="data-inputs volumes"
      content={panelState.tableData.volumeMounts}
      handleDeleteItems={handleDeleteItems}
      handleEditItems={handleEditItems}
      handleSetSelectedVolume={handleSetSelectedVolume}
      headers={panelData.volumes['table-headers']}
      match={match}
      section="volumes"
      selectedItem={resourcesState.selectedVolume}
      setSelectedItem={selectedVolume =>
        resourcesDispatch({
          type: resourcesActions.SET_SELECTED_VOLUME,
          payload: selectedVolume
        })
      }
    >
      {resourcesState.addNewVolume ? (
        <div className="table__body">
          <div className="table__body-column">
            <div className="input-row-wrapper no-border">
              <Input
                onChange={name =>
                  resourcesDispatch({
                    type: resourcesActions.SET_NEW_VOLUME_NAME,
                    payload: name
                  })
                }
                label="Name"
                className="input-row__item"
                floatingLabel
                type="text"
              />
              <Input
                onChange={path =>
                  resourcesDispatch({
                    type: resourcesActions.SET_NEW_VOLUME_PATH,
                    payload: path
                  })
                }
                label="Path"
                className="input-row__item input-row__item_edit"
                floatingLabel
                type="text"
              />
            </div>
            <div
              className={`input-row-wrapper 
                  ${resourcesState.newVolume.type === 'V3IO' && 'no-border'}`}
            >
              <Select
                onClick={type => {
                  resourcesDispatch({
                    type: resourcesActions.SET_NEW_VOLUME_TYPE,
                    payload: find(selectTypeOptions.volumeType, ['id', type]).id
                  })
                }}
                options={selectTypeOptions.volumeType}
                label={
                  resourcesState.newVolume.type.length
                    ? resourcesState.newVolume.type
                    : 'Type'
                }
                match={match}
              />
              <Input
                onChange={typeName =>
                  resourcesDispatch({
                    type: resourcesActions.SET_NEW_VOLUME_TYPE_NAME,
                    payload: typeName
                  })
                }
                label={volumeTypeNameLabel}
                className="input-row__item input-row__item_edit"
                disabled={!resourcesState.newVolume.type.length}
                floatingLabel
                type="text"
              />
            </div>
            {resourcesState.newVolume.type === 'V3IO' && (
              <div className="input-row-wrapper">
                <Input
                  onChange={accessKey =>
                    resourcesDispatch({
                      type: resourcesActions.SET_NEW_VOLUME_ACCESS_KEY,
                      payload: accessKey
                    })
                  }
                  label="Access Key"
                  className="input-row__item"
                  floatingLabel
                  type="text"
                />
                <Input
                  onChange={resourcesPath =>
                    resourcesDispatch({
                      type: resourcesActions.SET_NEW_VOLUME_RESOURCES_PATH,
                      payload: resourcesPath
                    })
                  }
                  label="Resource path"
                  className="input-row__item input-row__item_edit"
                  floatingLabel
                  type="text"
                />
              </div>
            )}
          </div>
          <button className="add-input btn-add" onClick={handleAddNewItem}>
            <Tooltip template={<TextTooltipTemplate text="Add item" />}>
              <Plus />
            </Tooltip>
          </button>
        </div>
      ) : (
        <JobsPanelTableAddItemRow
          onClick={value =>
            resourcesDispatch({
              type: resourcesActions.SET_ADD_NEW_VOLUME,
              payload: value
            })
          }
          text="volume"
        />
      )}
    </JobsPanelTable>
  )
}

JobsPanelVolumesTable.propTypes = {
  handleAddNewItem: PropTypes.func.isRequired,
  handleEditItems: PropTypes.func.isRequired,
  handleDeleteItems: PropTypes.func.isRequired,
  resourcesDispatch: PropTypes.func.isRequired,
  resourcesState: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  panelState: PropTypes.shape({}).isRequired
}
