import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import EnvironmentVariables from '../EnvironmentVariables/EnvironmentVariables'

import { panelActions } from '../../components/JobsPanel/panelReducer'
import { parseEnvVariables } from '../../utils/parseEnvironmentVariables'
import { generateEnvVariable } from '../../utils/generateEnvironmentVariable'
import jobsActions from '../../actions/jobs'
import KeyValueTable from '../../common/KeyValueTable/KeyValueTable'
import { useDemoMode } from '../../hooks/demoMode.hook'
import { ENV_VARIABLE_TYPE_VALUE } from '../../constants'

import './jobsPanelEnviromnetVariables.scss'

const JobsPanelEnvironmentVariables = ({
  jobsStore,
  panelDispatch,
  panelEnvData,
  previousPanelEnvData,
  setNewJobEnvironmentVariables
}) => {
  const isDemoMode = useDemoMode()

  const handleAddNewEnv = env => {
    const generatedVariable = generateEnvVariable(
      isDemoMode
        ? env
        : {
            name: env.key,
            value: env.value,
            type: ENV_VARIABLE_TYPE_VALUE
          }
    )

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
    let variables = []

    if (isDemoMode) {
      variables = env.map(item => generateEnvVariable(item))
    } else {
      const parsedEnv = parseEnvVariables(panelEnvData.map(env => env.data))
      variables = parsedEnv.map((item, index) => {
        if (index === env.index) {
          item.name = env.newKey ?? env.key
          item.value = env.value
        }

        return generateEnvVariable(item)
      })
    }

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
    let variables = []

    if (isDemoMode) {
      variables = env.map(item => generateEnvVariable(item))
    } else {
      const parsedEnv = parseEnvVariables(panelEnvData.map(env => env.data))
      variables = parsedEnv
        .filter((item, index) => index !== env)
        .map(item => generateEnvVariable(item))
    }

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
    <>
      {isDemoMode ? (
        <EnvironmentVariables
          envVariables={parseEnvVariables(panelEnvData.map(env => env.data))}
          handleAddNewEnv={handleAddNewEnv}
          handleDeleteEnv={handleDeleteEnv}
          handleEditEnv={handleEditEnv}
        />
      ) : (
        <KeyValueTable
          addNewItem={handleAddNewEnv}
          addNewItemLabel="Add variable"
          className="env"
          content={parseEnvVariables(panelEnvData.map(env => env.data)).map(
            env => {
              return {
                key: env.name,
                value: env.value,
                type: env.type
              }
            }
          )}
          deleteItem={handleDeleteEnv}
          editItem={handleEditEnv}
          isKeyRequired={true}
          isValueRequired={true}
          keyHeader="Variable name"
          keyLabel="Name"
          valueHeader="Value"
          valueLabel="Value"
          withEditMode
        />
      )}
    </>
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
