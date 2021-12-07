import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Input from '../../common/Input/Input'
import Combobox from '../../common/Combobox/Combobox'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../TooltipTemplate/TextTooltipTemplate'

import {
  comboboxSelectList,
  pathTips
} from '../../components/JobsPanelDataInputs/jobsPanelDataInputs.util'
import { inputsActions } from '../../components/JobsPanelDataInputs/jobsPanelDataInputsReducer'
import { MLRUN_STORAGE_INPUT_PATH_SCHEME } from '../../constants'
import {
  applyEditButtonHandler,
  handleEditInputPath
} from './EditableDataInputsRow.utils'
import { isNameNotUnique } from '../../components/JobsPanel/jobsPanel.util'
import { pathPlaceholders } from '../../utils/panelPathScheme'

import { ReactComponent as Checkmark } from '../../images/checkmark.svg'

const EditableDataInputsRow = ({
  comboboxMatchesList,
  content,
  handleEdit,
  index,
  inputsDispatch,
  inputsState,
  selectedDataInput,
  setEditItem,
  setSelectedDataInput
}) => {
  const [selectDefaultValue, setSelectDefaultValue] = useState({
    className: '',
    id: '',
    label: ''
  })
  const [inputName, setInputName] = useState(selectedDataInput.data.name)
  const [isPathValid, setIsPathValid] = useState(true)
  const [requiredField, setRequiredField] = useState({
    path: false,
    name: false
  })
  const tableRowRef = useRef(null)

  const comboboxClassNames = classNames(
    'input-row__item',
    requiredField.path && 'required'
  )
  const inputNameClassNames = classNames(
    'input',
    requiredField.name && 'input_required'
  )

  useEffect(() => {
    if (selectDefaultValue.label?.length === 0) {
      setSelectDefaultValue({
        id: selectedDataInput.data.path.pathType,
        label: selectedDataInput.data.path.pathType,
        className: `path-type-${selectedDataInput.data.path.pathType?.replace(
          /:\/\/.*$/g,
          ''
        )}`
      })
    }
  }, [selectDefaultValue.label, selectedDataInput.data.path.pathType])

  const handleDocumentClick = useCallback(
    event => {
      if (!tableRowRef.current?.contains(event.target)) {
        inputsDispatch({
          type: inputsActions.SET_PATH_PLACEHOLDER,
          payload: ''
        })
        inputsDispatch({
          type: inputsActions.SET_SELECTED_INPUT,
          payload: {
            data: {
              name: '',
              path: {
                pathType: '',
                value: '',
                url: ''
              }
            }
          }
        })
        inputsDispatch({
          type: inputsActions.SET_COMBOBOX_MATCHES,
          payload: []
        })
        setEditItem(false)
      }
    },
    [inputsDispatch, setEditItem]
  )

  useEffect(() => {
    if (tableRowRef.current) {
      document.addEventListener('click', handleDocumentClick)

      return () => {
        document.removeEventListener('click', handleDocumentClick)
      }
    }
  }, [handleDocumentClick, tableRowRef])

  const selectOnChangeComboboxHandler = path => {
    inputsDispatch({
      type: inputsActions.SET_PATH_PLACEHOLDER,
      payload: pathPlaceholders[path] || ''
    })
    setSelectedDataInput({
      ...selectedDataInput,
      data: {
        ...selectedDataInput.data,
        path: {
          ...selectedDataInput.data.path,
          pathType: path
        }
      }
    })
  }

  return (
    <div className="table__row edit-row" ref={tableRowRef}>
      {selectedDataInput.isDefault ? (
        <div className="table__cell table__cell_disabled">
          <div className="data-ellipsis">{selectedDataInput.data.name}</div>
        </div>
      ) : (
        <div className="table__cell table__cell_edit">
          <Input
            className={inputNameClassNames}
            density="dense"
            invalid={
              inputName !== selectedDataInput.data.name &&
              isNameNotUnique(inputName, content)
            }
            invalidText="Name already exists"
            onChange={name => {
              setInputName(name)
              setSelectedDataInput({
                ...selectedDataInput,
                data: {
                  ...selectedDataInput.data,
                  newDataInputName: name
                }
              })
            }}
            required
            requiredText="This field is required"
            type="text"
            value={inputName}
          />
        </div>
      )}
      <div className="table__cell table__cell_edit">
        <Combobox
          comboboxClassName={comboboxClassNames}
          inputPlaceholder={inputsState.pathPlaceholder}
          invalid={!isPathValid}
          invalidText={`Field must be in "${
            pathTips[selectedDataInput.data.path.pathType]
          }" format`}
          matches={comboboxMatchesList}
          maxSuggestedMatches={
            inputsState.selectedDataInput.data.path.pathType ===
            MLRUN_STORAGE_INPUT_PATH_SCHEME
              ? 3
              : 2
          }
          inputDefaultValue={selectedDataInput.data.path.value}
          inputOnChange={path => {
            handleEditInputPath(
              inputsDispatch,
              inputsState,
              path,
              selectedDataInput,
              setSelectedDataInput,
              setIsPathValid
            )
          }}
          hideSearchInput={!inputsState.inputStorePathTypeEntered}
          required
          requiredText="This field is required"
          selectDefaultValue={selectDefaultValue}
          selectDropdownList={comboboxSelectList}
          selectOnChange={path => selectOnChangeComboboxHandler(path)}
        />
      </div>
      <div className="table__cell table__cell-actions">
        <button
          className="apply-edit-btn"
          disabled={
            inputName !== selectedDataInput.data.name &&
            isNameNotUnique(inputName, content)
          }
          onClick={() => {
            applyEditButtonHandler(
              handleEdit,
              index,
              inputName,
              inputsDispatch,
              requiredField,
              selectedDataInput,
              setRequiredField
            )
          }}
        >
          <Tooltip template={<TextTooltipTemplate text="Apply" />}>
            <Checkmark />
          </Tooltip>
        </button>
      </div>
    </div>
  )
}

EditableDataInputsRow.propTypes = {
  comboboxMatchesList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  content: PropTypes.array.isRequired,
  handleEdit: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  inputsDispatch: PropTypes.func.isRequired,
  inputsState: PropTypes.shape({}).isRequired,
  selectedDataInput: PropTypes.shape({}).isRequired,
  setEditItem: PropTypes.func.isRequired,
  setSelectedDataInput: PropTypes.func.isRequired
}

export default EditableDataInputsRow
