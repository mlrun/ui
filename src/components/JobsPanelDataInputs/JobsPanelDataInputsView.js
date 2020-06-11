import React from 'react'
import PropTypes from 'prop-types'
import { find } from 'lodash'

import JobsPanelSection from '../../elements/JobsPanelSection/JobsPanelSection'
import JobsPanelTable from '../../elements/JobsPanelTable/JobsPanelTable'
import Input from '../../common/Input/Input'
import JobsPanelTableAddItemRow from '../../elements/JobsPanelTableAddItemRow/JobsPanelTableAddItemRow'
import Select from '../../common/Select/Select'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import Tooltip from '../../common/Tooltip/Tooltip'

import panelData from '../JobsPanel/panelData'
import { panelActions } from '../JobsPanel/panelReducer'

import { ReactComponent as Plus } from '../../images/plus.svg'
import { inputsActions } from './inputsReducer'

const JobsPanelDataInputsView = ({
  handleAddNewItem,
  handleDeleteItems,
  handleEditItems,
  inputsDispatch,
  inputsState,
  match,
  panelDispatch,
  panelState,
  selectOptions
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
    <div className="job-panel__item">
      <JobsPanelSection title="Data inputs">
        <JobsPanelTable
          addNewItem={inputsState.addNewInput}
          className="data-inputs"
          content={panelState.tableData.dataInputs}
          handleDeleteItems={handleDeleteItems}
          handleEditItems={handleEditItems}
          headers={panelData['data-inputs']['table-headers']}
          match={match}
          section="data-inputs"
          selectedItem={inputsState.selectedDataInput}
          setSelectedDataInput={selectedInput =>
            inputsDispatch({
              type: inputsActions.SET_SELECTED_INPUT,
              payload: selectedInput
            })
          }
        >
          {inputsState.addNewInput ? (
            <div className="table__row-add-item">
              <div className="input-row-wrapper">
                <Input
                  onChange={name =>
                    inputsDispatch({
                      type: inputsActions.SET_NEW_INPUT_NAME,
                      payload: name
                    })
                  }
                  label="Input name"
                  className="input-row__item"
                  floatingLabel
                  type="text"
                />
                <Input
                  onChange={path =>
                    inputsDispatch({
                      type: inputsActions.SET_NEW_INPUT_PATH,
                      payload: path
                    })
                  }
                  label="Input path"
                  className="input-row__item input-row__item_edit"
                  floatingLabel
                  type="text"
                />
              </div>
              <button
                className="add-input btn-add"
                onClick={() => handleAddNewItem(true)}
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
                  type: inputsActions.SET_ADD_NEW_INPUT,
                  payload: value
                })
              }
              text="input"
            />
          )}
        </JobsPanelTable>
      </JobsPanelSection>
      <JobsPanelSection title="Volumes">
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
      </JobsPanelSection>
      <JobsPanelSection title="General">
        <Input
          label="Default input path"
          className="default-input"
          onChange={inputValue => {
            panelDispatch({
              type: panelActions.SET_INPUT_PATH,
              payload: inputValue
            })
          }}
          floatingLabel
          type="text"
        />
        <Input
          label="Default artifact path"
          className="default-input"
          onChange={inputValue => {
            panelDispatch({
              type: panelActions.SET_OUTPUT_PATH,
              payload: inputValue
            })
          }}
          floatingLabel
          type="text"
        />
      </JobsPanelSection>
    </div>
  )
}

JobsPanelDataInputsView.propTypes = {
  handleAddNewItem: PropTypes.func.isRequired,
  handleDeleteItems: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  panelDispatch: PropTypes.func.isRequired,
  selectOptions: PropTypes.shape({}).isRequired
}

export default JobsPanelDataInputsView
