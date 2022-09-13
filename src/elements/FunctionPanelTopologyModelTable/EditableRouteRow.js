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

import Input from '../../common/Input/Input'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import {
  isEditableRouteValid,
  isNameNotUnique
} from './functionPanelTopologyModelTable.util'

import { ReactComponent as Checkmark } from 'igz-controls/images/checkmark.svg'

const EditableRouteRow = ({
  editRoute,
  routes,
  selectedRoute,
  setSelectedRoute,
  setValidation,
  validation
}) => {
  return (
    <div className="table__row edit-row">
      <div className="table__cell">
        <Input
          floatingLabel
          invalid={
            (selectedRoute.newName !== selectedRoute.data.name &&
              isNameNotUnique(selectedRoute.newName, routes)) ||
            !validation.isEditNameValid
          }
          invalidText={
            isNameNotUnique(selectedRoute.newName, routes)
              ? 'Name already exists'
              : 'This field is invalid'
          }
          label="Name"
          onChange={name =>
            setSelectedRoute({
              ...selectedRoute,
              newName: name
            })
          }
          required
          requiredText="This field is required"
          setInvalid={value =>
            setValidation(state => ({
              ...state,
              isEditNameValid: value
            }))
          }
          type="text"
          value={selectedRoute.newName ?? selectedRoute.data.name}
        />
      </div>
      <div className="table__cell">
        <Input
          floatingLabel
          invalid={!validation.isEditClassNameValid}
          label="Class"
          onChange={class_name =>
            setSelectedRoute({
              ...selectedRoute,
              data: {
                ...selectedRoute.data,
                class_name
              }
            })
          }
          required
          requiredText="This field is required"
          setInvalid={value =>
            setValidation(state => ({
              ...state,
              isEditClassNameValid: value
            }))
          }
          type="text"
          value={selectedRoute.data.class_name}
        />
      </div>
      <div className="table__cell">
        <Input
          floatingLabel
          invalid={!validation.isEditModelPathValid}
          label="Path"
          onChange={model_path =>
            setSelectedRoute({
              ...selectedRoute,
              data: {
                ...selectedRoute.data,
                model_path
              }
            })
          }
          required
          requiredText="This field is required"
          setInvalid={value =>
            setValidation(state => ({
              ...state,
              isEditModelPathValid: value
            }))
          }
          type="text"
          value={selectedRoute.data.model_path}
        />
      </div>
      <div className="table__cell-actions">
        <button
          className="apply-edit-btn"
          disabled={!isEditableRouteValid(selectedRoute, routes)}
          onClick={editRoute}
        >
          <Tooltip template={<TextTooltipTemplate text="Apply" />}>
            <Checkmark />
          </Tooltip>
        </button>
      </div>
    </div>
  )
}

EditableRouteRow.propTypes = {
  editRoute: PropTypes.func.isRequired,
  routes: PropTypes.array.isRequired,
  selectedRoute: PropTypes.shape({}).isRequired,
  setSelectedRoute: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.shape({}).isRequired
}

export default EditableRouteRow
