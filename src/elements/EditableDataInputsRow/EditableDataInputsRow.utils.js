import {
  handleStoreInputPathChange,
  isPathInputValid
} from '../../components/JobsPanelDataInputs/jobsPanelDataInputs.util'
import { inputsActions } from '../../components/JobsPanelDataInputs/jobsPanelDataInputsReducer'
import { MLRUN_STORAGE_INPUT_PATH_SCHEME } from '../../constants'

export const applyEditButtonHandler = (
  handleEdit,
  index,
  inputName,
  inputsDispatch,
  requiredField,
  selectedDataInput,
  setRequiredField
) => {
  if (
    !isPathInputValid(
      selectedDataInput.data.path.pathType,
      selectedDataInput.data.path.value
    )
  ) {
    return setRequiredField(state => ({ ...state, path: true }))
  }

  if (inputName.length === 0) {
    return setRequiredField(state => ({ ...state, name: true }))
  }

  inputsDispatch({
    type: inputsActions.SET_COMBOBOX_MATCHES,
    payload: []
  })
  handleEdit(selectedDataInput, index)
}

export const handleEditInputPath = (
  inputsDispatch,
  inputsState,
  path,
  selectedDataInput,
  setSelectedDataInput,
  setValidation
) => {
  if (path !== selectedDataInput.data.path.value) {
    setSelectedDataInput({
      ...selectedDataInput,
      data: {
        ...selectedDataInput.data,
        path: {
          ...selectedDataInput.data.path,
          value: path,
          url: ''
        }
      }
    })
  }

  setValidation(state => ({
    ...state,
    isPathValid: isPathInputValid(selectedDataInput.data.path.pathType, path)
  }))

  if (
    selectedDataInput.data.path.pathType === MLRUN_STORAGE_INPUT_PATH_SCHEME
  ) {
    handleStoreInputPathChange(false, inputsDispatch, inputsState, path)
  }
}
