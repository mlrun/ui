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
  FUNCTION_CREATING_STATE,
  FUNCTION_ERROR_STATE,
  FUNCTION_FAILED_STATE,
  FUNCTION_INITIALIZED_STATE,
  FUNCTION_PENDINDG_STATE,
  FUNCTION_READY_STATE,
  FUNCTION_RUNNING_STATE,
  FUNCTION_TYPE_JOB,
  FUNCTION_TYPE_LOCAL,
  FUNCTION_TYPE_NUCLIO,
  FUNCTION_TYPE_REMOTE,
  FUNCTION_TYPE_SERVING,
  NAME_FILTER,
  SHOW_UNTAGGED_FILTER
} from '../../constants'

export const page = 'FUNCTIONS'
export const detailsMenu = [
  {
    id: 'overview',
    label: 'overview'
  },
  {
    id: 'code',
    label: 'code'
  },
  {
    id: 'build-log',
    label: 'build log'
  }
]
export const FUNCTIONS_FAILED_STATES = [FUNCTION_FAILED_STATE, FUNCTION_ERROR_STATE]
export const FUNCTIONS_READY_STATES = [FUNCTION_READY_STATE]
export const FUNCTIONS_EDITABLE_STATES = [
  FUNCTION_CREATING_STATE,
  FUNCTION_INITIALIZED_STATE,
  ...FUNCTIONS_READY_STATES,
  ...FUNCTIONS_FAILED_STATES
]
export const infoHeaders = [
  { label: 'Name', id: 'name' },
  { label: 'Kind', id: 'type' },
  { label: 'Hash', id: 'hash' },
  { label: 'Version tag', id: 'tag' },
  { label: 'Code origin', id: 'codeOrigin' },
  { label: 'Updated', id: 'updated' },
  { label: 'Command', id: 'command' },
  { label: 'Image', id: 'image' },
  { label: 'Description', id: 'description' }
]
export const filters = [
  { type: NAME_FILTER, label: 'Name:' },
  { type: SHOW_UNTAGGED_FILTER, label: 'Show untagged' }
]
export const TRANSIENT_FUNCTION_STATUSES = [FUNCTION_PENDINDG_STATE, FUNCTION_RUNNING_STATE]

export const getFunctionsEditableTypes = isStagingMode => {
  const editableTypes = [FUNCTION_TYPE_JOB, FUNCTION_TYPE_LOCAL, '']

  if (isStagingMode) {
    editableTypes.push(FUNCTION_TYPE_SERVING)
  }

  return editableTypes
}
export const getFunctionImage = func => {
  return func.type === FUNCTION_TYPE_NUCLIO ||
    func.type === FUNCTION_TYPE_SERVING ||
    func.type === FUNCTION_TYPE_REMOTE
    ? func.container_image
    : func.image
}
