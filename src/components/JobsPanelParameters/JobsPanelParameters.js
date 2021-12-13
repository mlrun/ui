import React, { useReducer, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import JobsPanelParametersView from './JobsPanelParametersView'

import panelData from '../JobsPanel/panelData'
import {
  initialState,
  parametersActions,
  jobsPanelParametersReducer
} from './jobsPanelParametersReducer'
import {
  convertParamValue,
  editNewJobParams,
  generateTableData,
  getParameterTypeOptions,
  setHyperParams,
  setTableData
} from './jobsPanelParameters.util'
import { panelActions } from '../JobsPanel/panelReducer'
import jobsActions from '../../actions/jobs'

const JobsPanelParameters = ({
  jobsStore,
  panelDispatch,
  panelState,
  setNewJobHyperParameters,
  setNewJobParameters,
  setNewJobSelectorCriteria,
  setNewJobSelectorResult,
  setTuningStrategy,
  setUrl
}) => {
  const [parametersState, parametersDispatch] = useReducer(
    jobsPanelParametersReducer,
    initialState
  )
  const parameterTypeOptions = useMemo(() => {
    return getParameterTypeOptions(jobsStore.newJob.task.spec.param_file)
  }, [jobsStore.newJob.task.spec.param_file])

  const checkParameter = useCallback(
    item => {
      const parameters = panelState.tableData.parameters.map(parameter => {
        if (parameter.data.name === item && !parameter.isChecked) {
          parameter.isChecked = true

          if (
            parameter.data.parameterType !== panelData.newParameterType[0].id
          ) {
            setHyperParams(
              parameter.data,
              jobsStore.newJob.task.spec.hyperparams,
              setNewJobHyperParameters
            )
          }

          setNewJobParameters({
            ...jobsStore.newJob.task.spec.parameters,
            [parameter.data.name]: parameter.data.value
          })
        } else if (parameter.isChecked && parameter.data.name === item) {
          parameter.isChecked = false

          const params = { ...jobsStore.newJob.task.spec.parameters }

          delete params[parameter.data.name]

          setNewJobParameters({
            ...params
          })

          if (
            parameter.data.parameterType !== panelData.newParameterType[0].id
          ) {
            const hyperParams = { ...jobsStore.newJob.task.spec.hyperparams }

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
      jobsStore.newJob.task.spec.hyperparams,
      jobsStore.newJob.task.spec.parameters,
      panelDispatch,
      panelState.tableData.parameters,
      setNewJobHyperParameters,
      setNewJobParameters
    ]
  )

  const handleAddNewParameter = () => {
    if (
      parametersState.newParameter.name.length &&
      parametersState.newParameter.value.length
    ) {
      if (
        parametersState.newParameter.parameterType ===
        panelData.newParameterType[0].id
      ) {
        setNewJobParameters({
          ...jobsStore.newJob.task.spec.parameters,
          [parametersState.newParameter.name]: convertParamValue(
            parametersState.newParameter.value,
            parametersState.newParameter.valueType
          )
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
      } else if (
        parametersState.newParameter.parameterType !==
        panelData.newParameterType[0].id
      ) {
        setHyperParams(
          parametersState.newParameter,
          jobsStore.newJob.task.spec.hyperparams,
          setNewJobHyperParameters
        )
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
    }

    parametersDispatch({
      type: parametersActions.SET_ADD_NEW_PARAMETER,
      payload: false
    })
    parametersDispatch({
      type: parametersActions.REMOVE_NEW_PARAMETER_DATA
    })
  }

  const handleEditParameter = () => {
    const hyperParamsObj = { ...jobsStore.newJob.task.spec.hyperparams }
    const convertedValue = convertParamValue(
      parametersState.selectedParameter.data.value,
      parametersState.selectedParameter.data.valueType
    )

    if (parametersState.selectedParameter.isChecked) {
      setNewJobParameters({
        ...editNewJobParams(
          parametersState.selectedParameter,
          jobsStore.newJob.task.spec,
          convertedValue,
          setNewJobHyperParameters
        )
      })
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

    setTableData(
      panelState,
      panelDispatch,
      parametersState.selectedParameter,
      parametersDispatch
    )
  }

  const handleDeleteParameter = (item, index) => {
    const newParameters = { ...jobsStore.newJob.task.spec.parameters }

    delete newParameters[item.data.name]

    if (item.data.parameterType !== panelData.newParameterType[0].id) {
      const newHyperParameters = { ...jobsStore.newJob.task.spec.hyperparams }

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
      handleAddNewItem={handleAddNewParameter}
      handleDeleteParameter={handleDeleteParameter}
      handleEditParameter={handleEditParameter}
      isHyperTypeExist={isHyperTypeExist}
      parameterTypeOptions={parameterTypeOptions}
      parameters={panelState.tableData.parameters}
      parametersDispatch={parametersDispatch}
      parametersState={parametersState}
      selectorCriteria={jobsStore.newJob.task.spec.selector.criteria}
      setNewJobSelectorCriteria={setNewJobSelectorCriteria}
      setNewJobSelectorResult={setNewJobSelectorResult}
      setTuningStrategy={setTuningStrategy}
      setUrl={setUrl}
      tableContent={tableContent}
      tuningStrategy={jobsStore.newJob.task.spec.tuning_strategy}
      url={jobsStore.newJob.task.spec.param_file}
    />
  )
}

JobsPanelParameters.propTypes = {
  panelDispatch: PropTypes.func.isRequired,
  panelState: PropTypes.shape({}).isRequired
}

export default connect(jobsStore => ({ ...jobsStore }), { ...jobsActions })(
  JobsPanelParameters
)
