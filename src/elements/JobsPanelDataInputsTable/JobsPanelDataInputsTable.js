/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import React from 'react'
import PropTypes from 'prop-types'

import Combobox from '../../common/Combobox/Combobox'
import Input from '../../common/Input/Input'
import JobsPanelTable from '../JobsPanelTable/JobsPanelTable'
import JobsPanelTableAddItemRow from '../JobsPanelTableAddItemRow/JobsPanelTableAddItemRow'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import panelData from '../../components/JobsPanel/panelData'
import { inputsActions } from '../../components/JobsPanelDataInputs/jobsPanelDataInputsReducer'
import { MLRUN_STORAGE_INPUT_PATH_SCHEME } from '../../constants'
import { COMBOBOX_MATCHES } from '../../types'
import { isNameNotUnique } from '../../components/JobsPanel/jobsPanel.util'
import {
  isPathInputValid,
  pathTips
} from '../../components/JobsPanelDataInputs/jobsPanelDataInputs.util'

import { ReactComponent as Plus } from 'igz-controls/images/plus.svg'
import { ReactComponent as Delete } from 'igz-controls/images/delete.svg'

export const JobsPanelDataInputsTable = ({
  comboboxMatchesList,
  comboboxSelectList,
  handleAddNewItem,
  handleEditItems,
  handleDeleteItems,
  handlePathChange,
  handlePathTypeChange,
  inputsDispatch,
  inputsState,
  panelState,
  resetDataInputsData,
  setValidation,
  validation
}) => {
  return (
    <JobsPanelTable
      addNewItem={inputsState.addNewInput}
      className="data-inputs"
      content={panelState.tableData.dataInputs}
      handleDeleteItems={handleDeleteItems}
      handleEditItems={handleEditItems}
      headers={panelData['data-inputs']['table-headers']}
      section="data-inputs"
      sectionData={{ comboboxMatchesList }}
      sectionDispatch={inputsDispatch}
      sectionState={inputsState}
      selectedItem={inputsState.selectedDataInput}
      setSelectedItem={selectedInput => {
        inputsDispatch({
          type: inputsActions.SET_SELECTED_INPUT,
          payload: selectedInput
        })
      }}
    >
      {inputsState.addNewInput && !panelState.editMode ? (
        <div className="table__row-add-item">
          <div className="input-row-wrapper">
            <Input
              className="input-row__item"
              density="medium"
              floatingLabel
              invalid={
                !validation.isNameValid ||
                isNameNotUnique(
                  inputsState.newInput.name,
                  panelState.tableData.dataInputs
                )
              }
              invalidText="Name already exists"
              label="Input name"
              onChange={name =>
                inputsDispatch({
                  type: inputsActions.SET_NEW_INPUT_NAME,
                  payload: name
                })
              }
              required
              setInvalid={value =>
                setValidation(state => ({
                  ...state,
                  isNameValid: value
                }))
              }
              type="text"
            />
            <Combobox
              comboboxClassName="input-row__item"
              hideSearchInput={!inputsState.inputStorePathTypeEntered}
              inputDefaultValue=""
              inputOnChange={path => {
                handlePathChange(path)
              }}
              inputPlaceholder={inputsState.pathPlaceholder}
              invalid={!validation.isPathValid}
              invalidText={`Field must be in "${
                pathTips[inputsState.newInput.path.pathType]
              }" format`}
              matches={comboboxMatchesList}
              maxSuggestedMatches={
                inputsState.newInput.path.pathType ===
                MLRUN_STORAGE_INPUT_PATH_SCHEME
                  ? 3
                  : 2
              }
              onBlur={(selectValue, inputValue) => {
                setValidation(prevState => ({
                  ...prevState,
                  isPathValid: isPathInputValid(selectValue, inputValue)
                }))
              }}
              required
              requiredText="This field is required"
              selectDropdownList={comboboxSelectList}
              selectOnChange={path => {
                handlePathTypeChange(path)
              }}
              selectPlaceholder="Path Scheme"
            />
          </div>
          <button
            className="btn-add"
            disabled={
              isNameNotUnique(
                inputsState.newInput.name,
                panelState.tableData.dataInputs
              ) ||
              !validation.isNameValid ||
              !validation.isPathValid
            }
            onClick={() => handleAddNewItem(true)}
          >
            <Tooltip template={<TextTooltipTemplate text="Add item" />}>
              <Plus />
            </Tooltip>
          </button>
          <button
            onClick={() => resetDataInputsData(inputsDispatch, setValidation)}
          >
            <Tooltip template={<TextTooltipTemplate text="Discard changes" />}>
              <Delete />
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
          isPanelEditMode={panelState.editMode}
        />
      )}
    </JobsPanelTable>
  )
}

JobsPanelDataInputsTable.propTypes = {
  comboboxMatchesList: COMBOBOX_MATCHES.isRequired,
  comboboxSelectList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleAddNewItem: PropTypes.func.isRequired,
  handleEditItems: PropTypes.func.isRequired,
  handleDeleteItems: PropTypes.func.isRequired,
  handlePathChange: PropTypes.func.isRequired,
  handlePathTypeChange: PropTypes.func.isRequired,
  inputsDispatch: PropTypes.func.isRequired,
  inputsState: PropTypes.shape({}).isRequired,
  panelState: PropTypes.shape({}).isRequired,
  resetDataInputsData: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.object.isRequired
}
