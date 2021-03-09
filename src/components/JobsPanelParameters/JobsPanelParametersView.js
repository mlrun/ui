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

import { ReactComponent as Plus } from '../../images/plus.svg'

import panelData from '../JobsPanel/panelData'
import { parametersActions } from './jobsPanelParametersReducer'
import { selectOptions } from './jobsPanelParameters.util'

const JobsPanelParametersView = ({
  checkParameter,
  disabledOptions,
  handleAddNewItem,
  handleDeleteParameter,
  handleEditParameter,
  isHyperTypeExist,
  nameNotValid,
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
    <div className="job-panel__item">
      <JobsPanelSection title="Parameters">
        <JobsPanelParametersTable
          addNewItem={parametersState.addNewParameter}
          checkParameter={checkParameter}
          content={parameters}
          disabledOptions={disabledOptions}
          handleDeleteParameter={handleDeleteParameter}
          handleEditParameter={handleEditParameter}
          headers={panelData.parameters['table-headers']}
          nameValidation={nameNotValid}
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
                  onChange={value =>
                    parametersDispatch({
                      type: parametersActions.SET_NEW_PARAMETER_NAME,
                      payload: value
                    })
                  }
                  label="Name"
                  className="input-row__item"
                  floatingLabel
                  required={nameNotValid(parametersState.newParameter.name)}
                  requiredText="Name already exists"
                  type="text"
                />
                <Select
                  className="parameters-value-type"
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
                  disabledOptions={disabledOptions}
                  label={parametersState.newParameter.parameterType}
                  onClick={value =>
                    parametersDispatch({
                      type: parametersActions.SET_NEW_PARAMETER_TYPE,
                      payload: value
                    })
                  }
                  options={selectOptions.parameterType}
                />
                <Input
                  onChange={value =>
                    parametersDispatch({
                      type: parametersActions.SET_NEW_PARAMETER_VALUE,
                      payload: value
                    })
                  }
                  label="Value/s"
                  className="input-row__item parameter-value"
                  floatingLabel
                  type="text"
                />
              </div>
              <button
                className="add-input btn-add"
                disabled={nameNotValid(parametersState.newParameter.name)}
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
                label="Read hyper params from a file"
                className="default-input"
                type="text"
                floatingLabel
                onChange={setUrl}
              />
            </div>
            <div className={tuningStrategyClassName}>
              <Select
                selectedId={tuningStrategy}
                options={selectOptions.hyperStrategyType}
                label="Tuning Strategy:"
                onClick={setTuningStrategy}
              />
            </div>
          </div>
          <div className="parameters-additional-settings">
            <div className="parameters-additional-settings__input-wrapper">
              <Input
                label="Result"
                className="default-input"
                type="text"
                floatingLabel
                onChange={setNewJobSelectorResult}
              />
            </div>
            <div className="parameters-additional-settings__select-wrapper">
              <Select
                selectedId={selectorCriteria}
                options={selectOptions.selectorCriteria}
                label="Criteria:"
                onClick={setNewJobSelectorCriteria}
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
  disabledOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleAddNewItem: PropTypes.func.isRequired,
  handleDeleteParameter: PropTypes.func.isRequired,
  handleEditParameter: PropTypes.func.isRequired,
  isHyperTypeExist: PropTypes.bool.isRequired,
  nameNotValid: PropTypes.func.isRequired,
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
