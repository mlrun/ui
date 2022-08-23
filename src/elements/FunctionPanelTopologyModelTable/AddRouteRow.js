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

import { isNameNotUnique } from './functionPanelTopologyModelTable.util'

import { ReactComponent as Plus } from 'igz-controls/images/plus.svg'
import { ReactComponent as Delete } from 'igz-controls/images/delete.svg'

const AddRouteRow = ({
  addRoute,
  data,
  discardChanges,
  newRoute,
  setNewRoute,
  setValidation,
  validation
}) => {
  return (
    <div className="table__body">
      <div className="table__body-column">
        <div className="input-row-wrapper">
          <Input
            className="input-row__item"
            floatingLabel
            invalid={
              isNameNotUnique(newRoute.name, data) || !validation.isNameValid
            }
            invalidText={
              isNameNotUnique(newRoute.name, data)
                ? 'Name already exists'
                : 'This field is invalid'
            }
            label="Name"
            onChange={name => setNewRoute(state => ({ ...state, name }))}
            required
            requiredText="This field is required"
            setInvalid={value =>
              setValidation(state => ({
                ...state,
                isNameValid: value
              }))
            }
            type="text"
          />
          <Input
            className="input-row__item"
            floatingLabel
            invalid={!validation.isClassNameValid}
            label="Class"
            onChange={class_name =>
              setNewRoute(state => ({ ...state, class_name }))
            }
            required
            requiredText="This field is required"
            setInvalid={value =>
              setValidation(state => ({
                ...state,
                isClassNameValid: value
              }))
            }
            type="text"
          />
          <Input
            className="input-row__item"
            floatingLabel
            invalid={!validation.isModelPathValid}
            label="Path"
            onChange={model_path =>
              setNewRoute(state => ({ ...state, model_path }))
            }
            required
            requiredText="This field is required"
            setInvalid={value =>
              setValidation(state => ({
                ...state,
                isModelPathValid: value
              }))
            }
            type="text"
          />
        </div>
      </div>
      <button
        className="btn-add"
        disabled={isNameNotUnique(newRoute.name, data)}
        onClick={addRoute}
      >
        <Tooltip template={<TextTooltipTemplate text="Add item" />}>
          <Plus />
        </Tooltip>
      </button>
      <button onClick={discardChanges}>
        <Tooltip template={<TextTooltipTemplate text="Discard changes" />}>
          <Delete />
        </Tooltip>
      </button>
    </div>
  )
}

AddRouteRow.propTypes = {
  addRoute: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  discardChanges: PropTypes.func.isRequired,
  newRoute: PropTypes.shape({}).isRequired,
  setNewRoute: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.shape({}).isRequired
}

export default AddRouteRow
