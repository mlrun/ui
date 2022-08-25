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

import PanelSection from '../PanelSection/PanelSection'
import KeyValueTable from '../../common/KeyValueTable/KeyValueTable'
import EnvironmentVariables from '../EnvironmentVariables/EnvironmentVariables'

import './functionPanelEnviromnetVariables.scss'

const FunctionsPanelEnvironmentVariablesView = ({
  envVariables,
  handleAddNewEnv,
  handleDeleteEnv,
  handleEditEnv,
  isStagingMode
}) => {
  return isStagingMode ? (
    <EnvironmentVariables
      envVariables={envVariables}
      handleAddNewEnv={handleAddNewEnv}
      handleDeleteEnv={handleDeleteEnv}
      handleEditEnv={handleEditEnv}
    />
  ) : (
    <div className="functions-panel__item advanced new-item-side-panel__item">
      <PanelSection title="Environment Variables">
        <KeyValueTable
          addNewItem={handleAddNewEnv}
          addNewItemLabel="Add variable"
          className="env"
          content={envVariables.map(env => ({
            key: env.name,
            value: env.value
          }))}
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
      </PanelSection>
    </div>
  )
}

FunctionsPanelEnvironmentVariablesView.propTypes = {
  envVariables: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string,
      valueFrom: PropTypes.shape({
        name: PropTypes.string,
        key: PropTypes.string
      }),
      ui: PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
      })
    })
  ).isRequired,
  handleAddNewEnv: PropTypes.func.isRequired,
  handleDeleteEnv: PropTypes.func.isRequired,
  handleEditEnv: PropTypes.func.isRequired,
  isStagingMode: PropTypes.bool.isRequired
}

export default FunctionsPanelEnvironmentVariablesView
