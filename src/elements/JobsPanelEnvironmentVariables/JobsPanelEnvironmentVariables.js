import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import EnvironmentVariables from '../EnvironmentVariables/EnvironmentVariables'

import { panelActions } from '../../components/JobsPanel/panelReducer'
import { parseEnvVariables } from '../../utils/parseEnvironmentVariables'
import { generateEnvVariable } from '../../utils/generateEnvironmentVariable'
import jobsActions from '../../actions/jobs'

const JobsPanelEnvironmentVariables = ({
  jobsStore,
  panelDispatch,
  panelEnvData,
  previousPanelEnvData,
  setNewJobEnvironmentVariables
}) => {
  const handleAddNewEnv = env => {
    const generatedVariable = generateEnvVariable(env)

    setNewJobEnvironmentVariables([
      ...jobsStore.newJob.function.spec.env,
      { ...generatedVariable }
    ])
    panelDispatch({
      type: panelActions.SET_PREVIOUS_PANEL_DATA_ENVIRONMENT_VARIABLES,
      payload: [...previousPanelEnvData, { data: { ...generatedVariable } }]
    })
    panelDispatch({
      type: panelActions.SET_TABLE_DATA_ENVIRONMENT_VARIABLES,
      payload: [...panelEnvData, { data: { ...generatedVariable } }]
    })
  }

  const handleEditEnv = env => {
    const variables = env.map(item => generateEnvVariable(item))
    const panelData = variables.map(variable => ({ data: { ...variable } }))

    setNewJobEnvironmentVariables([...variables])
    panelDispatch({
      type: panelActions.SET_PREVIOUS_PANEL_DATA_ENVIRONMENT_VARIABLES,
      payload: [...panelData]
    })
    panelDispatch({
      type: panelActions.SET_TABLE_DATA_ENVIRONMENT_VARIABLES,
      payload: [...panelData]
    })
  }

  const handleDeleteEnv = env => {
    const variables = env.map(item => generateEnvVariable(item))
    const panelData = variables.map(variable => ({ data: { ...variable } }))

    setNewJobEnvironmentVariables([...variables])
    panelDispatch({
      type: panelActions.SET_TABLE_DATA_ENVIRONMENT_VARIABLES,
      payload: [...panelData]
    })
    panelDispatch({
      type: panelActions.SET_PREVIOUS_PANEL_DATA_ENVIRONMENT_VARIABLES,
      payload: [...panelData]
    })
  }

  return (
    <EnvironmentVariables
      envVariables={parseEnvVariables(panelEnvData.map(env => env.data))}
      handleAddNewEnv={handleAddNewEnv}
      handleDeleteEnv={handleDeleteEnv}
      handleEditEnv={handleEditEnv}
    />
  )
}

JobsPanelEnvironmentVariables.propTypes = {
  panelDispatch: PropTypes.func.isRequired,
  panelEnvData: PropTypes.arrayOf(PropTypes.shape).isRequired,
  previousPanelEnvData: PropTypes.arrayOf(PropTypes.shape).isRequired
}

export default connect(
  jobsStore => ({ ...jobsStore }),
  jobsActions
)(JobsPanelEnvironmentVariables)
