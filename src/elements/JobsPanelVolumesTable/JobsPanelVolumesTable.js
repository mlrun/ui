import React from 'react'
import { find } from 'lodash'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import JobsPanelTableAddItemRow from '../JobsPanelTableAddItemRow/JobsPanelTableAddItemRow'
import JobsPanelTable from '../JobsPanelTable/JobsPanelTable'

import panelData from '../../components/JobsPanel/panelData'
import { inputsActions } from '../../components/JobsPanelDataInputs/jobsPanelDataInputsReducer'
import { selectOptions } from '../../components/JobsPanelDataInputs/jobsPanelDataInputs.util'

import { ReactComponent as Plus } from '../../images/plus.svg'

export const JobsPanelVolumesTable = ({
  handleAddNewItem,
  handleEditItems,
  handleDeleteItems,
  inputsDispatch,
  inputsState,
  match,
  panelState
}) => {
  const volumeTypeNameLabel =
    inputsState.newVolume.type === 'V3IO'
      ? 'Container'
      : inputsState.newVolume.type === 'PVC'
      ? 'Claim name'
      : inputsState.newVolume.type.length > 0
      ? `${inputsState.newVolume.type} name`
      : ''

  return (
    <JobsPanelTable
      addNewItem={inputsState.addNewVolume}
      className="data-inputs volumes"
      content={panelState.tableData.volumeMounts}
      handleDeleteItems={handleDeleteItems}
      handleEditItems={handleEditItems}
      headers={panelData.volumes['table-headers']}
      match={match}
      section="volumes"
      selectedItem={inputsState.selectedVolume}
      setSelectedVolume={selectedVolume =>
        inputsDispatch({
          type: inputsActions.SET_SELECTED_VOLUME,
          payload: selectedVolume
        })
      }
      volumes={panelState.tableData.volumes}
    >
      {inputsState.addNewVolume ? (
        <div className="table__body">
          <div className="table__body-column">
            <div className="input-row-wrapper no-border">
              <Input
                onChange={name =>
                  inputsDispatch({
                    type: inputsActions.SET_NEW_VOLUME_NAME,
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
                  inputsDispatch({
                    type: inputsActions.SET_NEW_VOLUME_PATH,
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
                  ${inputsState.newVolume.type === 'V3IO' && 'no-border'}`}
            >
              <Select
                onClick={type => {
                  inputsDispatch({
                    type: inputsActions.SET_NEW_VOLUME_TYPE,
                    payload: find(selectOptions.volumeType, ['id', type]).id
                  })
                }}
                options={selectOptions.volumeType}
                label={
                  inputsState.newVolume.type.length
                    ? inputsState.newVolume.type
                    : 'Type'
                }
                match={match}
              />
              <Input
                onChange={typeName =>
                  inputsDispatch({
                    type: inputsActions.SET_NEW_VOLUME_TYPE_NAME,
                    payload: typeName
                  })
                }
                label={volumeTypeNameLabel}
                className="input-row__item input-row__item_edit"
                disabled={!inputsState.newVolume.type.length}
                floatingLabel
                type="text"
              />
            </div>
            {inputsState.newVolume.type === 'V3IO' && (
              <div className="input-row-wrapper">
                <Input
                  onChange={accessKey =>
                    inputsDispatch({
                      type: inputsActions.SET_NEW_VOLUME_ACCESS_KEY,
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
                    inputsDispatch({
                      type: inputsActions.SET_NEW_VOLUME_RESOURCES_PATH,
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
          <button
            className="add-input btn-add"
            onClick={() => handleAddNewItem(null, true)}
          >
            <Tooltip template={<TextTooltipTemplate text="Add item" />}>
              <Plus />
            </Tooltip>
          </button>
        </div>
      ) : (
        <JobsPanelTableAddItemRow
          onClick={value =>
            inputsDispatch({
              type: inputsActions.SET_ADD_NEW_VOLUME,
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
  inputsDispatch: PropTypes.func.isRequired,
  inputsState: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  panelState: PropTypes.shape({}).isRequired
}
