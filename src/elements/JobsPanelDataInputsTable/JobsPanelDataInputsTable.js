import React from 'react'
import PropTypes from 'prop-types'

import Input from '../../common/Input/Input'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'
import JobsPanelTableAddItemRow from '../JobsPanelTableAddItemRow/JobsPanelTableAddItemRow'
import JobsPanelTable from '../JobsPanelTable/JobsPanelTable'
import Combobox from '../../common/Combobox/Combobox'

import panelData from '../../components/JobsPanel/panelData'
import { inputsActions } from '../../components/JobsPanelDataInputs/jobsPanelDataInputsReducer'
import { MLRUN_STORAGE_INPUT_PATH_SCHEME } from '../../constants'
import { COMBOBOX_MATCHES } from '../../types'
import { isNameNotUnique } from '../../components/JobsPanel/jobsPanel.util'
import { pathTips } from '../../components/JobsPanelDataInputs/jobsPanelDataInputs.util'

import { ReactComponent as Plus } from '../../images/plus.svg'
import { ReactComponent as Delete } from '../../images/delete.svg'

export const JobsPanelDataInputsTable = ({
  comboboxMatchesList,
  comboboxSelectList,
  dataInputsValidations,
  handleAddNewItem,
  handleEditItems,
  handleDeleteItems,
  handlePathChange,
  handlePathOnBlur,
  handlePathTypeChange,
  inputsDispatch,
  inputsState,
  match,
  panelState,
  resetDataInputsData,
  setDataInputsValidations
}) => {
  return (
    <JobsPanelTable
      addNewItem={inputsState.addNewInput}
      className="data-inputs"
      content={panelState.tableData.dataInputs}
      handleDeleteItems={handleDeleteItems}
      handleEditItems={handleEditItems}
      headers={panelData['data-inputs']['table-headers']}
      match={match}
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
      {inputsState.addNewInput ? (
        <div className="table__row-add-item">
          <div className="input-row-wrapper">
            <Input
              className="input-row__item"
              density="medium"
              floatingLabel
              invalid={
                !dataInputsValidations.isNameValid ||
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
              type="text"
              required
              requiredText="This field is required"
              setInvalid={value =>
                setDataInputsValidations(state => ({
                  ...state,
                  isNameValid: value
                }))
              }
            />
            <Combobox
              comboboxClassName="input-row__item"
              hideSearchInput={!inputsState.inputStorePathTypeEntered}
              inputDefaultValue=""
              inputOnChange={path => {
                handlePathChange(path)
              }}
              inputPlaceholder={inputsState.pathPlaceholder}
              invalid={!dataInputsValidations.isPathValid}
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
              selectDropdownList={comboboxSelectList}
              selectOnChange={path => {
                handlePathTypeChange(path)
              }}
              selectPlaceholder="Path Scheme"
              onBlur={handlePathOnBlur}
              required
              requiredText="This field is required"
            />
          </div>
          <button
            className="btn-add"
            disabled={isNameNotUnique(
              inputsState.newInput.name,
              panelState.tableData.dataInputs
            )}
            onClick={() => handleAddNewItem(true)}
          >
            <Tooltip template={<TextTooltipTemplate text="Add item" />}>
              <Plus />
            </Tooltip>
          </button>
          <button onClick={resetDataInputsData}>
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
        />
      )}
    </JobsPanelTable>
  )
}

JobsPanelDataInputsTable.propTypes = {
  comboboxMatchesList: COMBOBOX_MATCHES.isRequired,
  comboboxSelectList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  dataInputsValidations: PropTypes.object.isRequired,
  handleAddNewItem: PropTypes.func.isRequired,
  handleEditItems: PropTypes.func.isRequired,
  handleDeleteItems: PropTypes.func.isRequired,
  handlePathChange: PropTypes.func.isRequired,
  handlePathOnBlur: PropTypes.func.isRequired,
  handlePathTypeChange: PropTypes.func.isRequired,
  inputsDispatch: PropTypes.func.isRequired,
  inputsState: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  panelState: PropTypes.shape({}).isRequired,
  resetDataInputsData: PropTypes.func.isRequired
}
