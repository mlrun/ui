import React, { useReducer, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'

import JobsPanelParametersView from './JobsPanelParametersView'

import panelData from '../JobsPanel/panelData'
import {
  initialState,
  parametersActions,
  jobsPanelParametersReducer
} from './jobsPanelParametersReducer'
import { editHyperParams, generateTableData } from './jobsPanelParameters.util'
import { panelActions } from '../JobsPanel/panelReducer'

const JobsPanelParameters = ({
  newJobTaskSpecObj,
  panelDispatch,
  panelState,
  setNewJobHyperParameters,
  setNewJobParameters,
  setTuningStrategy,
  setUrl
}) => {
  const [parametersState, parametersDispatch] = useReducer(
    jobsPanelParametersReducer,
    initialState
  )

  const disabledOptions = useMemo(() => {
    if (newJobTaskSpecObj.param_file) {
      return ['hyper']
    }
    return []
  }, [newJobTaskSpecObj.param_file])

  const checkParameter = useCallback(
    item => {
      const parameters = panelState.tableData.parameters.map(parameter => {
        if (parameter.data.name === item && !parameter.isChecked) {
          parameter.isChecked = true

          if (
            parameter.data.parameterType !== panelData.newParameterType[0].id
          ) {
            setNewJobHyperParameters({
              ...newJobTaskSpecObj.hyperparams,
              [parameter.data.name]: `${parameter.data.value}`.split(',')
            })
          }

          setNewJobParameters({
            ...newJobTaskSpecObj.parameters,
            [parameter.data.name]: parameter.data.value
          })
        } else if (parameter.isChecked && parameter.data.name === item) {
          parameter.isChecked = false

          const params = { ...newJobTaskSpecObj.parameters }

          delete params[parameter.data.name]

          setNewJobParameters({
            ...params
          })

          if (
            parameter.data.parameterType !== panelData.newParameterType[0].id
          ) {
            const hyperParams = { ...newJobTaskSpecObj.hyperparams }

            delete hyperParams[parameter.data.name]

            setNewJobHyperParameters({
              ...hyperParams
            })
          }
        }

        return parameter
      })

      panelDispatch({
        type: panelActions.SET_PREVIOUS_PANEL_DATA_PARAMETERS,
        payload: parameters
      })
      panelDispatch({
        type: panelActions.SET_TABLE_DATA_PARAMETERS,
        payload: parameters
      })
    },
    [
      newJobTaskSpecObj.hyperparams,
      newJobTaskSpecObj.parameters,
      panelDispatch,
      panelState.tableData.parameters,
      setNewJobHyperParameters,
      setNewJobParameters
    ]
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
      ...newJobTaskSpecObj.parameters,
      [parametersState.newParameter.name]: +parametersState.newParameter.value
    })
    panelDispatch({
      type: panelActions.SET_PREVIOUS_PANEL_DATA_PARAMETERS,
      payload: [
        ...panelState.previousPanelData.tableData.parameters,
        {
          doc: '',
          isDefault: false,
          isChecked: true,
          data: {
            name: parametersState.newParameter.name,
            valueType: parametersState.newParameter.valueType,
            parameterType: parametersState.newParameter.parameterType,
            value: parametersState.newParameter.value
          }
        }
      ]
    })

    if (
      parametersState.newParameter.parameterType !==
      panelData.newParameterType[0].id
    ) {
      setNewJobHyperParameters({
        ...newJobTaskSpecObj.hyperparams,
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
            name: parametersState.newParameter.name,
            valueType: parametersState.newParameter.valueType,
            parameterType: parametersState.newParameter.parameterType,
            value: parametersState.newParameter.value
          },
          doc: '',
          isDefault: false,
          isChecked: true
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
    const params = { ...newJobTaskSpecObj.parameters }
    const hyperParamsObj = { ...newJobTaskSpecObj.hyperparams }

    if (parametersState.selectedParameter.newName) {
      delete params[parametersState.selectedParameter.data.name]

      params[parametersState.selectedParameter.newName] =
        parametersState.selectedParameter.data.value
    } else {
      params[parametersState.selectedParameter.data.name] =
        parametersState.selectedParameter.data.value
    }

    if (
      parametersState.selectedParameter.data.parameterType !==
        panelData.newParameterType[0].id &&
      parametersState.selectedParameter.isChecked
    ) {
      setNewJobHyperParameters(
        editHyperParams(
          hyperParamsObj,
          parametersState.selectedParameter.data,
          parametersState.selectedParameter.newName
        )
      )
    }

    if (
      parametersState.selectedParameter.data.parameterType ===
        panelData.newParameterType[0].id &&
      hyperParamsObj[parametersState.selectedParameter.data.name] &&
      parametersState.selectedParameter.isChecked
    ) {
      delete hyperParamsObj[parametersState.selectedParameter.data.name]

      setNewJobHyperParameters({ ...hyperParamsObj })
    }

    const newParametersArray = panelState.tableData.parameters.map(param => {
      if (param.data.name === parametersState.selectedParameter.data.name) {
        if (parametersState.selectedParameter.newName) {
          param.data.name = parametersState.selectedParameter.newName
        }

        param.data.value = parametersState.selectedParameter.data.value
        param.data.parameterType =
          parametersState.selectedParameter.data.parameterType
      }

      return param
    })

    if (parametersState.selectedParameter.isChecked) {
      setNewJobParameters({ ...params })
    }

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

  const handleDeleteParameter = item => {
    const newParameters = { ...newJobTaskSpecObj.parameters }

    delete newParameters[item.data.name]

    if (item.data.parameterType !== panelData.newParameterType[0].id) {
      const newHyperParameters = { ...newJobTaskSpecObj.hyperparams }

      delete newHyperParameters[item.data.name]

      setNewJobHyperParameters({ ...newHyperParameters })
    }

    const parameters = panelState.tableData.parameters.filter(
      parameter => parameter.data.name !== item.data.name
    )

    setNewJobParameters({ ...newParameters })
    panelDispatch({
      type: panelActions.SET_PREVIOUS_PANEL_DATA_PARAMETERS,
      payload: parameters
    })
    panelDispatch({
      type: panelActions.SET_TABLE_DATA_PARAMETERS,
      payload: parameters
    })
  }

  const isHyperTypeExist = useMemo(() => {
    return panelState.tableData.parameters.some(
      parameter => parameter.data.parameterType.toLowerCase() === 'hyper'
    )
  }, [panelState.tableData.parameters])

  const tableContent = useMemo(
    () => generateTableData(panelState.tableData.parameters),
    [panelState.tableData.parameters]
  )

  return (
    <JobsPanelParametersView
      checkParameter={checkParameter}
      disabledOptions={disabledOptions}
      handleAddNewItem={handleAddNewParameter}
      handleDeleteParameter={handleDeleteParameter}
      handleEditParameter={handleEditParameter}
      isHyperTypeExist={isHyperTypeExist}
      parameters={panelState.tableData.parameters}
      parametersDispatch={parametersDispatch}
      parametersState={parametersState}
      setTuningStrategy={setTuningStrategy}
      setUrl={setUrl}
      tableContent={tableContent}
      tuningStrategy={newJobTaskSpecObj.tuning_strategy}
      url={newJobTaskSpecObj.param_file}
    />
  )
}

JobsPanelParameters.propTypes = {
  newJobTaskSpecObj: PropTypes.shape({}).isRequired,
  panelDispatch: PropTypes.func.isRequired,
  panelState: PropTypes.shape({}).isRequired,
  setNewJobHyperParameters: PropTypes.func.isRequired,
  setNewJobParameters: PropTypes.func.isRequired,
  setTuningStrategy: PropTypes.func.isRequired,
  setUrl: PropTypes.func.isRequired
}

export default JobsPanelParameters
