import React, { useReducer } from 'react'
import PropTypes from 'prop-types'

import JobsPanelParametersView from './JobsPanelParametersView'

import panelData from '../JobsPanel/panelData'
import {
  initialState,
  parametersActions,
  jobsPanelParametersReducer
} from './jobsPanelParametersReducer'
import { editHyperParams } from './jobsPanelParameters.util'
import { panelActions } from '../JobsPanel/panelReducer'

const JobsPanelParameters = ({
  hyperparams,
  match,
  panelDispatch,
  panelState,
  parameters,
  setNewJobHyperParameters,
  setNewJobParameters
}) => {
  const [parametersState, parametersDispatch] = useReducer(
    jobsPanelParametersReducer,
    initialState
  )

  const handleAddNewParameter = () => {
    if (
      !parametersState.newParameter.name.length ||
      !parametersState.newParameter.value.length
    ) {
      parametersDispatch({
        type: parametersActions.REMOVE_NEW_PARAMETER_DATA
      })

      return parametersDispatch({
        type: parametersActions.SET_ADD_NEW_PARAMETER,
        payload: false
      })
    }

    setNewJobParameters({
      ...parameters,
      [parametersState.newParameter.name]: parametersState.newParameter.value
    })
    panelDispatch({
      type: panelActions.SET_PREVIOUS_PANEL_DATA_PARAMETERS,
      payload: [
        ...panelState.previousPanelData.tableData.parameters,
        {
          doc: '',
          isDefault: false,
          data: {
            name: {
              label: parametersState.newParameter.name
            },
            valueType: {
              label: parametersState.newParameter.valueType
            },
            parameterType: {
              label: parametersState.newParameter.parameterType,
              isEdit: false
            },
            value: {
              label: parametersState.newParameter.value,
              isEdit: false
            }
          }
        }
      ]
    })

    if (
      parametersState.newParameter.parameterType !==
      panelData.newParameterType[0].id
    ) {
      setNewJobHyperParameters({
        ...hyperparams,
        [parametersState.newParameter
          .name]: parametersState.newParameter.value.split(',')
      })
    }

    panelDispatch({
      type: panelActions.SET_TABLE_DATA_PARAMETERS,
      payload: [
        ...panelState.tableData.parameters,
        {
          data: {
            name: {
              label: parametersState.newParameter.name
            },
            valueType: {
              label: parametersState.newParameter.valueType
            },
            parameterType: {
              label: parametersState.newParameter.parameterType,
              isEdit: false
            },
            value: {
              label: parametersState.newParameter.value,
              isEdit: false
            }
          },
          doc: '',
          isDefault: false
        }
      ]
    })

    parametersDispatch({
      type: parametersActions.SET_ADD_NEW_PARAMETER,
      payload: false
    })
    parametersDispatch({
      type: parametersActions.REMOVE_NEW_PARAMETER_DATA
    })
  }

  const handleEditParameter = () => {
    const params = { ...parameters }
    const hyperParamsObj = { ...hyperparams }

    params[parametersState.selectedParameter.data.name.label] =
      parametersState.selectedParameter.data.value.label

    if (
      parametersState.selectedParameter.data.parameterType.label &&
      parametersState.selectedParameter.data.parameterType.label !==
        panelData.newParameterType[0].id
    ) {
      setNewJobHyperParameters(
        editHyperParams(hyperParamsObj, parametersState.selectedParameter.data)
      )
    }

    if (
      parametersState.selectedParameter.data.parameterType.label ===
        panelData.newParameterType[0].id &&
      hyperParamsObj[parametersState.selectedParameter.data.name.label]
    ) {
      delete hyperParamsObj[parametersState.selectedParameter.data.name.label]

      setNewJobHyperParameters({ ...hyperParamsObj })
    }

    const newParametersArray = panelState.tableData.parameters.map(param => {
      if (
        param.data.name.label ===
        parametersState.selectedParameter.data.name.label
      ) {
        param.data.value.label =
          parametersState.selectedParameter.data.value.label
        param.data.value.isEdit = false
        param.data.parameterType.label =
          parametersState.selectedParameter.data.parameterType.label
        param.data.parameterType.isEdit = false
      }

      return param
    })

    setNewJobParameters({ ...params })
    panelDispatch({
      type: panelActions.SET_PREVIOUS_PANEL_DATA_PARAMETERS,
      payload: newParametersArray
    })
    parametersDispatch({
      type: parametersActions.SET_SELECTED_PARAMETER,
      payload: {}
    })
    panelDispatch({
      type: panelActions.SET_TABLE_DATA_PARAMETERS,
      payload: newParametersArray
    })
  }

  const handleDeleteParameter = (isInput, item) => {
    const newParameters = { ...parameters }

    delete newParameters[item.name.label]

    if (item.data.parameterType.label !== panelData.newParameterType[0].id) {
      const newHyperParameters = { ...hyperparams }

      delete newHyperParameters[item.name.label]

      setNewJobHyperParameters({ ...newHyperParameters })
    }

    setNewJobParameters({ ...newParameters })
    panelDispatch({
      type: panelActions.SET_PREVIOUS_PANEL_DATA_PARAMETERS,
      payload: panelState.tableData.parameters.filter(
        parameter => parameter.data.name.label !== item.data.name.label
      )
    })
    panelDispatch({
      type: panelActions.SET_TABLE_DATA_PARAMETERS,
      payload: panelState.tableData.parameters.filter(
        parameter => parameter.data.name.label !== item.data.name.label
      )
    })
  }

  return (
    <JobsPanelParametersView
      handleAddNewItem={handleAddNewParameter}
      handleDeleteParameter={handleDeleteParameter}
      handleEditParameter={handleEditParameter}
      match={match}
      panelDispatch={panelDispatch}
      parametersDispatch={parametersDispatch}
      parametersState={parametersState}
      parameters={panelState.tableData.parameters}
    />
  )
}

JobsPanelParameters.propTypes = {
  hyperparams: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  panelDispatch: PropTypes.func.isRequired,
  panelState: PropTypes.shape({}).isRequired,
  parameters: PropTypes.shape({}).isRequired,
  setNewJobHyperParameters: PropTypes.func.isRequired,
  setNewJobParameters: PropTypes.func.isRequired
}

export default JobsPanelParameters
