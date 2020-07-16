import React from 'react'
import PropTypes from 'prop-types'
import { find } from 'lodash'
import classnames from 'classnames'

import JobsPanelSection from '../../elements/JobsPanelSection/JobsPanelSection'
import JobsPanelTable from '../../elements/JobsPanelTable/JobsPanelTable'
import Input from '../../common/Input/Input'
import Tooltip from '../../common/Tooltip/Tooltip'
import TextTooltipTemplate from '../../elements/TooltipTemplate/TextTooltipTemplate'
import JobsPanelTableAddItemRow from '../../elements/JobsPanelTableAddItemRow/JobsPanelTableAddItemRow'
import Select from '../../common/Select/Select'

import { ReactComponent as Plus } from '../../images/plus.svg'

import panelData from '../JobsPanel/panelData'
import { parametersActions } from './jobsPanelParametersReducer'
import { selectOptions } from './jobsPanelParameters.util'

const JobsPanelParametersView = ({
  disabledOptions,
  handleAddNewItem,
  handleDeleteParameter,
  handleEditItems,
  isHyperTypeExist,
  match,
  parameters,
  parametersDispatch,
  parametersState,
  setTuningStrategy,
  setUrl,
  tuningStrategy,
  url
}) => {
  const urlTypeClassName = classnames(
    'parameters-additional-settings__url-type',
    isHyperTypeExist && 'disabled'
  )
  const tuningStrategyClassName = classnames(
    'parameters-additional-settings__tuning-strategy',
    !isHyperTypeExist && !url && 'disabled'
  )

  return (
    <div className="job-panel__item">
      <JobsPanelSection title="Parameters">
        <JobsPanelTable
          disabledOptions={disabledOptions}
          addNewItem={parametersState.addNewParameter}
          className="parameters"
          content={parameters}
          handleDeleteItems={handleDeleteParameter}
          handleEditItems={handleEditItems}
          headers={panelData.parameters['table-headers']}
          match={match}
          section="parameters"
          selectedItem={parametersState.selectedParameter}
          setSelectedItem={selectedParam =>
            parametersDispatch({
              type: parametersActions.SET_SELECTED_PARAMETER,
              payload: selectedParam
            })
          }
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
                  type="text"
                />
                <Select
                  className="parameters-value-type"
                  label={parametersState.newParameter.valueType}
                  match={match}
                  onClick={value =>
                    parametersDispatch({
                      type: parametersActions.SET_NEW_PARAMETER_VALUE_TYPE,
                      payload: find(selectOptions.parametersValueType, [
                        'id',
                        value
                      ]).id
                    })
                  }
                  options={selectOptions.parametersValueType}
                />
                <Select
                  className="select-parameters-type"
                  disabledOptions={disabledOptions}
                  label={parametersState.newParameter.parameterType}
                  match={match}
                  onClick={value =>
                    parametersDispatch({
                      type: parametersActions.SET_NEW_PARAMETER_TYPE,
                      payload: find(selectOptions.parameterType, ['id', value])
                        .id
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
              text="parameter"
            />
          )}
        </JobsPanelTable>
        <div className="parameters-additional-settings-container">
          <div className="parameters-additional-settings__header">
            <span className="parameters-additional-settings__header-text">
              Hyper Parameters
            </span>
          </div>
          <div className="parameters-additional-settings">
            <div className={urlTypeClassName}>
              <Input
                label="URL"
                className="default-input"
                type="text"
                floatingLabel
                onChange={value => {
                  setUrl(value)
                }}
              />
            </div>
            <div className={tuningStrategyClassName}>
              <Select
                selectedId={tuningStrategy}
                options={selectOptions.hyperStrategyType}
                label="Tuning Strategy:"
                match={match}
                onClick={value => {
                  setTuningStrategy(
                    find(selectOptions.hyperStrategyType, ['id', value]).id
                  )
                }}
              />
            </div>
          </div>
        </div>
      </JobsPanelSection>
    </div>
  )
}

JobsPanelParametersView.propTypes = {
  handleAddNewItem: PropTypes.func.isRequired,
  handleDeleteParameter: PropTypes.func.isRequired,
  handleEditItems: PropTypes.func.isRequired,
  isHyperTypeExist: PropTypes.bool.isRequired,
  match: PropTypes.shape({}).isRequired,
  parameters: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  parametersDispatch: PropTypes.func.isRequired,
  parametersState: PropTypes.shape({}).isRequired,
  setTuningStrategy: PropTypes.func.isRequired,
  setUrl: PropTypes.func.isRequired,
  tuningStrategy: PropTypes.string,
  url: PropTypes.string
}

export default JobsPanelParametersView
