import { isEveryObjectValueEmpty } from '../../utils/isEveryObjectValueEmpty'
import { handleStoreInputPathChange } from '../../components/JobsPanelDataInputs/jobsPanelDataInputs.util'
import { inputsActions } from '../../components/JobsPanelDataInputs/jobsPanelDataInputsReducer'
import {
  HTTP_STORAGE_INPUT_PATH_SCHEME,
  HTTPS_STORAGE_INPUT_PATH_SCHEME,
  MLRUN_STORAGE_INPUT_PATH_SCHEME
} from '../../constants'

export const applyEditButtonHandler = (
  handleEdit,
  inputName,
  inputsDispatch,
  requiredField,
  selectedDataInput,
  setRequiredField
) => {
  if (
    [
      HTTP_STORAGE_INPUT_PATH_SCHEME,
      HTTPS_STORAGE_INPUT_PATH_SCHEME,
      MLRUN_STORAGE_INPUT_PATH_SCHEME
    ].includes(selectedDataInput.data.path.pathType)
  ) {
    if (
      !selectedDataInput.data.path.value.split('/')[2] ||
      selectedDataInput.data.path.value.split('/')[2]?.length === 0
    ) {
      return setRequiredField(state => ({ ...state, path: true }))
    }
  } else if (selectedDataInput.data.path.url.length === 0) {
    return setRequiredField(state => ({ ...state, path: true }))
  }

  if (inputName.length === 0) {
    return setRequiredField(state => ({ ...state, name: true }))
  }

  if (!isEveryObjectValueEmpty(requiredField)) {
    setRequiredField({
      name: inputName.length > 0,
      path:
        selectedDataInput.data.path.value.split('/')[2]?.length > 0 ||
        selectedDataInput.data.path.url.length > 0
    })
  }

  inputsDispatch({
    type: inputsActions.SET_COMBOBOX_MATCHES,
    payload: []
  })
  handleEdit(selectedDataInput, true)
}

export const handleEditInputPath = (
  inputsDispatch,
  inputsState,
  path,
  selectedDataInput,
  setSelectedDataInput
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

  if (
    selectedDataInput.data.path.pathType === MLRUN_STORAGE_INPUT_PATH_SCHEME
  ) {
    handleStoreInputPathChange(false, inputsDispatch, inputsState, path)
  }
}
