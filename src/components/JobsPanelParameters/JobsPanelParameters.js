import React, { useState, useEffect, useReducer } from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import JobsPanelParametersView from './JobsPanelParametersView'

import panelData from '../JobsPanel/panelData'
import {
  initialState,
  parametersActions,
  parametersReducer
} from './parametersReducer'
import { editHyperParams } from './parameters.util'
import { panelActions } from '../JobsPanel/panelReducer'

const JobsPanelParameters = ({
  hyperparams,
  match,
  panelDispatch,
  parameters,
  setNewJobHyperParameters,
  setNewJobParameters,
  tableData
}) => {
  const [addNewParameter, setAddNewParameter] = useState(false)
  const [parametersState, parametersDispatch] = useReducer(
    parametersReducer,
    initialState
  )
  const selectOptions = {
    parameterType: [
      { label: 'Simple', id: 'Simple' },
      { label: 'Hyper', id: 'Hyper' }
    ],
    parametersValueType: [
      {
        label: 'string',
        id: 'string'
      },
      {
        label: 'number',
        id: 'number'
      },
      {
        label: 'list',
        id: 'list'
      },
      {
        label: 'map',
        id: 'map'
      }
    ]
  }

  useEffect(() => {
    if (isEmpty(parametersState.parametersArray)) {
      parametersDispatch({
        type: parametersActions.SET_PARAMETERS_ARRAY,
        payload: tableData
      })
    }
  }, [parametersState.parametersArray, tableData])

  const handleAddNewParameter = () => {
    const isEmptyParameter =
      !parametersState.newParameter.name.length ||
      !parametersState.newParameter.value.length

    if (isEmptyParameter) {
      parametersDispatch({
        type: parametersActions.REMOVE_NEW_PARAMETER_DATA
      })

      return setAddNewParameter(false)
    }

    setNewJobParameters({
      ...parameters,
      [parametersState.newParameter.name]: parametersState.newParameter.value
    })
    panelDispatch({
      type: panelActions.SET_PREVIOUS_PANEL_DATA_PARAMETERS,
      payload: [
        ...parametersState.parametersArray,
        {
          doc: '',
          isValueEmpty: false,
          isDefault: false,
          data: {
            name: parametersState.newParameter.name,
            valueType: parametersState.newParameter.valueType,
            value: parametersState.newParameter.value,
            parameterType: parametersState.newParameter.parameterType
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

    parametersDispatch({
      type: parametersActions.SET_PARAMETERS_ARRAY,
      payload: [
        ...parametersState.parametersArray,
        {
          data: {
            name: parametersState.newParameter.name,
            valueType: parametersState.newParameter.valueType,
            value: parametersState.newParameter.value,
            parameterType: parametersState.newParameter.parameterType
          },
          doc: '',
          isValueEmpty: true,
          isDefault: false
        }
      ]
    })

    setAddNewParameter(false)
    parametersDispatch({
      type: parametersActions.REMOVE_NEW_PARAMETER_DATA
    })
  }

  const handleEditParameter = () => {
    const params = { ...parameters }
    const hyperParamsObj = { ...hyperparams }

    params[parametersState.selectedParameter.data.name] =
      parametersState.selectedParameter.data.value

    if (
      parametersState.selectedParameter.data.parameterType &&
      parametersState.selectedParameter.data.parameterType !==
        panelData.newParameterType[0].id
    ) {
      setNewJobHyperParameters(
        editHyperParams(
          hyperParamsObj,
          hyperparams,
          parametersState.selectedParameter.data
        )
      )
    }

    if (
      parametersState.selectedParameter.data.parameterType ===
        panelData.newParameterType[0].id &&
      hyperParamsObj[parametersState.selectedParameter.data.name]
    ) {
      delete hyperParamsObj[parametersState.selectedParameter.data.name]

      setNewJobHyperParameters({ ...hyperParamsObj })
    }

    const newParametersArray = parametersState.parametersArray.map(param => {
      if (param.data.name === parametersState.selectedParameter.data.name) {
        param.data.value = parametersState.selectedParameter.data.value
        param.data.parameterType =
          parametersState.selectedParameter.data.parameterType
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
    parametersDispatch({
      type: parametersActions.SET_PARAMETERS_ARRAY,
      payload: newParametersArray
    })
  }

  const handleDeleteParameter = (isInput, item) => {
    const newParameters = { ...parameters }

    delete newParameters[item.name]

    if (item.data.parameterType !== panelData.newParameterType[0].id) {
      const newHyperParameters = { ...hyperparams }

      delete newHyperParameters[item.name]

      setNewJobHyperParameters({ ...newHyperParameters })
    }

    setNewJobParameters({ ...newParameters })
    panelDispatch({
      type: panelActions.SET_PREVIOUS_PANEL_DATA_PARAMETERS,
      payload: parametersState.parametersArray.filter(
        parameter => parameter.data.name !== item.data.name
      )
    })
    parametersDispatch({
      type: parametersActions.SET_PARAMETERS_ARRAY,
      payload: parametersState.parametersArray.filter(
        parameter => parameter.data.name !== item.data.name
      )
    })
  }

  return (
    <JobsPanelParametersView
      addNewParameter={addNewParameter}
      handleAddNewItem={handleAddNewParameter}
      handleDeleteParameter={handleDeleteParameter}
      handleEditParameter={handleEditParameter}
      match={match}
      parametersDispatch={parametersDispatch}
      parametersState={parametersState}
      parameters={parametersState.parametersArray}
      selectOptions={selectOptions}
      setAddNewParameter={setAddNewParameter}
    />
  )
}

JobsPanelParameters.propTypes = {
  hyperparams: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  parameters: PropTypes.shape({}).isRequired,
  setNewJobHyperParameters: PropTypes.func.isRequired,
  setNewJobParameters: PropTypes.func.isRequired
}

export default JobsPanelParameters
