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
import classnames from 'classnames'

import Input from '../../common/Input/Input'
import JobsPanelParametersTable from '../../elements/JobsPanelParametersTable/JobsPanelParametersTable'
import JobsPanelTableAddItemRow from '../../elements/JobsPanelTableAddItemRow/JobsPanelTableAddItemRow'
import PanelSection from '../../elements/PanelSection/PanelSection'
import Select from '../../common/Select/Select'
import { Tooltip, TextTooltipTemplate } from 'igz-controls/components'

import panelData from '../JobsPanel/panelData'
import { parametersActions } from './jobsPanelParametersReducer'
import { selectOptions } from './jobsPanelParameters.util'
import { isNameNotUnique } from '../JobsPanel/jobsPanel.util'
import { SELECT_OPTIONS } from '../../types'

import { ReactComponent as Plus } from 'igz-controls/images/plus.svg'
import { ReactComponent as Delete } from 'igz-controls/images/delete.svg'

const JobsPanelParametersView = ({
  checkParameter,
  handleAddNewItem,
  handleDeleteParameter,
  handleEditParameter,
  isHyperTypeExist,
  isPanelEditMode,
  parameterTypeOptions,
  parameters,
  parametersDispatch,
  parametersState,
  selectorCriteria,
  setNewJobSelectorCriteria,
  setNewJobSelectorResult,
  setTuningStrategy,
  setUrl,
  setValidation,
  tableContent,
  tuningStrategy,
  undoParameterCreation,
  url,
  validation
}) => {
  const urlTypeClassName = classnames(
    'parameters-additional-settings__input-wrapper',
    isHyperTypeExist && 'disabled'
  )
  const tuningStrategyClassName = classnames(
    'parameters-additional-settings__select-wrapper',
    !isHyperTypeExist && !url && 'disabled'
  )
  const nameIsNotUnique = isNameNotUnique(parametersState.newParameter.name, parameters)

  return (
    <div className="job-panel__item new-item-side-panel__item">
      <PanelSection title="Parameters">
        <JobsPanelParametersTable
          addNewItem={parametersState.addNewParameter}
          checkParameter={checkParameter}
          content={parameters}
          handleDeleteParameter={handleDeleteParameter}
          handleEditParameter={handleEditParameter}
          headers={panelData.parameters['table-headers']}
          isPanelEditMode={isPanelEditMode}
          parameterTypeOptions={parameterTypeOptions}
          selectedItem={parametersState.selectedParameter}
          setSelectedItem={selectedParam =>
            parametersDispatch({
              type: parametersActions.SET_SELECTED_PARAMETER,
              payload: selectedParam
            })
          }
          tableContent={tableContent}
        >
          {parametersState.addNewParameter && !isPanelEditMode ? (
            <div className="table__row-add-item">
              <div className="input-row-wrapper">
                <Input
                  className="input-row__item"
                  density="chunky"
                  floatingLabel
                  invalid={nameIsNotUnique || !validation.isNameValid}
                  invalidText={nameIsNotUnique ? 'Name already exists' : 'This field is invalid'}
                  label="Name"
                  onChange={value =>
                    parametersDispatch({
                      type: parametersActions.SET_NEW_PARAMETER_NAME,
                      payload: value
                    })
                  }
                  setInvalid={value =>
                    setValidation(state => ({
                      ...state,
                      isNameValid: value
                    }))
                  }
                  type="text"
                  required
                />
                <Select
                  className="parameters-value-type"
                  density="chunky"
                  label={parametersState.newParameter.valueType}
                  onClick={value =>
                    parametersDispatch({
                      type: parametersActions.SET_NEW_PARAMETER_VALUE_TYPE,
                      payload: value
                    })
                  }
                  options={selectOptions.parametersValueType}
                />
                <Select
                  className="select-parameters-type"
                  density="chunky"
                  label={parametersState.newParameter.parameterType}
                  onClick={value =>
                    parametersDispatch({
                      type: parametersActions.SET_NEW_PARAMETER_TYPE,
                      payload: value
                    })
                  }
                  options={parameterTypeOptions}
                />
                <Input
                  className="input-row__item parameter-value"
                  density="chunky"
                  floatingLabel
                  invalid={!validation.isValueValid}
                  label="Value/s"
                  onChange={value =>
                    parametersDispatch({
                      type: parametersActions.SET_NEW_PARAMETER_VALUE,
                      payload: value
                    })
                  }
                  required
                  setInvalid={value =>
                    setValidation(state => ({
                      ...state,
                      isValueValid: value
                    }))
                  }
                  type="text"
                />
              </div>
              <div className="table__cell-actions">
                <button
                  className="btn-add"
                  disabled={nameIsNotUnique || !validation.isNameValid || !validation.isValueValid}
                  onClick={() => handleAddNewItem()}
                >
                  <Tooltip template={<TextTooltipTemplate text="Add item" />}>
                    <Plus />
                  </Tooltip>
                </button>
                <button onClick={undoParameterCreation}>
                  <Tooltip template={<TextTooltipTemplate text="Delete" />}>
                    <Delete />
                  </Tooltip>
                </button>
              </div>
            </div>
          ) : (
            <JobsPanelTableAddItemRow
              isPanelEditMode={isPanelEditMode}
              onClick={value => {
                parametersDispatch({
                  type: parametersActions.SET_ADD_NEW_PARAMETER,
                  payload: value
                })
              }}
              text="custom parameter"
            />
          )}
        </JobsPanelParametersTable>
        <div className="parameters-additional-settings-container">
          <div className="parameters-additional-settings__header">
            <span className="parameters-additional-settings__header-text">Hyper Parameters</span>
          </div>
          <div className="parameters-additional-settings">
            <div className={urlTypeClassName}>
              <Input
                density="chunky"
                disabled={isPanelEditMode}
                floatingLabel
                label="Read hyper params from a file"
                onChange={setUrl}
                placeholder="v3io:///projects/my-proj/param.txt"
                type="text"
                wrapperClassName="default-input-wrapper"
              />
            </div>
            <div className={tuningStrategyClassName}>
              <Select
                density="chunky"
                disabled={isPanelEditMode}
                label="Tuning Strategy:"
                onClick={setTuningStrategy}
                options={selectOptions.hyperStrategyType}
                selectedId={tuningStrategy}
              />
            </div>
          </div>
          <div className="parameters-additional-settings">
            <div className="parameters-additional-settings__input-wrapper">
              <Input
                density="chunky"
                disabled={isPanelEditMode}
                floatingLabel
                label="Result"
                onChange={setNewJobSelectorResult}
                type="text"
                wrapperClassName="default-input-wrapper"
              />
            </div>
            <div className="parameters-additional-settings__select-wrapper">
              <Select
                density="chunky"
                disabled={isPanelEditMode}
                label="Criteria:"
                onClick={setNewJobSelectorCriteria}
                options={selectOptions.selectorCriteria}
                selectedId={selectorCriteria}
              />
            </div>
          </div>
        </div>
      </PanelSection>
    </div>
  )
}

JobsPanelParametersView.propTypes = {
  checkParameter: PropTypes.func.isRequired,
  handleAddNewItem: PropTypes.func.isRequired,
  handleDeleteParameter: PropTypes.func.isRequired,
  handleEditParameter: PropTypes.func.isRequired,
  isHyperTypeExist: PropTypes.bool.isRequired,
  isPanelEditMode: PropTypes.bool.isRequired,
  parameterTypeOptions: SELECT_OPTIONS.isRequired,
  parameters: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  parametersDispatch: PropTypes.func.isRequired,
  parametersState: PropTypes.shape({}).isRequired,
  selectorCriteria: PropTypes.string.isRequired,
  setNewJobSelectorCriteria: PropTypes.func.isRequired,
  setNewJobSelectorResult: PropTypes.func.isRequired,
  setTuningStrategy: PropTypes.func.isRequired,
  setUrl: PropTypes.func.isRequired,
  tableContent: PropTypes.shape({}).isRequired,
  tuningStrategy: PropTypes.string,
  undoParameterCreation: PropTypes.func.isRequired,
  url: PropTypes.string
}

export default JobsPanelParametersView
