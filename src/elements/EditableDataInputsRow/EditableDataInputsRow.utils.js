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
  setIsPathValid
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

  setIsPathValid(isPathInputValid(selectedDataInput.data.path.pathType, path))
}
