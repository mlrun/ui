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
import { useParams } from 'react-router-dom'

import Input from '../../common/Input/Input'
import Select from '../../common/Select/Select'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import {
  isNameNotUnique,
  secretKeyValidationTip,
  secretNameValidationTip,
  selectTypeOptions
} from './environmentVariables.util'
import { ENV_VARIABLE_TYPE_SECRET } from '../../constants'
import { getValidationRules } from 'igz-controls/utils/validation.util'
import { getSecretNameValidator } from '../../utils/getSecretNameValidator'

import Delete from 'igz-controls/images/delete.svg?react'
import Plus from 'igz-controls/images/plus.svg?react'

const AddEnvironmentVariablesRow = ({
  addEnvVariable,
  discardChanges,
  envVariables,
  newEnvVariable,
  setNewEnvVariable,
  setValidation,
  validation
}) => {
  const { projectName } = useParams()

  return (
    <div className="table__body">
      <div className="table__body-column">
        <div className="input-row-wrapper">
          <Input
            className="input-row__item"
            floatingLabel
            invalid={isNameNotUnique(newEnvVariable.name, envVariables) || !validation.isNameValid}
            invalidText={
              isNameNotUnique(newEnvVariable.name, envVariables)
                ? 'Name already exists'
                : 'This field is invalid'
            }
            label="Name"
            onChange={name => setNewEnvVariable(state => ({ ...state, name }))}
            required
            setInvalid={value =>
              setValidation(state => ({
                ...state,
                isNameValid: value
              }))
            }
          />
          <Select
            onClick={type => {
              setNewEnvVariable(state => ({
                ...state,
                type,
                value: '',
                secretName: '',
                secretKey: ''
              }))
              setValidation(prevState => ({
                ...prevState,
                isNameValid: true,
                isValueValid: true,
                isSecretKeyValid: true,
                isSecretNameValid: true
              }))
            }}
            options={selectTypeOptions}
            selectedId={newEnvVariable.type}
          />
          {newEnvVariable.type === ENV_VARIABLE_TYPE_SECRET ? (
            <div className="input-row__item-secret">
              <Input
                className="secret-item"
                floatingLabel
                invalid={!validation.isSecretNameValid}
                label="Secret name"
                onChange={secretName => setNewEnvVariable(state => ({ ...state, secretName }))}
                pattern="^(?=[\S\s]{1,253}$)[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]{0,61}[a-z0-9])?)*$"
                validationRules={getValidationRules('environmentVariables.secretName', [
                  getSecretNameValidator(projectName)
                ])}
                required
                setInvalid={value =>
                  setValidation(state => ({
                    ...state,
                    isSecretNameValid: value
                  }))
                }
                tip={secretNameValidationTip}
              />
              <Input
                className="secret-item"
                floatingLabel
                invalid={!validation.isSecretKeyValid}
                label="Secret key"
                onChange={secretKey => setNewEnvVariable(state => ({ ...state, secretKey }))}
                pattern="^(?=[\S\s]{0,253}$)(?!\.$)(?!\.\.[\S\s]*$)[-._a-zA-Z0-9]*$"
                setInvalid={value =>
                  setValidation(state => ({
                    ...state,
                    isSecretKeyValid: value
                  }))
                }
                tip={secretKeyValidationTip}
              />
            </div>
          ) : (
            <Input
              className="input-row__item"
              floatingLabel
              invalid={!validation.isValueValid}
              label="Value"
              onChange={value => setNewEnvVariable(state => ({ ...state, value }))}
              required
              setInvalid={value =>
                setValidation(state => ({
                  ...state,
                  isValueValid: value
                }))
              }
            />
          )}
        </div>
      </div>
      <button
        className="variables-table__btn btn-add"
        disabled={isNameNotUnique(newEnvVariable.name, envVariables)}
        onClick={addEnvVariable}
      >
        <Tooltip template={<TextTooltipTemplate text="Add item" />}>
          <Plus />
        </Tooltip>
      </button>
      <button onClick={discardChanges} className="variables-table__btn">
        <Tooltip template={<TextTooltipTemplate text="Discard changes" />}>
          <Delete />
        </Tooltip>
      </button>
    </div>
  )
}

AddEnvironmentVariablesRow.propTypes = {
  addEnvVariable: PropTypes.func.isRequired,
  discardChanges: PropTypes.func.isRequired,
  envVariables: PropTypes.arrayOf(PropTypes.object).isRequired,
  newEnvVariable: PropTypes.object.isRequired,
  setNewEnvVariable: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.object.isRequired
}

export default AddEnvironmentVariablesRow
