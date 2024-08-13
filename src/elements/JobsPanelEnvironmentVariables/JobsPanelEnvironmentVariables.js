/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import EnvironmentVariables from '../EnvironmentVariables/EnvironmentVariables'

import { panelActions } from '../../components/JobsPanel/panelReducer'
import { parseEnvVariables } from '../../utils/parseEnvironmentVariables'
import { generateEnvVariable } from '../../utils/generateEnvironmentVariable'
import jobsActions from '../../actions/jobs'
import KeyValueTable from '../../common/KeyValueTable/KeyValueTable'
import { useMode } from '../../hooks/mode.hook'
import { ENV_VARIABLE_TYPE_VALUE } from '../../constants'

import './jobsPanelEnviromnetVariables.scss'

const JobsPanelEnvironmentVariables = ({
  jobsStore,
  panelDispatch,
  panelEnvData,
  previousPanelEnvData,
  isPanelEditMode = false,
  setNewJobEnvironmentVariables
}) => {
  const { isStagingMode } = useMode()

  const handleAddNewEnv = env => {
    const generatedVariable = generateEnvVariable(
      isStagingMode
        ? env
        : {
            name: env.key,
            value: env.value,
            type: ENV_VARIABLE_TYPE_VALUE
          }
    )

    setNewJobEnvironmentVariables([...jobsStore.newJob.function.spec.env, { ...generatedVariable }])
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

    if (isStagingMode) {
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

    if (isStagingMode) {
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
      {isStagingMode ? (
        <EnvironmentVariables
          envVariables={parseEnvVariables(panelEnvData.map(env => env.data))}
          handleAddNewEnv={handleAddNewEnv}
          handleDeleteEnv={handleDeleteEnv}
          handleEditEnv={handleEditEnv}
          isPanelEditMode={isPanelEditMode}
        />
      ) : (
        <KeyValueTable
          addNewItem={handleAddNewEnv}
          addNewItemLabel="Add variable"
          className="env"
          content={parseEnvVariables(panelEnvData.map(env => env.data)).map(env => {
            return {
              key: env.name,
              value: env.value,
              type: env.type
            }
          })}
          deleteItem={handleDeleteEnv}
          disabled={isPanelEditMode}
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
  isPanelEditMode: PropTypes.bool.isRequired,
  panelDispatch: PropTypes.func.isRequired,
  panelEnvData: PropTypes.arrayOf(PropTypes.shape).isRequired,
  previousPanelEnvData: PropTypes.arrayOf(PropTypes.shape).isRequired
}

export default connect(jobsStore => ({ ...jobsStore }), jobsActions)(JobsPanelEnvironmentVariables)
