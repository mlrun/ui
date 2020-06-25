import React from 'react'
import PropTypes from 'prop-types'
import { find } from 'lodash'

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
  handleAddNewItem,
  handleDeleteParameter,
  handleEditParameter,
  match,
  parameters,
  parametersDispatch,
  parametersState
}) => {
  return (
    <div className="job-panel__item">
      <JobsPanelSection title="Parameters">
        <JobsPanelTable
          addNewItem={parametersState.addNewParameter}
          className="parameters"
          content={parameters}
          handleDeleteItems={handleDeleteParameter}
          handleEditParameter={handleEditParameter}
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
                  label={parametersState.newParameter.parameterType}
                  className="select-parameters-type"
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
        <button className="btn-load">Load file</button>
      </JobsPanelSection>
    </div>
  )
}

JobsPanelParametersView.propTypes = {
  handleAddNewItem: PropTypes.func.isRequired,
  handleDeleteParameter: PropTypes.func.isRequired,
  handleEditParameter: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  parameters: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  parametersDispatch: PropTypes.func.isRequired,
  parametersState: PropTypes.shape({}).isRequired
}

export default JobsPanelParametersView
