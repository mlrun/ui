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

import {
  DETAILS_BUILD_LOG_TAB,
  FUNCTION_CREATING_STATE,
  FUNCTION_ERROR_STATE,
  FUNCTION_FAILED_STATE,
  FUNCTION_INITIALIZED_STATE,
  FUNCTION_PENDINDG_STATE,
  FUNCTION_READY_STATE,
  FUNCTION_RUN_KINDS,
  FUNCTION_RUNNING_STATE,
  FUNCTION_TYPE_JOB,
  FUNCTION_TYPE_LOCAL,
  FUNCTION_TYPE_NUCLIO,
  FUNCTION_TYPE_REMOTE,
  FUNCTION_TYPE_SERVING,
  NAME_FILTER,
  PANEL_FUNCTION_CREATE_MODE,
  SHOW_UNTAGGED_FILTER
} from '../../constants'
import jobsActions from '../../actions/jobs'
import { showErrorNotification } from '../../utils/notifications.util'

import { ReactComponent as Delete } from 'igz-controls/images/delete.svg'
import { ReactComponent as Run } from 'igz-controls/images/run.svg'
import { ReactComponent as Edit } from 'igz-controls/images/edit.svg'
import { ReactComponent as Yaml } from 'igz-controls/images/yaml.svg'
import { ReactComponent as DeployIcon } from 'igz-controls/images/deploy-icon.svg'

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
    id: DETAILS_BUILD_LOG_TAB,
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
  { label: 'Code Entry Point', id: 'command' },
  { label: 'Default handler', id: 'defaultHandler' },
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

export const generateActionsMenu = (
  dispatch,
  func,
  isDemoMode,
  isStagingMode,
  setJobWizardMode,
  setFunctionsPanelIsOpen,
  setEditableItem,
  onRemoveFunction,
  toggleConvertedYaml,
  buildAndRunFunc
) => {
  return [
    [
      {
        id: 'run',
        label: 'Run',
        icon: <Run />,
        onClick: func => {
          if (func?.project && func?.name && func?.hash && func?.ui?.originalContent) {
            dispatch(jobsActions.fetchJobFunctionSuccess(func.ui.originalContent))
            setJobWizardMode(PANEL_FUNCTION_CREATE_MODE)
          } else {
            showErrorNotification(dispatch, {}, '', 'Failed to retrieve function data')
          }
        },
        hidden:
          !FUNCTION_RUN_KINDS.includes(func?.type) ||
          !FUNCTIONS_READY_STATES.includes(func?.state?.value)
      },
      {
        label: 'Edit',
        icon: <Edit />,
        onClick: func => {
          setFunctionsPanelIsOpen(true)
          setEditableItem(func)
        },
        hidden:
          !isDemoMode ||
          !getFunctionsEditableTypes(isStagingMode).includes(func?.type) ||
          !FUNCTIONS_EDITABLE_STATES.includes(func?.state?.value)
      },
      {
        label: 'Delete',
        icon: <Delete />,
        className: 'danger',
        onClick: onRemoveFunction
      },
      {
        label: 'View YAML',
        icon: <Yaml />,
        onClick: toggleConvertedYaml
      }
    ],
    [
      {
        id: 'build-and-run',
        label: 'Build and run',
        icon: <DeployIcon />,
        onClick: func => {
          buildAndRunFunc(func)
        },
        hidden:
          func?.type !== FUNCTION_TYPE_JOB ||
          (func?.type === FUNCTION_TYPE_JOB && func?.state?.value !== FUNCTION_INITIALIZED_STATE)
      },
      {
        id: 'deploy',
        label: 'Deploy',
        icon: <DeployIcon />,
        onClick: func => {
          setFunctionsPanelIsOpen(true)
          setEditableItem(func)
        },
        hidden: func?.type !== FUNCTION_TYPE_SERVING
      }
    ]
  ]
}
