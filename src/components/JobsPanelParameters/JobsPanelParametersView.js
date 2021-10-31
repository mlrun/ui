import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import JobsPanelSection from '../../elements/JobsPanelSection/JobsPanelSection'
import Input from '../../common/Input/Input'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import JobsPanelTableAddItemRow from '../../elements/JobsPanelTableAddItemRow/JobsPanelTableAddItemRow'
import JobsPanelParametersTable from '../../elements/JobsPanelParametersTable/JobsPanelParametersTable'
import Select from '../../common/Select/Select'

import panelData from '../JobsPanel/panelData'
import { parametersActions } from './jobsPanelParametersReducer'
import { selectOptions } from './jobsPanelParameters.util'
import { isNameNotUnique } from '../JobsPanel/jobsPanel.util'
import { SELECT_OPTIONS } from '../../types'

import { ReactComponent as Plus } from '../../images/plus.svg'

const JobsPanelParametersView = ({
  checkParameter,
  handleAddNewItem,
  handleDeleteParameter,
  handleEditParameter,
  isHyperTypeExist,
  parameterTypeOptions,
  parameters,
  parametersDispatch,
  parametersState,
  selectorCriteria,
  setNewJobSelectorCriteria,
  setNewJobSelectorResult,
  setTuningStrategy,
  setUrl,
  tableContent,
  tuningStrategy,
  url
}) => {
  const urlTypeClassName = classnames(
    'parameters-additional-settings__input-wrapper',
    isHyperTypeExist && 'disabled'
  )
  const tuningStrategyClassName = classnames(
    'parameters-additional-settings__select-wrapper',
    !isHyperTypeExist && !url && 'disabled'
  )

  return (
    <div className="job-panel__item new-item-side-panel__item">
      <JobsPanelSection title="Parameters">
        <JobsPanelParametersTable
          addNewItem={parametersState.addNewParameter}
          checkParameter={checkParameter}
          content={parameters}
          handleDeleteParameter={handleDeleteParameter}
          handleEditParameter={handleEditParameter}
          headers={panelData.parameters['table-headers']}
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
          {parametersState.addNewParameter ? (
            <div className="table__row-add-item">
              <div className="input-row-wrapper">
                <Input
                  wrapperClassName="m-0 me-3"
                  density="chunky"
                  invalid={isNameNotUnique(
                    parametersState.newParameter.name,
                    parameters
                  )}
                  invalidText="Name already exists"
                  placeholder="Name"
                  onChange={value =>
                    parametersDispatch({
                      type: parametersActions.SET_NEW_PARAMETER_NAME,
                      payload: value
                    })
                  }
                  type="text"
                  withoutBorder
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
                  wrapperClassName="m-0 me-3"
                  density="full"
                  placeholder="Value/s"
                  onChange={value =>
                    parametersDispatch({
                      type: parametersActions.SET_NEW_PARAMETER_VALUE,
                      payload: value
                    })
                  }
                  type="text"
                  withoutBorder
                />
              </div>
              <button
                className="add-input"
                disabled={isNameNotUnique(
                  parametersState.newParameter.name,
                  parameters
                )}
                onClick={() => handleAddNewItem(true)}
              >
                <Tooltip template={<TextTooltipTemplate text="Add item" />}>
                  <Plus />
                </Tooltip>
              </button>
            </div>
          ) : (
            <JobsPanelTableAddItemRow
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
            <span className="parameters-additional-settings__header-text">
              Hyper Parameters
            </span>
          </div>
          <div className="parameters-additional-settings">
            <div className={urlTypeClassName}>
              <Input
                wrapperClassName="m-0 me-3"
                density="chunky"
                label="Read hyper params from a file"
                onChange={setUrl}
                placeholder="v3io:///projects/my-proj/param.txt"
                type="text"
              />
            </div>
            <div className={tuningStrategyClassName}>
              <Select
                density="chunky"
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
                wrapperClassName="m-0 me-3"
                density="chunky"
                label="Result"
                onChange={setNewJobSelectorResult}
                type="text"
              />
            </div>
            <div className="parameters-additional-settings__select-wrapper">
              <Select
                density="chunky"
                label="Criteria:"
                onClick={setNewJobSelectorCriteria}
                options={selectOptions.selectorCriteria}
                selectedId={selectorCriteria}
              />
            </div>
          </div>
        </div>
      </JobsPanelSection>
    </div>
  )
}

JobsPanelParametersView.propTypes = {
  checkParameter: PropTypes.func.isRequired,
  handleAddNewItem: PropTypes.func.isRequired,
  handleDeleteParameter: PropTypes.func.isRequired,
  handleEditParameter: PropTypes.func.isRequired,
  isHyperTypeExist: PropTypes.bool.isRequired,
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
  url: PropTypes.string
}

export default JobsPanelParametersView
