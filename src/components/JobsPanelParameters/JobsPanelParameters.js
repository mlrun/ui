import React, { useReducer, useMemo } from 'react'
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
  jobsStoreNewJobTaskSpec,
  match,
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
    if (jobsStoreNewJobTaskSpec.param_file) {
      return ['hyper']
    }
    return []
  }, [jobsStoreNewJobTaskSpec.param_file])

  const isHyperTypeExist = useMemo(() => {
    return panelState.tableData.parameters.some(
      parameter => parameter.data.parameterType.toLowerCase() === 'hyper'
    )
  }, [panelState.tableData.parameters])

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
      ...jobsStoreNewJobTaskSpec.parameters,
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
        ...jobsStoreNewJobTaskSpec.hyperparams,
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
    const params = { ...jobsStoreNewJobTaskSpec.parameters }
    const hyperParamsObj = { ...jobsStoreNewJobTaskSpec.hyperparams }

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
      panelData.newParameterType[0].id
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
      hyperParamsObj[parametersState.selectedParameter.data.name]
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

  const handleDeleteParameter = item => {
    const newParameters = { ...jobsStoreNewJobTaskSpec.parameters }

    delete newParameters[item.name]

    if (item.data.parameterType !== panelData.newParameterType[0].id) {
      const newHyperParameters = { ...jobsStoreNewJobTaskSpec.hyperparams }

      delete newHyperParameters[item.name]

      setNewJobHyperParameters({ ...newHyperParameters })
    }

    setNewJobParameters({ ...newParameters })
    panelDispatch({
      type: panelActions.SET_PREVIOUS_PANEL_DATA_PARAMETERS,
      payload: panelState.tableData.parameters.filter(
        parameter => parameter.data.name !== item.data.name
      )
    })
    panelDispatch({
      type: panelActions.SET_TABLE_DATA_PARAMETERS,
      payload: panelState.tableData.parameters.filter(
        parameter => parameter.data.name !== item.data.name
      )
    })
  }

  return (
    <JobsPanelParametersView
      disabledOptions={disabledOptions}
      handleAddNewItem={handleAddNewParameter}
      handleDeleteParameter={handleDeleteParameter}
      handleEditItems={handleEditParameter}
      isHyperTypeExist={isHyperTypeExist}
      match={match}
      parameters={panelState.tableData.parameters}
      parametersDispatch={parametersDispatch}
      parametersState={parametersState}
      setTuningStrategy={setTuningStrategy}
      setUrl={setUrl}
      tuningStrategy={jobsStoreNewJobTaskSpec.tuning_strategy}
      url={jobsStoreNewJobTaskSpec.param_file}
    />
  )
}

JobsPanelParameters.propTypes = {
  jobsStoreNewJobTaskSpec: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  panelDispatch: PropTypes.func.isRequired,
  panelState: PropTypes.shape({}).isRequired,
  setNewJobHyperParameters: PropTypes.func.isRequired,
  setNewJobParameters: PropTypes.func.isRequired,
  setTuningStrategy: PropTypes.func.isRequired,
  setUrl: PropTypes.func.isRequired
}

export default JobsPanelParameters
