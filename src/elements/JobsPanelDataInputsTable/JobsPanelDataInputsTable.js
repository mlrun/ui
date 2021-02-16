import React, { useCallback, useEffect, useRef } from 'react'
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

import { ReactComponent as Plus } from '../../images/plus.svg'

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
  match,
  panelState
}) => {
  const addItemRowRef = useRef(null)

  const handleDocumentClick = useCallback(
    event => {
      if (!addItemRowRef.current?.contains(event.target)) {
        handleAddNewItem(true)
        inputsDispatch({
          type: inputsActions.SET_PATH_PLACEHOLDER,
          payload: ''
        })
      }
    },
    [handleAddNewItem, inputsDispatch]
  )

  useEffect(() => {
    if (addItemRowRef.current) {
      document.addEventListener('click', handleDocumentClick)

      return () => {
        document.removeEventListener('click', handleDocumentClick)
      }
    }
  }, [handleDocumentClick, addItemRowRef])

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
          <div className="input-row-wrapper" ref={addItemRowRef}>
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
            <Combobox
              comboboxClassName="input-row__item"
              inputPlaceholder={inputsState.pathPlaceholder}
              matches={comboboxMatchesList}
              inputDefaultValue={
                inputsState.newInput.path.pathType ===
                  MLRUN_STORAGE_INPUT_PATH_SCHEME &&
                inputsState.newInput.path.project.length === 0
                  ? inputsState.newInputDefaultPathProject
                  : ''
              }
              inputOnChange={path => {
                handlePathChange(path)
              }}
              selectDropdownList={comboboxSelectList}
              selectOnChange={path => {
                handlePathTypeChange(path)
              }}
              selectPlaceholder="Path Scheme"
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
  )
}

JobsPanelDataInputsTable.propTypes = {
  comboboxMatchesList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  comboboxSelectList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  handleAddNewItem: PropTypes.func.isRequired,
  handleEditItems: PropTypes.func.isRequired,
  handleDeleteItems: PropTypes.func.isRequired,
  handlePathChange: PropTypes.func.isRequired,
  handlePathTypeChange: PropTypes.func.isRequired,
  inputsDispatch: PropTypes.func.isRequired,
  inputsState: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  panelState: PropTypes.shape({}).isRequired
}
